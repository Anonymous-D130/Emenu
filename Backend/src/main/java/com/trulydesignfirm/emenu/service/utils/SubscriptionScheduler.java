package com.trulydesignfirm.emenu.service.utils;

import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import com.trulydesignfirm.emenu.repository.SubscriptionPlanRepo;
import com.trulydesignfirm.emenu.repository.SubscriptionRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class SubscriptionScheduler {

    private final SubscriptionRepo subscriptionRepo;
    private final SubscriptionPlanRepo subscriptionPlanRepo;

    @Scheduled(cron = "0 0 0,12 * * ?")
    public void checkAndExpireSubscriptions() {
        log.info("Scheduled tasks started at {}", LocalDateTime.now());
        deactivateExpiredSubscriptions();
        removeScheduledPlans();
        log.info("Scheduled tasks completed at {}", LocalDateTime.now());
    }

    private void deactivateExpiredSubscriptions() {
        subscriptionRepo.findAll().forEach(subscription -> {
            if (subscription.isExpired()) {
                log.info("Deactivating subscription with ID: {}", subscription.getId());
                subscription.setStatus(SubscriptionStatus.EXPIRED);
                subscriptionRepo.save(subscription);
                log.info("Subscription with ID: {} has been marked as expired.", subscription.getId());
            }
        });
        log.info("Expired subscriptions deactivation process completed.");
    }

    public void removeScheduledPlans() {
        List<SubscriptionPlan> deletablePlans = subscriptionPlanRepo.findByAvailableFalse().stream()
                .filter(plan -> !subscriptionRepo.existsByPlanId(plan.getId()))
                .toList();
        if (deletablePlans.isEmpty()) {
            log.info("No plans found that are available for deletion.");
        } else {
            log.info("Found {} plans for deletion.", deletablePlans.size());
            subscriptionPlanRepo.deleteAll(deletablePlans);
            log.info("Successfully deleted {} plans.", deletablePlans.size());
        }
    }
}
