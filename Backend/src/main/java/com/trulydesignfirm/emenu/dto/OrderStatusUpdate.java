package com.trulydesignfirm.emenu.dto;

import com.trulydesignfirm.emenu.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class OrderStatusUpdate {
    private UUID orderId;
    private OrderStatus status;
}