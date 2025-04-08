package com.trulydesignfirm.emenu.actions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse extends Response {
    private String token;
    private String role;
    private String email;
}
