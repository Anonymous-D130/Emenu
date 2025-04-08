package com.trulydesignfirm.emenu.service;

import com.trulydesignfirm.emenu.actions.LoginRequest;
import com.trulydesignfirm.emenu.actions.LoginResponse;
import com.trulydesignfirm.emenu.actions.ProfileUpdateRequest;
import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.LoginUser;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    void register(LoginUser user);
    void exitsUser(LoginUser user);
    LoginResponse loginService(LoginRequest request);
    Response updateOauthProfile(LoginUser user, ProfileUpdateRequest request);
    void verifyEmail(String email);
}
