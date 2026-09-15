package com.bidcraft.product_service.service;

import com.bidcraft.product_service.event.ProductEvent;
import com.bidcraft.product_service.event.ProductEventType;
import com.bidcraft.product_service.exception.DuplicateProductException;
import com.bidcraft.product_service.model.Product;
import com.bidcraft.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String PRODUCT_TOPIC = "product-events";

    public Product createProduct(Product product) {
        String sku = normalizeRequiredSku(product.getSku());
        ensureSkuIsAvailable(sku, null);
        product.setSku(sku);
        Product savedProduct = saveProduct(product);
        publishProductEvent(savedProduct, ProductEventType.PRODUCT_CREATED);
        return savedProduct;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Cacheable(value = "product", key = "#id")
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @CacheEvict(value = "product", key = "#id")
    public Product updateProduct(String id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        String sku = normalizeRequiredSku(product.getSku());
        ensureSkuIsAvailable(sku, id);
        existingProduct.setSku(sku);
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setDynamicAttributes(product.getDynamicAttributes());
        Product savedProduct = saveProduct(existingProduct);
        publishProductEvent(savedProduct, ProductEventType.PRODUCT_UPDATED);
        return savedProduct;
    }

    @CacheEvict(value = "product", key = "#id")
    public Product patchProduct(String id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        if (product.getSku() != null) {
            String sku = normalizeRequiredSku(product.getSku());
            ensureSkuIsAvailable(sku, id);
            existingProduct.setSku(sku);
        }
        if (product.getName() != null) {
            existingProduct.setName(product.getName());
        }
        if (product.getDescription() != null) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getPrice() != null) {
            existingProduct.setPrice(product.getPrice());
        }
        if (product.getDynamicAttributes() != null) {
            existingProduct.setDynamicAttributes(product.getDynamicAttributes());
        }
        Product savedProduct = saveProduct(existingProduct);
        publishProductEvent(savedProduct, ProductEventType.PRODUCT_UPDATED);
        return savedProduct;
    }

    @CacheEvict(value = "product", key = "#id")
    public void deleteProduct(String id) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.deleteById(id);
        publishProductEvent(existingProduct, ProductEventType.PRODUCT_DELETED);
    }

    private void publishProductEvent(Product product, ProductEventType eventType) {
        ProductEvent event = ProductEvent.builder()
                .eventType(eventType.name())
                .productId(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .dynamicAttributes(product.getDynamicAttributes())
                .build();
        kafkaTemplate.send(PRODUCT_TOPIC, product.getId(), event);
    }

    private String normalizeRequiredSku(String sku) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("sku is required when creating or replacing a product");
        }
        return sku.trim().toUpperCase(Locale.ROOT);
    }

    private void ensureSkuIsAvailable(String sku, String productId) {
        productRepository.findBySku(sku)
                .filter(existing -> !existing.getId().equals(productId))
                .ifPresent(existing -> { throw new DuplicateProductException(sku); });
    }

    private Product saveProduct(Product product) {
        try {
            return productRepository.save(product);
        } catch (DuplicateKeyException exception) {
            // The database unique index remains the final protection against concurrent POST requests.
            throw new DuplicateProductException(product.getSku());
        }
    }
}
