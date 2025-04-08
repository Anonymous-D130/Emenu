package com.trulydesignfirm.emenu.service.impl;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.Subscription;
import com.trulydesignfirm.emenu.repository.SubscriptionRepo;
import com.trulydesignfirm.emenu.repository.UserRepo;
import com.trulydesignfirm.emenu.service.AuthService;
import com.trulydesignfirm.emenu.service.UserService;
import com.trulydesignfirm.emenu.service.utils.OtpService;
import com.trulydesignfirm.emenu.service.utils.Utility;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final Utility utility;
    private final SubscriptionRepo subscriptionRepo;

    @Override
    public LoginUser getUserProfile(String token) {
        return utility.getUserFromToken(token);
    }

    @Override
    public Subscription getUserSubscription(String token) {
        return subscriptionRepo.getSubscriptionByOwner(utility.getUserFromToken(token))
                .orElseThrow(() -> new RuntimeException("No Subscription details found"));
    }

    @Override
    public Response sendForgotPasswordLink(String email) {
        Response response = new Response();
        if ((email == null || email.isEmpty())) {
            throw new IllegalArgumentException("Please provide at least one of email or mobile.");
        }
        authService.verifyEmail(email);
        otpService.sendPasswordResetLink(email, "Reset Password");
        response.setMessage("Email sent successfully.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response verifyForgotPasswordOtp(String password, String email, String emailOtp) {
        Response response = new Response();
        if ((email == null || email.isEmpty())) {
            throw new IllegalArgumentException("Please provide email.");
        }
        boolean isEmailOtpValid = emailOtp != null && !emailOtp.isEmpty() && otpService.validateOtp(email, emailOtp);
        LoginUser user = null;
        if (isEmailOtpValid) {
            user = userRepo.findByEmail(email).orElse(null);
        }
        if (user == null) {
            throw new IllegalArgumentException("User not found.");
        }
        user.setPassword(passwordEncoder.encode(password));
        userRepo.save(user);
        response.setMessage("Password updated successfully.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public void isTokenValid(String token, String email) {
        if ((email == null || email.isEmpty())) {
            throw new IllegalArgumentException("Please provide email.");
        }
        boolean isEmailOtpValid = token != null && !token.isEmpty() && otpService.isTokenValid(email, token);
        if (isEmailOtpValid)
            userRepo.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

}
