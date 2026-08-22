package com.bidcraft.notification_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationListeners {

    // Manually instantiate the logger instead of using @Slf4j
    private static final Logger log = LoggerFactory.getLogger(NotificationListeners.class);

    @KafkaListener(topics = "notificationTopic", groupId = "notificationId")
    public void handleNotification(Map<String, Object> orderPlacedEvent) {
        // In a real app, this would trigger an email via SendGrid or AWS SES
        log.info("📧 KAFKA EVENT RECEIVED: Sending confirmation email for Order Number - {}", orderPlacedEvent.get("orderNumber"));
    }
}