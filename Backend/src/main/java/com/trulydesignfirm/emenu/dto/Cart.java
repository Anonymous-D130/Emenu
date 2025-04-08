package com.trulydesignfirm.emenu.dto;

import lombok.Data;

import java.util.List;

@Data
public class Cart {
    private List<CartItem> items;
    private double totalAmount;
}