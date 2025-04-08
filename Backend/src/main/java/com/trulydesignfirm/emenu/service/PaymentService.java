package com.trulydesignfirm.emenu.service;

import com.razorpay.RazorpayException;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    String createTrial(SubscriptionPlan plan, LoginUser user) throws RazorpayException;
    String createOrder(SubscriptionPlan plan, LoginUser user) throws RazorpayException;
    String cancelOrder(String paymentId) throws RazorpayException;
}
