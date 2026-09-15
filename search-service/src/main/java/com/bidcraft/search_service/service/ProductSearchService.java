package com.bidcraft.search_service.service;

import com.bidcraft.search_service.dto.ProductSearchResponse;
import com.bidcraft.search_service.model.ProductDocument;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.StringQuery;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductSearchService {
    private static final List<String> SORTABLE_FIELDS = List.of("_score", "price", "name");

    private final ElasticsearchOperations elasticsearchOperations;
    private final ObjectMapper objectMapper;
    private final io.micrometer.core.instrument.MeterRegistry meterRegistry;

    public ProductSearchResponse search(String text, BigDecimal minPrice, BigDecimal maxPrice,
                                        int page, int size, String sort, String direction) {
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("minPrice cannot be greater than maxPrice");
        }
        String sortField = SORTABLE_FIELDS.contains(sort) ? sort : "_score";
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        StringQuery query = new StringQuery(toElasticsearchQuery(text, minPrice, maxPrice));
        query.setPageable(PageRequest.of(page, size, Sort.by(sortDirection, sortField)));

        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            SearchHits<ProductDocument> hits = elasticsearchOperations.search(query, ProductDocument.class);
            long total = hits.getTotalHits();
            return new ProductSearchResponse(hits.stream().map(hit -> hit.getContent()).toList(), total,
                    page, size, (int) Math.ceil((double) total / size));
        } finally {
            sample.stop(Timer.builder("search.product_query.duration").register(meterRegistry));
        }
    }

    private String toElasticsearchQuery(String text, BigDecimal minPrice, BigDecimal maxPrice) {
        Map<String, Object> bool = new LinkedHashMap<>();
        List<Object> must = new ArrayList<>();
        if (text != null && !text.isBlank()) {
            must.add(Map.of("multi_match", Map.of(
                    "query", text.trim(),
                    "fields", List.of("name^3", "description", "dynamicAttributes.*"),
                    "fuzziness", "AUTO"
            )));
        } else {
            must.add(Map.of("match_all", Map.of()));
        }
        bool.put("must", must);

        List<Object> filters = new ArrayList<>();
        if (minPrice != null || maxPrice != null) {
            Map<String, Object> range = new LinkedHashMap<>();
            if (minPrice != null) range.put("gte", minPrice);
            if (maxPrice != null) range.put("lte", maxPrice);
            filters.add(Map.of("range", Map.of("price", range)));
        }
        if (!filters.isEmpty()) bool.put("filter", filters);
        try {
            return objectMapper.writeValueAsString(Map.of("bool", bool));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to create Elasticsearch search query", e);
        }
    }
}
