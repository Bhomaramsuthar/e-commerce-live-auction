package com.bidcraft.product_service.config;

import com.bidcraft.product_service.model.Product;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Component;

/** Ensures Atlas enforces SKU uniqueness even if automatic index creation is disabled. */
@Component
@RequiredArgsConstructor
public class ProductIndexConfig {
    private final MongoTemplate mongoTemplate;

    @PostConstruct
    void ensureSkuIndex() {
        mongoTemplate.indexOps(Product.class)
                .ensureIndex(new Index().on("sku", Sort.Direction.ASC).unique().sparse());
    }
}
