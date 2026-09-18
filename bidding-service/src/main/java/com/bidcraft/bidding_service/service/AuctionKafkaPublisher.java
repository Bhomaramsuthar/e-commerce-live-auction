package com.bidcraft.bidding_service.service;

import com.bidcraft.bidding_service.command.api.events.AuctionEndedEvent;
import com.bidcraft.bidding_service.query.model.AuctionReadModel;
import com.bidcraft.bidding_service.query.repository.AuctionRedisRepository;
import org.axonframework.eventhandling.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuctionKafkaPublisher {

    private static final Logger log = LoggerFactory.getLogger(AuctionKafkaPublisher.class);
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final AuctionRedisRepository auctionRedisRepository;

    public AuctionKafkaPublisher(KafkaTemplate<String, Object> kafkaTemplate, AuctionRedisRepository auctionRedisRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.auctionRedisRepository = auctionRedisRepository;
    }

    @EventHandler
    public void on(AuctionEndedEvent event) {
        log.info("AuctionEndedEvent received for Kafka publishing: auctionId={}", event.getAuctionId());

        if (event.getWinnerId() != null) {
            auctionRedisRepository.findById(event.getAuctionId()).ifPresentOrElse(auction -> {
                Map<String, Object> payload = new HashMap<>();
                payload.put("auctionId", event.getAuctionId());
                payload.put("productId", auction.getProductId());
                payload.put("winningBidderId", event.getWinnerId());
                payload.put("finalPrice", event.getFinalPrice());

                kafkaTemplate.send("auctionTopic", payload);
                log.info("Published auction result to auctionTopic for productId: {}", auction.getProductId());
            }, () -> {
                log.warn("AuctionReadModel not found for auctionId={}, cannot publish to Kafka", event.getAuctionId());
            });
        } else {
            log.info("Auction ended without a winner, skipping Kafka publish.");
        }
    }
}
