package com.bidcraft.search_service.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

/** Reads a rebuild snapshot through product-service; search-service never reads MongoDB directly. */
@Component
public class ProductCatalogClient {
    private final RestClient restClient;

    public ProductCatalogClient(@Value("${product-catalog.url:http://localhost:8081/api/product}") String catalogUrl) {
        this.restClient = RestClient.builder().baseUrl(catalogUrl).build();
    }

    public List<ProductSnapshot> fetchAll() {
        List<ProductSnapshot> products = restClient.get().retrieve()
                .body(new ParameterizedTypeReference<List<ProductSnapshot>>() { });
        return products == null ? List.of() : products;
    }
}
