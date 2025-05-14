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

    @GetMapping("/restaurant/{pageName}")
    public ResponseEntity<Restaurant> getRestaurant(@PathVariable String pageName){
        return ResponseEntity.ok(hasActiveSubscription(pageName));
    }

    @GetMapping("/restaurant/{pageName}/tables")
    public ResponseEntity<Integer> getTables(@PathVariable String pageName){
        return ResponseEntity.ok(hasActiveSubscription(pageName).getTables());
    }

    @GetMapping("/restaurant/{pageName}/tags")
    ResponseEntity<Map<Tag, List<Food>>> getAllFoods(@PathVariable String pageName){
        return ResponseEntity.ok(customerService.getFoodsByTag(hasActiveSubscription(pageName)));
    }

    @PostMapping("/register/{pageName}")
    public ResponseEntity<Customer> registerCustomer(@RequestBody Customer customer, @PathVariable String pageName) {
        return ResponseEntity.ok(customerService.registerCustomer(customer, hasActiveSubscription(pageName)));
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

    @GetMapping("/{customerId}/orders/{pageName}")
    public ResponseEntity<List<Order>> getOrder(@PathVariable UUID customerId, @PathVariable String pageName) {
        return ResponseEntity.ok(customerService.getOrders(customerId, hasActiveSubscription(pageName)));
    }

    @GetMapping("/{customerId}/orders")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable UUID customerId) {
        return ResponseEntity.ok(customerService.getCustomerOrderHistory(customerId));
    }

    @PostMapping("/ring/{customerId}/{pageName}")
    public ResponseEntity<Response> ring(@PathVariable UUID customerId, @PathVariable String pageName) {
        Response response = customerService.ringBell(customerId, pageName);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteCustomer(@PathVariable UUID id) {
        Response response = customerService.deleteCustomer(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/{pageName}/services")
    public ResponseEntity<Map<UUID, String>> getServices(@PathVariable String pageName) {
        return ResponseEntity.ok(customerService.getRestaurantServices(pageName));
    }

    private Restaurant hasActiveSubscription(String pageName) {
        Restaurant restaurant = customerService.getRestaurantByPage(pageName);
        if(restaurant.getOwner().getSubscription() == null || restaurant.getOwner().getSubscription().isExpired())
            throw new RuntimeException("%s's subscription has expired".formatted(restaurant.getName()));
        else if (!restaurant.isActive()) {
            throw new RuntimeException("%s is closed now.".formatted(restaurant.getName()));
        }
        return restaurant;
    }
}
