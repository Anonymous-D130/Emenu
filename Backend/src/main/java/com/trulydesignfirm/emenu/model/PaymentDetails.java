package com.trulydesignfirm.emenu.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
public class PaymentDetails {

    @Id
    private String orderId;
    private BigDecimal amount;
    private String receipt;
    private String orderStatus;
    private String paymentId;
    private String refundId;
    private Long duration;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan plan;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private LoginUser user;


}
