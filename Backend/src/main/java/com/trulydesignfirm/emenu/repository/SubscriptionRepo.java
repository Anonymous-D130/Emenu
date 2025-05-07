package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepo extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> getSubscriptionByOwner(LoginUser owner);
    boolean existsByPlanId(UUID planId);
}