package com.bidcraft.search_service.controller;

import com.bidcraft.search_service.dto.ProductSearchResponse;
import com.bidcraft.search_service.model.ProductDocument;
import com.bidcraft.search_service.service.ProductIndexRebuildService;
import com.bidcraft.search_service.service.ProductSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ProductSearchService productSearchService;
    private final ProductIndexRebuildService productIndexRebuildService;

    @GetMapping("/products")
    public ProductSearchResponse searchProducts(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "_score") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("page must be non-negative and size must be between 1 and 100");
        }
        return productSearchService.search(query, minPrice, maxPrice, page, size, sort, direction);
    }

    @PostMapping("/products/rebuild")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public java.util.Map<String, Long> rebuildProductIndex() {
        return java.util.Map.of("indexedProducts", productIndexRebuildService.rebuild());
    }
}
