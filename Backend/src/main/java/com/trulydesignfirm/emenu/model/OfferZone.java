package com.trulydesignfirm.emenu.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
public class OfferZone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String offerName;
    private String description;
    private double discountPercentage;

    @ManyToOne
    private Restaurant restaurant;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private boolean active;
}