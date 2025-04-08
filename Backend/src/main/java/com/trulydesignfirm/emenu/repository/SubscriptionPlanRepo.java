package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface SubscriptionPlanRepo extends JpaRepository<SubscriptionPlan, UUID> {
    List<SubscriptionPlan> findAllByOrderByPriceAsc();

    boolean existsByTitleAndPriceAndDescription(String title, BigDecimal price, String description);
}
