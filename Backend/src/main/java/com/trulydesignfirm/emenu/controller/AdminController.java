package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import com.trulydesignfirm.emenu.records.Dashboard;
import com.trulydesignfirm.emenu.records.Partners;
import com.trulydesignfirm.emenu.service.SubscriptionService;
import com.trulydesignfirm.emenu.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final SubscriptionService subscriptionService;
    private final UserService userService;

    @PostMapping("/plans")
    public ResponseEntity<Response> createSubscriptionPlans(@RequestBody List<SubscriptionPlan> subscriptionPlans) {
        Response response = subscriptionService.createSubscriptionPlans(subscriptionPlans);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/plan")
    public ResponseEntity<Response> createSubscriptionPlan(@RequestBody SubscriptionPlan subscriptionPlan) {
        Response response = subscriptionService.createSubscriptionPlan(subscriptionPlan);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllSubscriptionPlans() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptionPlans());
    }

    @DeleteMapping("/plan/{id}")
    public ResponseEntity<Response> deleteSubscriptionPlan(@PathVariable UUID id) {
        Response response = subscriptionService.deleteSubscriptionPlan(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/partners")
    public ResponseEntity<List<Partners>> getAllPartners() {
        return ResponseEntity.ok(userService.getAllPartners());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<Dashboard>> getDashboard() {
        return ResponseEntity.ok(userService.getAllDashboardData());
    }

    @PostMapping("/updatePlan/{userId}/{planId}")
    public ResponseEntity<Response> updatePlan(@PathVariable UUID userId, @PathVariable UUID planId, @RequestBody LocalDate endDate) {
        return ResponseEntity.ok(userService.updatePlan(userId, planId, endDate));
    }
}
