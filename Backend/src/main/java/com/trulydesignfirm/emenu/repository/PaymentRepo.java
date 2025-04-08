package com.trulydesignfirm.emenu.repository;

import com.trulydesignfirm.emenu.model.LoginUser;
import com.trulydesignfirm.emenu.model.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentDetails, String> {
    Optional<PaymentDetails> findByPaymentId(String paymentId);
    Optional<PaymentDetails> getPaymentDetailsByUser(LoginUser user);
    Optional<PaymentDetails> findByOrderId(String orderId);
}
