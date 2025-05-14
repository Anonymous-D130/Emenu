package com.trulydesignfirm.emenu.service.impl;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.dto.Cart;
import com.trulydesignfirm.emenu.dto.CartItem;
import com.trulydesignfirm.emenu.enums.OrderStatus;
import com.trulydesignfirm.emenu.enums.Tag;
import com.trulydesignfirm.emenu.model.*;
import com.trulydesignfirm.emenu.repository.CustomerRepo;
import com.trulydesignfirm.emenu.repository.FoodRepo;
import com.trulydesignfirm.emenu.repository.OrderRepo;
import com.trulydesignfirm.emenu.service.CustomerService;
import com.trulydesignfirm.emenu.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepo customerRepo;
    private final RestaurantService restaurantService;
    private final OrderRepo orderRepo;
    private final FoodRepo foodRepo;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public Restaurant findRestaurantById(UUID id) {
        return restaurantService.getRestaurantById(id);
    }

    @Override
    public Map<Tag, List<Food>> getFoodsByTag(Restaurant restaurant) {
        List<Food> foodList = foodRepo.findAllByRestaurant(restaurant)
                .stream()
                .filter(Food::isAvailable)
                .toList();
        Map<Tag, List<Food>> map = new HashMap<>();
        foodList.forEach(food -> food.getTag()
                .forEach(tag -> map.computeIfAbsent(tag, k -> new ArrayList<>()).add(food)));
        return map;
    }


    @Override
    public Customer registerCustomer(Customer customer, Restaurant restaurant) {
        customer.setRestaurant(restaurant);
        return customerRepo.save(customer);
    }

    @Override
    public Customer updateCustomer(int tableNumber, UUID customerId) {
        Customer customer = getCustomerById(customerId);
        customer.setTableNumber(tableNumber);
        return customerRepo.save(customer);
    }

    @Override
    public void markCustomerAsLeft(UUID customerId) {
        Customer customer = getCustomerById(customerId);
        customer.setLeftAt(LocalDateTime.now());
        customerRepo.save(customer);
    }

    @Override
    public Customer getCustomerById(UUID id) {
        return customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @Override
    public Response placeOrder(UUID customerId, Cart cart) {
        Response response = new Response();
        Customer customer = getCustomerById(customerId);
        Restaurant restaurant = restaurantService.getRestaurantById(customer.getRestaurant().getId());
        List<OrderItem> orderItems = cart.getItems().stream().map(this::mapOrderItem).toList();
        double totalAmount = orderItems.stream().mapToDouble(item -> {
            Food food = foodRepo.findById(item.getFood().getId())
                    .orElseThrow(() -> new RuntimeException("Food item not found"));
            item.setAmount(food.getOfferPrice() * item.getQuantity());
            return item.getAmount();
        }).sum();
        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setTableNumber(customer.getTableNumber());
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);
        orderRepo.save(order);
        sendNewOrder(order, restaurant);
        response.setMessage("Order successfully placed");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public List<Order> getOrders(UUID customerId, Restaurant restaurant) {
        return orderRepo.findOrdersByRestaurantAndCustomerOrderByCreatedAtDesc(restaurant, getCustomerById(customerId));
    }

    @Override
    public List<Order> getCustomerOrderHistory(UUID customerId) {
        Customer customer = getCustomerById(customerId);
        return orderRepo.findByCustomer(customer);
    }

    @Override
    public Response ringBell(UUID customerId, String pageName) {
        Restaurant restaurant = getRestaurantByPage(pageName);
        LoginUser owner = restaurant.getOwner();
        if (owner.getSubscription() == null || owner.getSubscription().isExpired()) {
            throw new RuntimeException("%s's subscription is expired or not active.".formatted(restaurant.getName()));
        }
        if (!owner.getSubscription().getPlan().isRingBellIncluded()) {
            throw new RuntimeException("This restaurant does not have the ring bell feature included in its subscription.");
        }
        Response response = new Response();
        sendRingBell(getCustomerById(customerId).getTableNumber(), restaurant.getId());
        response.setMessage("Restaurant has been notified.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response deleteCustomer(UUID customerId) {
        Response response = new Response();
        customerRepo.delete(getCustomerById(customerId));
        response.setMessage("Customer has been deleted.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Restaurant getRestaurantByPage(String pageName) {
        return restaurantService.getRestaurantByPage(pageName);
    }

    @Override
    public Map<UUID, String> getRestaurantServices(String pageName) {
        return restaurantService.getRestaurantServices(pageName);
    }

    private OrderItem mapOrderItem(CartItem cartItem) {
        OrderItem orderItem = new OrderItem();
        Food food = foodRepo.findById(cartItem.getFood().getId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        orderItem.setFood(food);
        orderItem.setFoodName(food.getName());
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setAmount(cartItem.getAmount());
        return orderItem;
    }

    private void sendNewOrder(Order order, Restaurant restaurant) {
        messagingTemplate.convertAndSend("/topic/new-order/"+restaurant.getId(), order);
    }

    private void sendRingBell(Integer tableNumber, UUID restaurantId) {
        String topic = "/topic/ring-bell/" + restaurantId;
        messagingTemplate.convertAndSend(topic, tableNumber);
    }
}