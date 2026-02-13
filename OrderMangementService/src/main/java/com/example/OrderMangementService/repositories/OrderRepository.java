package com.example.OrderMangementService.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.OrderMangementService.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}