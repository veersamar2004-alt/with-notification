package com.example.OrderMangementService.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long orderId;

    public Long customerId;
    public Long restaurantId;
    public String orderStatus;
    public BigDecimal totalAmount;

    public Timestamp createdAt;
    public Timestamp updatedAt;
}