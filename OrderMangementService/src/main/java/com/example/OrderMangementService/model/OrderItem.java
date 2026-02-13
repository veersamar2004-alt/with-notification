package com.example.OrderMangementService.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long itemId;

    public Long orderId;
    public Long menuItemId;
    public int quantity;
    public BigDecimal price;
}