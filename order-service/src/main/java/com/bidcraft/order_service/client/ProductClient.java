package com.bidcraft.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// The 'name' must exactly match the name of the Product Service in Eureka
@FeignClient(name = "product-service")
public interface ProductClient {

    // This method signature exactly matches the one in ProductController
    @GetMapping("/api/product/{id}")
    Object getProductById(@PathVariable("id") String id);
    // Note: We use 'Object' here for simplicity, but ideally, you'd create a
    // ProductResponse DTO class in the order-service to map the incoming JSON safely.
}