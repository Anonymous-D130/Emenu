package com.trulydesignfirm.emenu.service.utils;

import com.trulydesignfirm.emenu.model.*;
import com.trulydesignfirm.emenu.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class ScheduledServices {

    private final CustomerRepo customerRepo;
    private final FoodRepo foodRepo;
    private final RestaurantRepo restaurantRepo;
    private final FileRepo fileRepo;
    private final Utility utility;

    @Scheduled(cron = "0 0 0,12 * * ?")
    public void checkCustomers() {
        log.info("Scheduled tasks started at {}", LocalDateTime.now());
        removeOldCustomers();
        cleanUnusedFiles();
        log.info("Scheduled tasks completed at {}", LocalDateTime.now());
    }

    public void removeOldCustomers(){
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        List<Customer> oldCustomers = customerRepo.findAllByLeftAtBefore(oneWeekAgo);

        if (oldCustomers.isEmpty()) {
            log.info("No old customers to delete.");
        } else {
            customerRepo.deleteAll(oldCustomers);
            log.info("Deleted {} old customers who left before {}", oldCustomers.size(), oneWeekAgo);
        }
    }

    public void cleanUnusedFiles(){
        Set<String> usedImageIds = fetchUsedImageIds();
        List<ImageFile> allFiles = fileRepo.findAll();
        List<ImageFile> unusedFiles = allFiles.stream()
                .filter(file -> !usedImageIds.contains(file.getId().toString()))
                .collect(Collectors.toList());

        if (unusedFiles.isEmpty()) {
            log.info("No unused image files to delete.");
        } else {
            fileRepo.deleteAll(unusedFiles);
            log.info("Deleted {} unused image files.", unusedFiles.size());
        }
    }

    private Set<String> fetchUsedImageIds() {
        List<List<String>> allQrCodes = restaurantRepo.findAllQrCodes();
        List<String> qrCodes = allQrCodes.stream()
                .flatMap(List::stream)
                .toList();
        List<Restaurant> restaurants = restaurantRepo.findAll();
        List<Food> foods = foodRepo.findAll();
        List<String> usedImageUrls = new ArrayList<>();

        usedImageUrls.addAll(restaurants.stream()
                .map(Restaurant::getLogo)
                .filter(Objects::nonNull)
                .toList());

        usedImageUrls.addAll(restaurants.stream()
                .map(Restaurant::getWelcomeScreen)
                .filter(Objects::nonNull)
                .toList());

        usedImageUrls.addAll(foods.stream()
                .map(Food::getImageUrl)
                .filter(Objects::nonNull)
                .toList());

        usedImageUrls.addAll(qrCodes);

        log.info("Fetched {} used image URLs from restaurants and foods.", usedImageUrls.size());

        return usedImageUrls.stream()
                .map(utility::extractIdFromUrl)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }
}
