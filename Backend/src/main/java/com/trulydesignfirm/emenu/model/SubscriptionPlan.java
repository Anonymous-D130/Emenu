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

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal disPrice;

    @Column(nullable = false)
    private String description;

    @Min(value = 5, message = "menuCount must be at least 5")
    private Integer menuCount;

    @Min(value = 5, message = "qrCount must be at least 5")
    private Integer qrCount;

    private boolean ringBellIncluded;

    private boolean available = true;

    @ElementCollection
    private List<String> features;

    public BigDecimal getDisPrice() {
        return disPrice == null ? this.price : disPrice;
    }

    public long getDuration() {
        return 30L;
    }

    public long getTrialDuration() {
        return 30L;
    }
}