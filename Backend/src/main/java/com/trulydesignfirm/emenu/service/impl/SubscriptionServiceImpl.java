package com.trulydesignfirm.emenu.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.RazorpayException;
import com.trulydesignfirm.emenu.actions.PaymentResponse;
import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.PaymentDetails;
import com.trulydesignfirm.emenu.model.Subscription;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import com.trulydesignfirm.emenu.repository.PaymentRepo;
import com.trulydesignfirm.emenu.repository.SubscriptionPlanRepo;
import com.trulydesignfirm.emenu.repository.SubscriptionRepo;
import com.trulydesignfirm.emenu.service.PaymentService;
import com.trulydesignfirm.emenu.service.SubscriptionService;
import com.trulydesignfirm.emenu.service.utils.EmailService;
import com.trulydesignfirm.emenu.service.utils.EmailStructures;
import com.trulydesignfirm.emenu.service.utils.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.razorpay.Utils.verifySignature;
import static com.razorpay.Utils.verifyWebhookSignature;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    @Value("${razorpay.key_secret}")
    private String razorpaySecret;

    @Value("${razorpay.webhook_secret}")
    private String webhookSecret;

    private final Utility utility;
    private final EmailStructures emailStructures;
    private final EmailService emailService;
    private final PaymentService paymentService;
    private final SubscriptionRepo subscriptionRepo;
    private final SubscriptionPlanRepo subscriptionPlanRepo;
    private final PaymentRepo paymentRepo;

    @Override
    @Transactional
    public Response initiateSubscription(String token, UUID subscriptionID) {
        SubscriptionPlan subscriptionPlan = subscriptionPlanRepo.findById(subscriptionID).
                orElseThrow(() -> new RuntimeException("Invalid subscription Plan"));
        if(!subscriptionPlan.isAvailable()) {
            throw new RuntimeException("Subscription plan is not available");
        }
        LoginUser user = utility.getUserFromToken(token);
        try {
            String razorpayOrderId = paymentService.createOrder(subscriptionPlan, user);
            int amount = subscriptionPlan.getPrice().intValueExact();
            PaymentResponse response = new PaymentResponse();
            response.setMessage("Payment initiated. Complete payment to confirm order.");
            response.setStatus(HttpStatus.OK);
            response.setData(Map.of("razorpay_order_id", razorpayOrderId, "amount", amount));
            return response;
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    @Override
    public Response activateTrial(String token, UUID subscriptionID) {
        Response response = new Response();
        LoginUser user = utility.getUserFromToken(token);
        Subscription subscription = user.getSubscription();
        if (subscription != null) {
            throw new RuntimeException("You are not eligible for free trial");
        }
        SubscriptionPlan subscriptionPlan = subscriptionPlanRepo.findById(subscriptionID).
                orElseThrow(() -> new RuntimeException("Invalid subscription Plan"));
        if(subscriptionPlan.getTrialDuration() == 0) {
            throw new RuntimeException("This plan does not offer any free trial");
        }
        if(!subscriptionPlan.isAvailable()) {
            throw new RuntimeException("Subscription plan is not available");
        }
        PaymentDetails details = new PaymentDetails();
        details.setUser(user);
        details.setPlan(subscriptionPlan);
        details.setDuration(subscriptionPlan.getTrialDuration());
        details.setAmount(new BigDecimal(0));
        details.setOrderId(null);
        details.setReceipt(null);
        details.setOrderStatus("PAID");
        details.setPaymentId(UUID.randomUUID().toString());
        paymentRepo.save(details);
        saveSubscriptionPlan(details, user, details.getDuration());
        String body = emailStructures.generateTrialSubscriptionEmail(user.getName(), details.getPlan());
        emailService.sendEmail(user.getEmail(), "🥳 Congrats! Your free trial Activated", body);
        response.setMessage("Trial activated successfully.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    @Transactional
    public Response verifyPayment(String token, String paymentId, String orderId, String signature) {
        LoginUser user = utility.getUserFromToken(token);
        Response response = new Response();
        try {
            String payload = orderId + "|" + paymentId;
            if(!verifySignature(payload, signature, razorpaySecret)) {
                response.setStatus(HttpStatus.UNAUTHORIZED);
                response.setMessage("Payment verification failed. Invalid signature.");
                return response;
            }
            log.info("Verifying payment for Order ID: {}", orderId);
            PaymentDetails paymentDetails = paymentRepo.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Invalid orderId: " + orderId));
            manageVerifiedPayment(response, paymentId, paymentDetails, user, orderId);
        } catch (RazorpayException e) {
            response.setStatus(HttpStatus.UNAUTHORIZED);
            response.setMessage("Payment verification failed. Invalid signature.");
        } catch (Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public Response verifyWebhook(String payload, String razorpaySignature) {
        Response response = new Response();
        try {
            if(!verifyWebhookSignature(payload, razorpaySignature, webhookSecret)) {
                response.setStatus(HttpStatus.UNAUTHORIZED);
                response.setMessage("Payment verification failed. Invalid signature.");
                return response;
            }
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);
            String eventType = rootNode.path("event").asText();
            JsonNode paymentEntity = rootNode.path("payload").path("payment").path("entity");
            String orderId = paymentEntity.path("order_id").asText();
            String paymentId = paymentEntity.path("id").asText();
            int amount = paymentEntity.path("amount").asInt();
            if ("payment.captured".equals(eventType)) {
                log.info("Payment captured! OrderId: {}, PaymentId: {}, Amount: {}", orderId, paymentId, amount);
                PaymentDetails paymentDetails = paymentRepo.findByOrderId(orderId)
                        .orElseThrow(() -> new RuntimeException("Invalid orderId: " + orderId));
                LoginUser user = paymentDetails.getUser();
                manageVerifiedPayment(response, paymentId, paymentDetails, user, orderId);
            } else {
                response.setStatus(HttpStatus.OK);
                response.setMessage("Event received but not handled: " + eventType);
            }
        } catch (RazorpayException e) {
            response.setStatus(HttpStatus.UNAUTHORIZED);
            response.setMessage("Payment verification failed. Invalid signature.");
        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setMessage("Internal error occurred while processing the webhook.");
        }
        return response;
    }

    @Override
    public List<SubscriptionPlan> getAllAvailableSubscriptionPlans() {
        return subscriptionPlanRepo.findAllByAvailableTrueOrderByPriceAsc();
    }

    @Override
    public List<SubscriptionPlan> getAllSubscriptionPlans() {
        return subscriptionPlanRepo.findAllByOrderByPriceAsc();
    }

    @Override
    public Response createSubscriptionPlan(SubscriptionPlan subscriptionPlan) {
        Response response = new Response();
        isEmptyPlanBody(subscriptionPlan);
        boolean exists = subscriptionPlanRepo.existsByTitleAndPriceAndDescription(subscriptionPlan.getTitle(),
                subscriptionPlan.getPrice(),
                subscriptionPlan.getDescription()
        );
        if (exists) {
            response.setMessage("Similar Subscription plan already exists.");
            response.setStatus(HttpStatus.CONFLICT);
            return response;
        }
        subscriptionPlanRepo.save(subscriptionPlan);
        response.setMessage("Subscription plan created.");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    @Transactional
    public Response createSubscriptionPlans(List<SubscriptionPlan> subscriptionPlans) {
        Response response = new Response();
        List<SubscriptionPlan> newPlans = subscriptionPlans.stream()
                .filter(plan -> !subscriptionPlanRepo.existsByTitleAndPriceAndDescription(
                        plan.getTitle(), plan.getPrice(), plan.getDescription()))
                .toList();
        subscriptionPlanRepo.saveAll(newPlans);
        response.setMessage("Subscription plans created.");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public Response deleteSubscriptionPlan(UUID planID) {
        Response response = new Response();
        SubscriptionPlan plan = subscriptionPlanRepo.findById(planID)
                .orElseThrow(() -> new RuntimeException("Invalid subscription Plan"));
        if (!subscriptionRepo.existsByPlanId(planID)) {
            subscriptionPlanRepo.deleteById(planID);
            response.setMessage("Subscription plan removed.");
        } else {
            plan.setAvailable(false);
            subscriptionPlanRepo.save(plan);
            response.setMessage("Subscription plan queued for deletion.");
        }
        response.setStatus(HttpStatus.OK);
        return response;
    }

    private void isEmptyPlanBody(SubscriptionPlan subscriptionPlan) {
        if(subscriptionPlan.getFeatures() == null || subscriptionPlan.getFeatures().isEmpty()
                || subscriptionPlan.getDescription() == null || subscriptionPlan.getDescription().isEmpty()
                || subscriptionPlan.getTitle() == null || subscriptionPlan.getTitle().isEmpty()
                || subscriptionPlan.getPrice() == null || subscriptionPlan.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Missing Plan Details");
        }
    }

    private void manageVerifiedPayment(Response response, String paymentId, PaymentDetails paymentDetails, LoginUser user, String orderId) {
        if ("PAID".equalsIgnoreCase(paymentDetails.getOrderStatus())) {
            log.info("Order {} already processed. Skipping duplicate handling.", orderId);
            response.setStatus(HttpStatus.OK);
            response.setMessage("Order already processed.");
            return;
        }
        log.info("Payment ID: {}", paymentId);
        paymentDetails.setOrderStatus("PAID");
        paymentDetails.setPaymentId(paymentId);
        paymentRepo.save(paymentDetails);
        saveSubscriptionPlan(paymentDetails, user, paymentDetails.getDuration());
        String body = emailStructures.generateSubscriptionSuccessEmail(user.getName(), paymentDetails.getPlan());
        emailService.sendEmail(user.getEmail(), "🥳 Congrats! You’ve Subscribed", body);
        response.setMessage("Subscription purchased successfully.");
        response.setStatus(HttpStatus.OK);
    }

    private void saveSubscriptionPlan(PaymentDetails paymentDetails, LoginUser user, long days) {
        Subscription subscription = subscriptionRepo.getSubscriptionByOwner(user).orElse(new Subscription());
        subscription.setPlan(paymentDetails.getPlan());
        subscription.setOwner(user);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusDays(days));
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepo.save(subscription);
    }
}
