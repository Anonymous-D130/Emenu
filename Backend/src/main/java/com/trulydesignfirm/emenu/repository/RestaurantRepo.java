package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RestaurantRepo extends JpaRepository<Restaurant, UUID> {
    Optional<Restaurant> getRestaurantByOwner(LoginUser owner);
    boolean existsByPageName(String pageName);
}