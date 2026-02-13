package com.example.OrderMangementService.DTO;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class OrderSummary {
    public Long orderId;
    public String status;
    public BigDecimal totalAmount;
    public Timestamp createdAt;
    public List<OrderItemResponse> items;
}