package com.trulydesignfirm.emenu.actions;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class Response {
    private String message;
    private HttpStatus status;
}
