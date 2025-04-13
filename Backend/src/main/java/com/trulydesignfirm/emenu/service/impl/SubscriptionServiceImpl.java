package com.trulydesignfirm.emenu.service.impl;

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
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    private final Utility utility;
    private final EmailStructures emailStructures;
    private final EmailService emailService;

    @Value("${razorpay.key_secret}")
    private String razorpaySecret;

    private final PaymentService paymentService;
    private final SubscriptionRepo subscriptionRepo;
    private final SubscriptionPlanRepo subscriptionPlanRepo;
    private final PaymentRepo paymentRepo;

    @Override
    @Transactional
    public Response initiateSubscription(String token, UUID subscriptionID) {
        SubscriptionPlan subscriptionPlan = subscriptionPlanRepo.findById(subscriptionID).
                orElseThrow(() -> new RuntimeException("Invalid subscription Plan"));
        LoginUser user = utility.getUserFromToken(token);
        try {
            String razorpayOrderId;
            int amount;
            if(user.getSubscription() == null && subscriptionPlan.getTrialDuration() > 0) {
                razorpayOrderId = paymentService.createTrial(subscriptionPlan, user);
                amount = 200;
            } else {
                razorpayOrderId = paymentService.createOrder(subscriptionPlan, user);
                amount = subscriptionPlan.getPrice().intValueExact();
            }
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
    @Transactional
    public Response verifyPayment(String token, String paymentId, String orderId, String signature) {
        LoginUser user = utility.getUserFromToken(token);
        Response response = new Response();
        try {
            String payload = orderId + "|" + paymentId;

            String expectedSignature = hmacSHA256(payload, razorpaySecret);
            if (!expectedSignature.equalsIgnoreCase(signature)) {
                response.setStatus(HttpStatus.UNAUTHORIZED);
                response.setMessage("Payment verification failed. Invalid signature.");
                return response;
            }
            log.info("Verifying payment for Order ID: {}", orderId);
            PaymentDetails paymentDetails = paymentRepo.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Invalid orderId: " + orderId));
            log.info("Payment ID: {}", paymentId);
            paymentDetails.setOrderStatus("PAID");
            paymentDetails.setPaymentId(paymentId);
            paymentRepo.save(paymentDetails);
            saveSubscriptionPlan(paymentDetails, user, paymentDetails.getDuration());
            String body = emailStructures.generateSubscriptionSuccessEmail(user.getName(), paymentDetails.getPlan());
            emailService.sendEmail(user.getEmail(), "🥳 Congrats! You’ve Subscribed", body);
            response.setMessage("Subscription purchased successfully.");
            response.setStatus(HttpStatus.OK);
        } catch (Exception e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setMessage(e.getMessage());
        }
        return response;
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
    public Response updateSubscriptionPlan(UUID planID, SubscriptionPlan subscriptionPlan) {
        Response response = new Response();
        SubscriptionPlan oldSubscriptionPlan = subscriptionPlanRepo.findById(planID)
                .orElseThrow(() -> new RuntimeException("Invalid subscription Plan"));
        isEmptyPlanBody(subscriptionPlan);
        oldSubscriptionPlan.setDescription(subscriptionPlan.getDescription());
        oldSubscriptionPlan.setTitle(subscriptionPlan.getTitle());
        oldSubscriptionPlan.setPrice(subscriptionPlan.getPrice());
        oldSubscriptionPlan.setFeatures(subscriptionPlan.getFeatures());
        subscriptionPlanRepo.save(subscriptionPlan);
        response.setMessage("Subscription plan created.");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public Response deleteSubscriptionPlan(UUID planID) {
        Response response = new Response();
        subscriptionPlanRepo.findById(planID)
                .orElseThrow(() -> new RuntimeException("Invalid subscription Plan"));
        subscriptionPlanRepo.deleteById(planID);
        response.setMessage("Subscription plan removed.");
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

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        return Hex.encodeHexString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
    }

    private void saveSubscriptionPlan(PaymentDetails paymentDetails, LoginUser user, long days) {
        Subscription subscription = subscriptionRepo.getSubscriptionByOwner(user).orElse(new Subscription());
        subscription.setPlan(paymentDetails.getPlan());
        subscription.setOwner(user);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(days));
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepo.save(subscription);
    }
}
