package com.trulydesignfirm.emenu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private LoginUser owner;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(endDate);
    }
}