package com.trulydesignfirm.emenu.service;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.Subscription;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    LoginUser getUserProfile(String token);
    Subscription getUserSubscription(String token);
    Response sendForgotPasswordLink(String email);
    void isTokenValid(String token, String email);
    Response verifyForgotPasswordOtp( String password, String email, String emailOtp);
}
