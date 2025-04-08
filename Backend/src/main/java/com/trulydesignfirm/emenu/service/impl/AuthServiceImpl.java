package com.trulydesignfirm.emenu.service.impl;

import com.trulydesignfirm.emenu.actions.LoginRequest;
import com.trulydesignfirm.emenu.actions.LoginResponse;
import com.trulydesignfirm.emenu.actions.ProfileUpdateRequest;
import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.configuration.CustomUserDetailsService;
import com.trulydesignfirm.emenu.configuration.JwtUtils;
import com.trulydesignfirm.emenu.enums.Role;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.repository.UserRepo;
import com.trulydesignfirm.emenu.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional
    public void register(LoginUser user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        user.setRole(user.getRole() == null ? Role.OWNER : user.getRole());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
    }

    @Override
    public void exitsUser(LoginUser user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    @Override
    public LoginResponse loginService(LoginRequest request) {
        LoginUser user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Bad credentials"));
        LoginResponse loginResponse = new LoginResponse();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails);
        loginResponse.setToken(token);
        loginResponse.setRole(user.getRole().name());
        loginResponse.setStatus(HttpStatus.OK);
        loginResponse.setEmail(user.getEmail());
        loginResponse.setMessage("Successfully logged in");
        return loginResponse;
    }

    @Override
    public Response updateOauthProfile(LoginUser user, ProfileUpdateRequest request) {
        if(request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepo.save(user);
        Response response = new Response();
        response.setMessage("Profile updated successfully!");
        response.setStatus(HttpStatus.ACCEPTED);
        return response;
    }

    @Override
    public void verifyEmail(String email){
        userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("No user found with provided email address!"));
    }

}