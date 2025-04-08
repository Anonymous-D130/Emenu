package com.trulydesignfirm.emenu.actions;

import lombok.Data;

import java.util.UUID;

@Data
public class ReviewRequest {
    private UUID orderId;
    private int overall;
    private int service;
    private int time;
    private int clothing;
    private int value;
    private String feedback;
}
