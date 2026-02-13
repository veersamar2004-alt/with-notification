package com.example.OrderMangementService.DTO;

import java.util.List;

public class OrderRequest {
    public Long customerId;
    public Long restaurantId;
    public List<OrderItemRequest> items;
}