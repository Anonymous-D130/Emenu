package com.trulydesignfirm.emenu.actions;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderResponse {
    private String message;
    private BigDecimal totalAmount;
}