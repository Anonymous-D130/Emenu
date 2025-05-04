package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.SubCategory;
import com.trulydesignfirm.emenu.model.Food;
import com.trulydesignfirm.emenu.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface FoodRepo extends JpaRepository<Food, UUID> {
    List<Food> findAllByRestaurant(Restaurant restaurant);
    List<Food> findAllBySubCategoryIn(Collection<SubCategory> subCategories);
    boolean existsByNameAndRestaurant(String name, Restaurant restaurant);
    List<Food> findAllByRestaurantAndSubCategoryOrderByName(Restaurant restaurant, SubCategory subCategory);
}
