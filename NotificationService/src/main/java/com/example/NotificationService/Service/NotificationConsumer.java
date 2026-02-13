package com.example.NotificationService.Service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    @KafkaListener(topics = "order-events", groupId = "notification_group")
    public void consume(String message) {
        System.out.println("Notification Receiver: " + message);
        // Here you would implement actual notification logic (email, push, etc.)
    }
}
