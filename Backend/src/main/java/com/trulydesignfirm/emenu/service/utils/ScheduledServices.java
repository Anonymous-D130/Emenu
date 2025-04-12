package com.trulydesignfirm.emenu.service.utils;

import com.trulydesignfirm.emenu.repository.CustomerRepo;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class ScheduledServices {

    private final CustomerRepo customerRepo;

    @Scheduled(cron = "0 0 0,12 * * ?")
    public void checkCustomers() {
        removeOldCustomers();
    }

    public void removeOldCustomers(){
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        customerRepo.deleteAll(customerRepo.findAllByLeftAtBefore(oneWeekAgo));
    }
}
