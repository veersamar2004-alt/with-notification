
package com.example.OrderMangementService.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.OrderMangementService.model.OrderItem;


public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
}