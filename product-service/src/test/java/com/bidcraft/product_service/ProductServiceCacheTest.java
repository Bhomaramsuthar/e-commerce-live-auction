package com.bidcraft.product_service;

import com.bidcraft.product_service.model.Product;
import com.bidcraft.product_service.repository.ProductRepository;
import com.bidcraft.product_service.service.ProductService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest(properties = {
        "spring.cache.type=simple", // Use in-memory simple cache instead of Redis for unit testing
        "spring.cloud.discovery.enabled=false", // Disable Eureka client for the test
        "eureka.client.enabled=false"
})
class ProductServiceCacheTest {

    @Autowired
    private ProductService productService;

    @MockitoBean
    private ProductRepository productRepository;

    @Test
    void testGetProductByIdCaching() {
        String productId = "test-id-123";
        Product mockProduct = Product.builder()
                .id(productId)
                .name("Cached Controller Test Product")
                .price(BigDecimal.valueOf(99.99))
                .build();

        // Stub the repository to return the product
        Mockito.when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        // First call: should query the database repository
        Product productFirstCall = productService.getProductById(productId);
        assertEquals(productId, productFirstCall.getId());

        // Second call: should retrieve the product from the cache, NOT querying the repository
        Product productSecondCall = productService.getProductById(productId);
        assertEquals(productId, productSecondCall.getId());

        // Verify that findById was called exactly ONCE on the repository
        verify(productRepository, times(1)).findById(productId);
    }
}
