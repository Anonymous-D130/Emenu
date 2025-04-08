package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.enums.MeatType;
import com.trulydesignfirm.emenu.enums.ServingInfo;
import com.trulydesignfirm.emenu.enums.Tag;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import com.trulydesignfirm.emenu.service.SubscriptionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/public")
public class PublicController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptionPlans());
    }

    @GetMapping("/tags")
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(Arrays.asList(Tag.values()));
    }

    @GetMapping("/meat-types")
    public ResponseEntity<List<MeatType>> getAllMeatTypes() {
        return ResponseEntity.ok(Arrays.asList(MeatType.values()));
    }

    @GetMapping("/serving-info")
    public ResponseEntity<List<ServingInfo>> getServingInfo() {
        return ResponseEntity.ok(Arrays.asList(ServingInfo.values()));
    }
}
