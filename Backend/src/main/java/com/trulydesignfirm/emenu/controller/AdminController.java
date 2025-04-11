package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import com.trulydesignfirm.emenu.service.SubscriptionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/plan")
    public ResponseEntity<Response> createSubscriptionPlan(@RequestBody SubscriptionPlan subscriptionPlan) {
        Response response = subscriptionService.createSubscriptionPlan(subscriptionPlan);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllSubscriptionPlans() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptionPlans());
    }

    @PutMapping("/plan/{id}")
    public ResponseEntity<Response> updateSubscriptionPlan(@PathVariable UUID id, @RequestBody SubscriptionPlan subscriptionPlan) {
        Response response = subscriptionService.updateSubscriptionPlan(id, subscriptionPlan);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/plan/{id}")
    public ResponseEntity<Response> deleteSubscriptionPlan(@PathVariable UUID id) {
        Response response = subscriptionService.deleteSubscriptionPlan(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
