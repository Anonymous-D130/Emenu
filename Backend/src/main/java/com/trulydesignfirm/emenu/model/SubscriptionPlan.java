package com.trulydesignfirm.emenu.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private BigDecimal price;

    @Positive(message = "Duration must be a positive number")
    @Column(nullable = false)
    private Long duration;    //days

    @Min(value = 0, message = "Trial duration cannot be negative")
    private Long trialDuration;    //days

    @Column(nullable = false)
    private String description;

    private Integer menuCount;
    private Integer qrCount;
    private boolean ringBellIncluded;

    private boolean available = true;

    @ElementCollection
    private List<String> features;
}