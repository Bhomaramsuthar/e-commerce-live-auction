package com.bidcraft.product_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Map;

@Document(value = "product")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Product implements Serializable {
    @Id
    private String id;

    /** Stable catalogue identifier used to make product creation idempotent. */
    @Indexed(unique = true, sparse = true)
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Map<String, String> dynamicAttributes;
}
