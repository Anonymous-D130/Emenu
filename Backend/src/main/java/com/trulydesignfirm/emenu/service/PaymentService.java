package com.trulydesignfirm.emenu.service;

import com.razorpay.RazorpayException;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public interface PaymentService {
    String createOrder(SubscriptionPlan plan, LoginUser user, BigDecimal amount, long duration, boolean isUpgrade) throws RazorpayException;
    String cancelOrder(String paymentId) throws RazorpayException;
}
