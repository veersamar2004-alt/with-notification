package com.example.OrderMangementService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.OrderMangementService.DTO.OrderItemRequest;
import com.example.OrderMangementService.DTO.OrderRequest;
import com.example.OrderMangementService.DTO.OrderSummary;
import com.example.OrderMangementService.DTO.OrderItemResponse;
import com.example.OrderMangementService.model.Order;
import com.example.OrderMangementService.model.OrderItem;
import com.example.OrderMangementService.repositories.OrderRepository;
import com.example.OrderMangementService.repositories.OrderItemRepository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private KafkaProducerService kafkaProducerService;

    public OrderSummary createOrder(OrderRequest request) {
        // Step 1: Create Order stub
        Order order = new Order();
        order.customerId = request.customerId;
        order.restaurantId = request.restaurantId;
        order.orderStatus = "CREATED";
        Timestamp now = new Timestamp(System.currentTimeMillis());
        order.createdAt = now;
        order.updatedAt = now;
        order.totalAmount = BigDecimal.ZERO;

        // Step 2: Save Order, so orderId is generated
        order = orderRepository.save(order);

        // Step 3: Save OrderItems & compute total
        BigDecimal total = BigDecimal.ZERO;
        if (request.items != null) {
            for (OrderItemRequest ir : request.items) {
                OrderItem item = new OrderItem();
                item.orderId = order.orderId;
                item.menuItemId = ir.menuItemId;
                item.quantity = ir.quantity;
                item.price = ir.price;
                orderItemRepository.save(item);
                if (ir.price != null) {
                    total = total.add(ir.price.multiply(BigDecimal.valueOf(ir.quantity)));
                }
            }
        }
        // Step 4: Update Order with total amount and updated time
        order.totalAmount = total;
        order.updatedAt = new Timestamp(System.currentTimeMillis());
        order = orderRepository.save(order);

        // Step 5: Return summary DTO
        OrderSummary summary = mapToSummary(order);
        
        // Step 6: Send Kafka event
        try {
            kafkaProducerService.sendOrderEvent("Order Placed: " + order.orderId + " for Customer: " + order.customerId);
        } catch (Exception e) {
            System.err.println("Failed to send Kafka event: " + e.getMessage());
        }

        return summary;
    }

    public List<OrderSummary> getOrderHistory(Long customerId) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        List<OrderSummary> out = new ArrayList<>();
        for (Order o : orders) {
            out.add(mapToSummary(o));
        }
        return out;
    }

    public List<OrderSummary> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderSummary> out = new ArrayList<>();
        for (Order o : orders) {
            out.add(mapToSummary(o));
        }
        return out;
    }

    public OrderSummary getOrderById(Long orderId) {
        Optional<Order> opt = orderRepository.findById(orderId);
        return opt.map(this::mapToSummary).orElse(null);
    }

    public OrderSummary updateOrder(Long orderId, OrderRequest request) {
        Optional<Order> opt = orderRepository.findById(orderId);
        if (opt.isEmpty()) return null;
        Order order = opt.get();

        // Update customer/restaurant if present in request
        if (request.customerId != null) {
            order.customerId = request.customerId;
        }
        if (request.restaurantId != null) {
            order.restaurantId = request.restaurantId;
        }
        order.updatedAt = new Timestamp(System.currentTimeMillis());

        // Remove all existing items
        List<OrderItem> existing = orderItemRepository.findByOrderId(orderId);
        for (OrderItem e : existing) {
            orderItemRepository.delete(e);
        }

        // Add and calculate new items
        BigDecimal total = BigDecimal.ZERO;
        if (request.items != null) {
            for (OrderItemRequest ir : request.items) {
                OrderItem it = new OrderItem();
                it.orderId = order.orderId;
                it.menuItemId = ir.menuItemId;
                it.quantity = ir.quantity;
                it.price = ir.price;
                orderItemRepository.save(it);
                if (ir.price != null) {
                    total = total.add(ir.price.multiply(BigDecimal.valueOf(ir.quantity)));
                }
            }
        }
        order.totalAmount = total;
        order.updatedAt = new Timestamp(System.currentTimeMillis());
        orderRepository.save(order);

        return mapToSummary(order);
    }

    public boolean deleteOrder(Long orderId) {
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem it : items) {
            orderItemRepository.delete(it);
        }
        if (orderRepository.existsById(orderId)) {
            orderRepository.deleteById(orderId);
            return true;
        }
        return false;
    }

    private OrderSummary mapToSummary(Order o) {
        OrderSummary s = new OrderSummary();
        s.orderId = o.orderId;
        s.status = o.orderStatus;
        s.totalAmount = o.totalAmount;
        s.createdAt = o.createdAt;

        List<OrderItem> items = orderItemRepository.findByOrderId(o.orderId);
        List<OrderItemResponse> resp = new ArrayList<>();
        for (OrderItem it : items) {
            OrderItemResponse r = new OrderItemResponse();
            r.menuItemId = it.menuItemId;
            r.quantity = it.quantity;
            r.price = it.price;
            resp.add(r);
        }
        s.items = resp;

        return s;
    }
}