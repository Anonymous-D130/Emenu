package com.trulydesignfirm.emenu.service;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.dto.Cart;
import com.trulydesignfirm.emenu.enums.Tag;
import com.trulydesignfirm.emenu.model.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public interface CustomerService {
    Restaurant findRestaurantById(UUID id);
    Map<Tag, List<Food>> getFoodsByTag(Restaurant restaurant);
    Customer registerCustomer(Customer customer, Restaurant restaurant);
    Customer updateCustomer(int tableNumber, UUID customerId);
    void markCustomerAsLeft(UUID customerId);
    Customer getCustomerById(UUID id);
    Response placeOrder(UUID customerId, Cart cart);
    List<Order> getOrders(UUID customerId, Restaurant restaurant);
    List<Order> getCustomerOrderHistory(UUID customerId);
    Response ringBell(UUID customerId, String pageName);
    Response deleteCustomer(UUID customerId);
    Restaurant getRestaurantByPage(String pageName);
    Map<UUID, String> getRestaurantServices(String pageName);
}
