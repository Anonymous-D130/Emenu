package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.dto.Cart;
import com.trulydesignfirm.emenu.enums.Tag;
import com.trulydesignfirm.emenu.model.*;
import com.trulydesignfirm.emenu.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<Restaurant> getRestaurant(@PathVariable UUID id){
        return ResponseEntity.ok(hasActiveSubscription(id));
    }

    @GetMapping("/restaurant/{id}/tables")
    public ResponseEntity<Integer> getTables(@PathVariable UUID id){
        return ResponseEntity.ok(hasActiveSubscription(id).getTables());
    }

    @GetMapping("/restaurant/{id}/tags")
    ResponseEntity<Map<Tag, List<Food>>> getAllFoods(@PathVariable UUID id){
        return ResponseEntity.ok(customerService.getFoodsByTag(hasActiveSubscription(id)));
    }

    @PostMapping("/register/{restaurantId}")
    public ResponseEntity<Customer> registerCustomer(@RequestBody Customer customer, @PathVariable UUID restaurantId) {
        return ResponseEntity.ok(customerService.registerCustomer(customer, hasActiveSubscription(restaurantId)));
    }

    @PutMapping("/table/{tableNumber}/{id}")
    public ResponseEntity<Customer> updateTable(@PathVariable int tableNumber, @PathVariable UUID id){
        return ResponseEntity.ok(customerService.updateCustomer(tableNumber, id));
    }

    @PutMapping("/{id}/left")
    public ResponseEntity<?> markCustomerAsLeft(@PathVariable UUID id) {
        customerService.markCustomerAsLeft(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable UUID id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping("/{customerId}/place-order")
    public ResponseEntity<Response> placeOrder(
            @PathVariable UUID customerId,
            @RequestBody Cart cart) {
        return ResponseEntity.ok(customerService.placeOrder(customerId, cart));
    }

    @GetMapping("/{customerId}/orders/{restaurantId}")
    public ResponseEntity<List<Order>> getOrder(@PathVariable UUID customerId, @PathVariable UUID restaurantId) {
        return ResponseEntity.ok(customerService.getOrders(customerId, hasActiveSubscription(restaurantId)));
    }

    @GetMapping("/{customerId}/orders")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable UUID customerId) {
        return ResponseEntity.ok(customerService.getCustomerOrderHistory(customerId));
    }

    @PostMapping("/ring/{customerId}/{restaurantId}")
    public ResponseEntity<Response> ring(@PathVariable UUID customerId, @PathVariable UUID restaurantId) {
        Response response = customerService.ringBell(customerId, restaurantId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteCustomer(@PathVariable UUID id) {
        Response response = customerService.deleteCustomer(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    private Restaurant hasActiveSubscription(UUID restaurantId) {
        Restaurant restaurant = customerService.findRestaurantById(restaurantId);
        if(restaurant.getOwner().getSubscription() == null || restaurant.getOwner().getSubscription().isExpired())
            throw new RuntimeException("%s's subscription has expired".formatted(restaurant.getName()));
        else if (!restaurant.isActive()) {
            throw new RuntimeException("%s is closed now.".formatted(restaurant.getName()));
        }
        return restaurant;
    }
}
