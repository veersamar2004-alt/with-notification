package com.example.OrderMangementService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final String TOPIC = "order-events";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendOrderEvent(String message) {
        kafkaTemplate.send(TOPIC, message);
    }
}
