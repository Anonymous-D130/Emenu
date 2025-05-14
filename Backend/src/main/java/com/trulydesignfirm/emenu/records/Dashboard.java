package com.trulydesignfirm.emenu.records;

import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Dashboard(
        String restaurantName,
        SubscriptionPlan subscriptionPlan,
        LocalDate startDate,
        LocalDate endDate,
        long remainingDays,
        boolean isActive,
        BigDecimal amountPaid,
        int totalOrders,
        SubscriptionStatus planStatus
) {}