package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.actions.LoginRequest;
import com.trulydesignfirm.emenu.actions.LoginResponse;
import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.service.AuthService;
import com.trulydesignfirm.emenu.service.utils.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @Value("${menu.company.name}")
    private String companyName;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.loginService(loginRequest));
    }

    @PostMapping("/get-otp")
    public ResponseEntity<Response> generateOtp(@RequestBody LoginUser user) {
        Response response = new Response();
        authService.exitsUser(user);
        otpService.generateAndSendOtp(user.getEmail(), "OTP to register in %s".formatted(companyName));
        response.setMessage("OTP sent successfully to email. Please verify OTP to complete registration.");
        response.setStatus(HttpStatus.OK);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Response> register(
            @RequestBody LoginUser user,
            @RequestParam String otp) {
        if (otp == null || otp.isEmpty()) {
            throw new BadCredentialsException("Email OTP cannot be empty.");
        }
        boolean isEmailOtpValid = otpService.validateOtp(user.getEmail(), otp);
        if(!isEmailOtpValid){
            throw new BadCredentialsException("Email OTP is not valid");
        }
        authService.register(user);
        Response response = new Response();
        response.setStatus(HttpStatus.CREATED);
        response.setMessage("User registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


}