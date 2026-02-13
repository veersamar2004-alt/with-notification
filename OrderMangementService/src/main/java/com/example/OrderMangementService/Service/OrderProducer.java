package com.example.OrderMangementService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderProducer {

    private static final String TOPIC = "orders";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendOrder(String message) {
        try {
            kafkaTemplate.send(TOPIC, message);
        } catch (Exception e) {
            System.out.println("Kafka is not available. Message not sent: " + message);
        }
    }
}
