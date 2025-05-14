package com.trulydesignfirm.emenu.service.impl;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.dto.EventDetails;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.Subscription;
import com.trulydesignfirm.emenu.records.Dashboard;
import com.trulydesignfirm.emenu.records.Partners;
import com.trulydesignfirm.emenu.repository.SubscriptionPlanRepo;
import com.trulydesignfirm.emenu.repository.SubscriptionRepo;
import com.trulydesignfirm.emenu.repository.UserRepo;
import com.trulydesignfirm.emenu.service.AuthService;
import com.trulydesignfirm.emenu.service.RestaurantService;
import com.trulydesignfirm.emenu.service.UserService;
import com.trulydesignfirm.emenu.service.utils.EmailService;
import com.trulydesignfirm.emenu.service.utils.EmailStructures;
import com.trulydesignfirm.emenu.service.utils.OtpService;
import com.trulydesignfirm.emenu.service.utils.Utility;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final Utility utility;
    private final SubscriptionRepo subscriptionRepo;
    private final EmailService emailService;
    private final RestaurantService restaurantService;
    private final EmailStructures emailStructures;
    private final SubscriptionPlanRepo subscriptionPlanRepo;

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
    public Response getEventDetails(EventDetails event, UUID restaurantId) {
        LoginUser user = restaurantService.getRestaurantById(restaurantId).getOwner();
        String body = emailStructures.generateEventInquiryEmail(event.getName(), event.getEmail(), event.getMobile(), event.getEventDetails());
        emailService.sendEmail(user.getEmail(), "📩 New Catering Inquiry from " + event.getName(), body);
        Response response = new Response();
        response.setMessage("Event details received successfully.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public List<Partners> getAllPartners() {
        return restaurantService.getAllRestaurants()
                .stream().filter(res -> res.getOwner().getSubscription() != null)
                .map(res -> new Partners(
                        res.getOwner(),
                        res,
                        res.getOwner().getSubscription()
                ))
                .toList();
    }

    @Override
    public List<Dashboard> getAllDashboardData() {
        return restaurantService.getAllRestaurants()
                .stream()
                .filter(res -> res.getOwner().getSubscription() != null)
                .map(res -> {
                    var subscription = res.getOwner().getSubscription();
                    var plan = subscription.getPlan();
                    var startDate = subscription.getStartDate().toLocalDate();
                    var endDate = subscription.getEndDate().toLocalDate();
                    long remainingDays = ChronoUnit.DAYS.between(LocalDate.now(), endDate) + 1;
                    return new Dashboard(
                            res.getName(),
                            plan,
                            startDate,
                            endDate,
                            remainingDays,
                            !subscription.isExpired(),
                            plan.getPrice(),
                            restaurantService.getOrdersByRestaurant(res).size(),
                            subscription.getStatus()
                    );
                })
                .toList();
    }

    @Override
    public Response updatePlan(UUID userId, UUID planId, LocalDate endDate) {
        Response response = new Response();
        LoginUser owner = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));
        Subscription subscription = owner.getSubscription();
        subscriptionPlanRepo.findById(planId)
                .ifPresent(subscription::setPlan);
        subscription.setEndDate(LocalDateTime.of(endDate, LocalTime.of(23, 59, 59)));
        subscriptionRepo.save(subscription);
        String body = emailStructures.generateSubscriptionUpdateEmail(owner.getName(), subscription.getPlan(),
                ChronoUnit.DAYS.between(LocalDate.now(), endDate));
        String subject = "Your Subscription plan has been revised!";
        emailService.sendEmail(owner.getEmail(), subject, body);
        response.setMessage("Plan updated successfully.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public boolean isTokenValid(String token, String email) {
        if ((email == null || email.isEmpty())) {
            throw new IllegalArgumentException("Please provide email.");
        }
        return token != null && !token.isEmpty() && otpService.isTokenValid(email, token);
    }

}
