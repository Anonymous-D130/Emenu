package com.trulydesignfirm.emenu.service.impl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.PaymentDetails;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import com.trulydesignfirm.emenu.repository.PaymentRepo;
import com.trulydesignfirm.emenu.service.PaymentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    @Value("${razorpay.currency}")
    private String currency;

    private final PaymentRepo paymentRepo;
    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(keyId, keySecret);
    }

    @Override
    @Transactional
    public String createOrder(SubscriptionPlan plan, LoginUser user, BigDecimal amount, long planDuration, boolean isUpgrade) throws RazorpayException {
        if (!isUpgrade && (user.getSubscription() != null && !user.getSubscription().isExpired())) {
            throw new IllegalStateException("User already has an active subscription");
        }
        int amountInPaise = amount.multiply(BigDecimal.valueOf(100)).intValueExact();
        return getString(plan, user, amountInPaise, planDuration);
    }

    @Override
    public String cancelOrder(String paymentId) throws RazorpayException {
        if(paymentId == null || paymentId.isEmpty()) {
            return "No refund applicable.";
        }
        PaymentDetails order = paymentRepo.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", order.getAmount().multiply(BigDecimal.valueOf(100)).intValueExact());
        refundRequest.put("speed", "normal");
        refundRequest.put("receipt", "txn_" + System.currentTimeMillis());
        Refund refund = razorpayClient.payments.refund(paymentId, refundRequest);
        order.setRefundId(refund.get("id"));
        order.setOrderStatus("REFUNDED");
        paymentRepo.save(order);
        return "Refund successful. Refund ID: " + refund.get("id");
    }

    private String getString(SubscriptionPlan plan, LoginUser user, int amountInPaise, long planDuration) throws RazorpayException {
        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", currency);
        options.put("receipt", "txn_" + System.currentTimeMillis());
        options.put("payment_capture", 1);
        Order order = razorpayClient.orders.create(options);
        savePaymentDetails(order, user, plan, planDuration);
        return order.get("id");
    }

    private void savePaymentDetails(Order order, LoginUser user, SubscriptionPlan plan, long planDuration) {
        PaymentDetails details = paymentRepo.getPaymentDetailsByUser(user).orElse(new PaymentDetails());
        details.setUser(user);
        details.setPlan(plan);
        details.setDuration(planDuration);
        Object amountObj = order.get("amount");
        if (amountObj == null) {
            throw new IllegalArgumentException("Amount is missing in Razorpay order");
        }
        BigDecimal amount = new BigDecimal(amountObj.toString())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        details.setAmount(amount);
        details.setOrderId(order.get("id"));
        details.setReceipt(order.get("receipt"));
        details.setOrderStatus("CREATED");
        paymentRepo.save(details);
    }
}
