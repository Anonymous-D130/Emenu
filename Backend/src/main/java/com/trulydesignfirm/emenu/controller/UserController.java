package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.dto.EventDetails;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.Subscription;
import com.trulydesignfirm.emenu.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<LoginUser> profile(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(userService.getUserProfile(token));
    }

    @GetMapping("/subscription")
    public ResponseEntity<Subscription> subscription(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(userService.getUserSubscription(token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Response> resetPassword(@RequestParam String email) {
        Response response = userService.sendForgotPasswordLink(email);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/verify-token")
    public ResponseEntity<Boolean> verifyToken(@RequestParam String token, @RequestParam String email) {
        return ResponseEntity.ok().body(userService.isTokenValid(token, email));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<Response> updatePassword(@RequestParam String password,
                                                   @RequestParam String email,
                                                   @RequestParam String token) {
        Response response = userService.verifyForgotPasswordOtp(password, email, token);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/event-details/{restaurantId}")
    public ResponseEntity<Response> getEventDetails(@RequestBody EventDetails event, @PathVariable UUID restaurantId) {
        Response eventDetails = userService.getEventDetails(event, restaurantId);
        return ResponseEntity.status(eventDetails.getStatus()).body(eventDetails);
    }
}
