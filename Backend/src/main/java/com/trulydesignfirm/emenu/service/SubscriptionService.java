package com.trulydesignfirm.emenu.service;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface SubscriptionService {
    Response initiateSubscription(String token, UUID subscriptionID);
    Response verifyPayment(String token, String paymentId, String orderId, String signature);
    List<SubscriptionPlan> getAllSubscriptionPlans();
    Response createSubscriptionPlan(SubscriptionPlan subscriptionPlan);
    Response createSubscriptionPlans(List<SubscriptionPlan> subscriptionPlans);
    Response updateSubscriptionPlan(UUID planID, SubscriptionPlan subscriptionPlan);
    Response deleteSubscriptionPlan(UUID planID);
}
