package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.enums.MeatType;
import com.trulydesignfirm.emenu.enums.OrderStatus;
import com.trulydesignfirm.emenu.enums.ServingInfo;
import com.trulydesignfirm.emenu.enums.Tag;
import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import com.trulydesignfirm.emenu.service.SubscriptionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/public")
public class PublicController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/webhook")
    public ResponseEntity<Response> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String razorpaySignature) {
        Response response = subscriptionService.verifyWebhook(payload, razorpaySignature);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllAvailableSubscriptionPlans());
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

    @GetMapping("/order-status")
    public ResponseEntity<List<OrderStatus>> getOrderStatus() {
        return ResponseEntity.ok(Arrays.asList(OrderStatus.values()));
    }
}
