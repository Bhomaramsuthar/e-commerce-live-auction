package com.bidcraft.product_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Public Kafka contract for changes to the product catalog.  Keep this DTO
 * independent from the Mongo entity so persistence details never leak to
 * consumers.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEvent {
    private String eventType;
    private String productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Map<String, String> dynamicAttributes;
}
