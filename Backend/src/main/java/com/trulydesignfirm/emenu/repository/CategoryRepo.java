package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.Category;
import com.trulydesignfirm.emenu.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepo extends JpaRepository<Category, UUID> {

    List<Category> findAllByRestaurantOrderByName(Restaurant restaurant);
}
