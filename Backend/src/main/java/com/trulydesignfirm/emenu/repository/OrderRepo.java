package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.Customer;
import com.trulydesignfirm.emenu.model.Order;
import com.trulydesignfirm.emenu.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {
    List<Order> findByRestaurant(Restaurant restaurant);
    List<Order> findByRestaurantAndTableNumber(Restaurant restaurant, int tableNumber);
    List<Order> findByCustomer(Customer customer);
    Optional<Order> findByRestaurantAndId(Restaurant restaurant, UUID id);
    List<Order> findOrdersByRestaurantAndCustomer(Restaurant restaurant, Customer customer);
}
