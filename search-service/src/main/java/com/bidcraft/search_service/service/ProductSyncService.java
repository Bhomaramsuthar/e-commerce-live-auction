package com.bidcraft.search_service.service;

import com.bidcraft.search_service.event.ProductEvent;
import com.bidcraft.search_service.model.ProductDocument;
import com.bidcraft.search_service.repository.ProductSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.BackOff;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.annotation.KafkaListener;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductSyncService {

    private final ProductSearchRepository searchRepository;
    private final MeterRegistry meterRegistry;

    @KafkaListener(topics = "product-events", groupId = "searchGroupId")
    @RetryableTopic(attempts = "4", backOff = @BackOff(delay = 1000, multiplier = 2), dltTopicSuffix = "-dlt")
    public void consumeProductEvent(ProductEvent event) {
        if (event == null || event.getProductId() == null || event.getEventType() == null) {
            throw new IllegalArgumentException("Product event must contain eventType and productId");
        }

        log.info("Received {} for product {}", event.getEventType(), event.getProductId());
        switch (event.getEventType()) {
            case "PRODUCT_CREATED", "PRODUCT_UPDATED" -> {
                searchRepository.save(toDocument(event));
                Counter.builder("search.product_sync.success").tag("event_type", event.getEventType())
                        .register(meterRegistry).increment();
            }
            case "PRODUCT_DELETED" -> {
                // deleteById is idempotent, so duplicate Kafka messages are safe.
                searchRepository.deleteById(event.getProductId());
                Counter.builder("search.product_sync.success").tag("event_type", event.getEventType())
                        .register(meterRegistry).increment();
            }
            default -> throw new IllegalArgumentException("Unsupported product event type: " + event.getEventType());
        }
    }

    private ProductDocument toDocument(ProductEvent event) {
        return ProductDocument.builder()
                .id(event.getProductId())
                .name(event.getName())
                .description(event.getDescription())
                .price(event.getPrice())
                .dynamicAttributes(event.getDynamicAttributes())
                .build();
    }

    /** Terminal failure path after the configured retry topics are exhausted. */
    @DltHandler
    public void handleDeadLetter(ProductEvent event) {
        log.error("Product event sent to DLT after retries: type={}, productId={}",
                event == null ? null : event.getEventType(), event == null ? null : event.getProductId());
        Counter.builder("search.product_sync.dead_letter").register(meterRegistry).increment();
    }
}
