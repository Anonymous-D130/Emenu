package com.trulydesignfirm.emenu.service.utils;

import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.repository.SubscriptionRepo;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SubscriptionScheduler {

    private final SubscriptionRepo subscriptionRepo;

    @Scheduled(cron = "0 0 0 * * ?")
    public void checkAndExpireSubscriptions() {
        deactivateExpiredSubscriptions();
    }

    private void deactivateExpiredSubscriptions() {
        subscriptionRepo.findAll().forEach(subscription -> {
            if (subscription.isExpired()) {
                subscription.setStatus(SubscriptionStatus.EXPIRED);
                subscriptionRepo.save(subscription);
            }
        });
    }
}
