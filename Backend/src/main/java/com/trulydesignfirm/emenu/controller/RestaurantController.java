package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.enums.OrderStatus;
import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.model.*;
import com.trulydesignfirm.emenu.service.RestaurantService;
import com.trulydesignfirm.emenu.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllAvailableSubscriptionPlans());
    }

    @PostMapping("/trial/{planId}")
    public ResponseEntity<Response> activateTrial(@RequestHeader("Authorization") String token, @PathVariable UUID planId) {
        Response response = subscriptionService.activateTrial(token, planId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/subscribe/{planId}")
    public ResponseEntity<Response> subscribe(@RequestHeader("Authorization") String token, @PathVariable UUID planId) {
        Response response = subscriptionService.initiateSubscription(token, planId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<Response> verifyPayment(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> paymentData) {
        String paymentId = paymentData.get("payment_id");
        String orderId = paymentData.get("order_id");
        String signature = paymentData.get("signature");

        Response res = subscriptionService.verifyPayment(token, paymentId, orderId, signature);
        return new ResponseEntity<>(res, res.getStatus());
    }

    @GetMapping("/subscription-status")
    public ResponseEntity<SubscriptionStatus> isSubscriptionActive(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(restaurantService.getSubscriptionStatus(token));
    }

    @GetMapping("/get")
    public ResponseEntity<Restaurant> getRestaurantDetails(@RequestHeader("Authorization") String token) {
        Restaurant restaurant = restaurantService.getRestaurant(token);
        return ResponseEntity.ok(restaurant);
    }

    @PostMapping("/register")
    public ResponseEntity<Response> registerOrUpdateRestaurant(
            @RequestHeader("Authorization") String token,
            @RequestBody Restaurant restaurant
    ) {
        Response response = restaurantService.createOrUpdateRestaurant(token, restaurant);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/check-page-name")
    public ResponseEntity<Boolean> checkPageName(@RequestHeader("Authorization") String token, @RequestParam String pageName) {
        boolean exists = restaurantService.checkPageName(token, pageName);
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/toggle")
    public ResponseEntity<Response> toggleRestaurant(@RequestHeader("Authorization") String token){
        Response response = restaurantService.toggleActive(token);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String , ?>> getDashboard(@RequestHeader("Authorization") String token){
        return ResponseEntity.ok(restaurantService.getDashboard(token));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(restaurantService.getRestaurantCategories(token));
    }

    @PostMapping("/category")
    public ResponseEntity<Response> addCategory(@RequestHeader("Authorization") String token, @RequestBody Category category) {
        Response response = restaurantService.addRestaurantCategory(token, category);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<Response> updateCategory(@RequestHeader("Authorization") String token, @RequestBody Category category, @PathVariable UUID id) {
        Response response = restaurantService.updateRestaurantCategory(token, id, category);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<Response> deleteCategory(@RequestHeader("Authorization") String token, @PathVariable UUID id) {
        Response response = restaurantService.deleteRestaurantCategory(token, id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/sub-categories/{categoryId}")
    public ResponseEntity<List<SubCategory>> getSubCategories(@RequestHeader("Authorization") String token, @PathVariable UUID categoryId) {
        return ResponseEntity.ok(restaurantService.getCategorySubCategories(token, categoryId));
    }

    @PostMapping("/sub-category/{categoryId}")
    public ResponseEntity<Response> addSubCategory(@RequestHeader("Authorization") String token, @RequestBody SubCategory subCategory, @PathVariable UUID categoryId) {
        Response response = restaurantService.addCategorySubCategory(token, subCategory, categoryId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/sub-category/{id}")
    public ResponseEntity<Response> updateSubCategory(@RequestHeader("Authorization") String token, @RequestBody SubCategory subCategory, @PathVariable UUID id) {
        Response response = restaurantService.updateCategorySubCategory(token, id, subCategory);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/sub-category/{id}")
    public ResponseEntity<Response> deleteSubCategory(@RequestHeader("Authorization") String token, @PathVariable UUID id) {
        Response response = restaurantService.deleteCategorySubCategory(token, id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/foods")
    public ResponseEntity<List<Food>> getFoods(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(restaurantService.getRestaurantFoods(token));
    }

    @GetMapping("/category/{categoryId}/foods")
    public ResponseEntity<List<Food>> getFoodByCategory(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID categoryId
    ) {
        return ResponseEntity.ok(restaurantService.getRestaurantFoodsByCategory(token, categoryId));
    }

    @GetMapping("/sub-category/{subCategoryId}/foods")
    public ResponseEntity<List<Food>> getFoodBySubCategory(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID subCategoryId
    ) {
        return ResponseEntity.ok(restaurantService.getRestaurantFoodsBySubCategory(token, subCategoryId));
    }

    @PostMapping("/{subCategoryId}/food")
    public ResponseEntity<Response> addFood(@RequestHeader("Authorization") String token, @PathVariable UUID subCategoryId, @RequestBody Food food) {
        Response response = restaurantService.addRestaurantFood(token, food, subCategoryId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/food/{foodId}")
    public ResponseEntity<Response> updateFood(@RequestHeader("Authorization") String token, @RequestBody Food food, @PathVariable UUID foodId) {
        Response response = restaurantService.updateRestaurantFood(token, food, foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/toggle/{foodId}")
    public ResponseEntity<Response> toggleFoodAvailability(@RequestHeader("Authorization") String token, @PathVariable UUID foodId) {
        Response response = restaurantService.toggleFoodAvailability(token, foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/food/{foodId}")
    public ResponseEntity<Response> deleteFood(@RequestHeader("Authorization") String token, @PathVariable UUID foodId) {
        Response response = restaurantService.deleteRestaurantFood(token, foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/fetch-qr")
    public ResponseEntity<List<String >> fetchQr(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(restaurantService.fetchRestaurantQrCodes(token));
    }

    @PostMapping("/generate-qr/{tables}")
    public ResponseEntity<Response> generateTableQRCodes(
            @RequestHeader("Authorization") String token,
            @PathVariable int tables) throws IOException {
        Response response = restaurantService.generateTableQRCodes(token, tables);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrdersByRestaurant(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(restaurantService.getOrdersByRestaurant(token));
    }

    @GetMapping("/today-orders")
    public ResponseEntity<List<Order>> getTodayOrders(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(restaurantService.getRestaurantTodayOrders(token));
    }

    @PutMapping("/order/{orderId}")
    public ResponseEntity<Response> updateOrder(@RequestHeader("Authorization") String token, @PathVariable UUID orderId, @RequestParam OrderStatus orderStatus) {
        Response response = restaurantService.updateOrderStatus(token, orderId, orderStatus);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<Response> deleteOrder(@RequestHeader("Authorization") String token, @PathVariable UUID orderId) {
        Response response = restaurantService.cancelOrder(token, orderId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/{tableNumber}/orders")
    public ResponseEntity<List<Order>> getOrdersByTable(
            @RequestHeader("Authorization") String token,
            @PathVariable int tableNumber) {
        return ResponseEntity.ok(restaurantService.getOrdersByTable(token, tableNumber));
    }
}