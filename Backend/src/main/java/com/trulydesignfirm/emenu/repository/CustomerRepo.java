package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, UUID> {
    List<Customer> findAllByLeftAtBefore(LocalDateTime leftAtBefore);
}