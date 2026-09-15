package com.bidcraft.search_service.config;

import com.bidcraft.search_service.model.ProductDocument;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.stereotype.Component;

/** Creates the projection index and its mapping only when it does not exist. */
@Component
@RequiredArgsConstructor
@Slf4j
public class ElasticsearchIndexConfig {
    private final ElasticsearchOperations elasticsearchOperations;

    @PostConstruct
    void ensureProductIndex() {
        IndexOperations indexOperations = elasticsearchOperations.indexOps(ProductDocument.class);
        if (!indexOperations.exists()) {
            indexOperations.create();
            indexOperations.putMapping(indexOperations.createMapping());
            log.info("Created Elasticsearch products index");
        }
    }
}
