package com.trulydesignfirm.emenu.actions;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class PaymentResponse extends Response {
    private Map<?,?> data;
}
