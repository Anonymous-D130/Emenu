package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.enums.OrderStatus;
import com.trulydesignfirm.emenu.model.Customer;
import com.trulydesignfirm.emenu.model.Order;
import com.trulydesignfirm.emenu.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {
    List<Order> findByRestaurantAndTableNumber(Restaurant restaurant, int tableNumber);
    List<Order> findByCustomer(Customer customer);
    Optional<Order> findByRestaurantAndId(Restaurant restaurant, UUID id);

    List<Order> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurantByToken);
    long countByRestaurant(Restaurant restaurant);
    long countByRestaurantAndStatus(Restaurant restaurant, OrderStatus status);
    long countByRestaurantAndStatusIn(Restaurant restaurant, List<OrderStatus> statuses);

    @Query("SELECT DISTINCT o.tableNumber FROM Order o WHERE o.restaurant = :restaurant AND o.status IN :statuses")
    List<Integer> findDistinctTableNumbersByRestaurantAndStatusIn(
            @Param("restaurant") Restaurant restaurant,
            @Param("statuses") List<OrderStatus> statuses
    );

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.restaurant = :restaurant")
    Optional<Double> sumTotalAmountByRestaurant(@Param("restaurant") Restaurant restaurant);

    List<Order> findOrdersByRestaurantAndCustomerOrderByCreatedAtDesc(Restaurant restaurant, Customer customer);
    List<Order> findByRestaurantAndCreatedAtBetweenOrderByCreatedAtDesc(Restaurant restaurant, LocalDateTime start, LocalDateTime end);
}
