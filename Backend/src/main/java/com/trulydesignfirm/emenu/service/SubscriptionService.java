package com.trulydesignfirm.emenu.service;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface SubscriptionService {
    Response activateTrial(String token, UUID subscriptionID);
    Response initiateSubscription(String token, UUID subscriptionID, boolean isUpgrade, boolean isAnnual);
    Response verifyPayment(String token, String paymentId, String orderId, String signature);
    Response verifyWebhook(String payload, String razorpaySignature);
    List<SubscriptionPlan> getAllSubscriptionPlans();
    List<SubscriptionPlan> getAllAvailableSubscriptionPlans();
    Response createSubscriptionPlan(SubscriptionPlan subscriptionPlan);
    Response createSubscriptionPlans(List<SubscriptionPlan> subscriptionPlans);
    Response deleteSubscriptionPlan(UUID planID);
}
