package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.Food;
import com.trulydesignfirm.emenu.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByFood(Food food);
}
