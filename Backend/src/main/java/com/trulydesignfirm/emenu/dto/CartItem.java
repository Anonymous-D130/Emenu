package com.trulydesignfirm.emenu.dto;

import com.trulydesignfirm.emenu.model.Food;
import lombok.Data;

@Data
public class CartItem {

    private int quantity;
    private Food food;
    private double amount;
    private Cart cart;
}