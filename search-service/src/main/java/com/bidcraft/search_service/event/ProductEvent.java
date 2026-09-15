package com.bidcraft.search_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

/** Mirrors the product-events Kafka contract owned by product-service. */
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
