package com.bidcraft.order_service.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuctionListeners {

    private static final Logger log = LoggerFactory.getLogger(AuctionListeners.class);

    @KafkaListener(topics = "auctionTopic", groupId = "orderGroupId")
    public void handleAuctionEnded(Map<String, Object> eventPayload) {

        try {
            // Safely extract strings
            String productId = String.valueOf(eventPayload.get("productId"));
            String winnerId = String.valueOf(eventPayload.get("winningBidderId"));

            // Safely extract the number, whether Jackson guessed Integer, Float, or Double
            Number priceNum = (Number) eventPayload.get("finalPrice");
            Double finalPrice = priceNum != null ? priceNum.doubleValue() : 0.0;

            log.info("🧾 KAFKA EVENT RECEIVED: Generating Auto-Invoice for Product [{}] | Winner: [{}] | Amount: ${}",
                    productId, winnerId, finalPrice);

        } catch (Exception e) {
            log.error("❌ Failed to process auction event: {}", e.getMessage());
        }
    }
}