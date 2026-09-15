package com.bidcraft.search_service.service;

import com.bidcraft.search_service.client.ProductCatalogClient;
import com.bidcraft.search_service.model.ProductDocument;
import com.bidcraft.search_service.repository.ProductSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductIndexRebuildService {
    private final ProductCatalogClient productCatalogClient;
    private final ProductSearchRepository searchRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    /** Replaces the projection with the catalog source of truth exposed by product-service. */
    public long rebuild() {
        IndexOperations index = elasticsearchOperations.indexOps(ProductDocument.class);
        if (index.exists()) index.delete();
        index.create();
        index.putMapping(index.createMapping());

        var documents = productCatalogClient.fetchAll().stream()
                .map(product -> ProductDocument.builder().id(product.id()).name(product.name())
                        .description(product.description()).price(product.price())
                        .dynamicAttributes(product.dynamicAttributes()).build())
                .toList();
        searchRepository.saveAll(documents);
        log.info("Rebuilt products index with {} products", documents.size());
        return documents.size();
    }
}
