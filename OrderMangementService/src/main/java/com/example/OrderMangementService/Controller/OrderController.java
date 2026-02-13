package com.example.OrderMangementService.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.OrderMangementService.DTO.OrderRequest;
import com.example.OrderMangementService.DTO.OrderSummary;
import com.example.OrderMangementService.Service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(allowedOriginPatterns = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private com.example.OrderMangementService.Service.OrderProducer orderProducer;

    @PostMapping
    public ResponseEntity<OrderSummary> createOrder(@RequestBody OrderRequest request) {
        OrderSummary createdOrder = orderService.createOrder(request);
        orderProducer.sendOrder("New Order Created: " + createdOrder.orderId);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping
    public ResponseEntity<List<OrderSummary>> getAllOrders() {
        List<OrderSummary> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderSummary> getOrderById(@PathVariable Long orderId) {
        OrderSummary order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderSummary> updateOrder(@PathVariable Long orderId, @RequestBody OrderRequest request) {
        OrderSummary updated = orderService.updateOrder(orderId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history/{customerId}")
    public ResponseEntity<List<OrderSummary>> getOrderHistory(@PathVariable Long customerId) {
        List<OrderSummary> history = orderService.getOrderHistory(customerId);
        return ResponseEntity.ok(history);
    }
}