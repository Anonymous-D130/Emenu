package com.trulydesignfirm.emenu.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private BigDecimal price;

    @Min(value = 1, message = "Duration must be at least 1 day")
    @Column(nullable = false)
    private Long duration;    //days

    private long trialDuration;    //days

    @Column(nullable = false)
    private String description;

    @ElementCollection
    private List<String> features;
}