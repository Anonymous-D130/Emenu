package com.trulydesignfirm.emenu.service.utils;

import com.trulydesignfirm.emenu.configuration.JwtUtils;
import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class Utility {

    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;

    public LoginUser getUserFromToken(String token) {
        token = token.replace("Bearer ", "");
        String email = jwtUtils.parseToken(token).getSubject();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));
    }
}
