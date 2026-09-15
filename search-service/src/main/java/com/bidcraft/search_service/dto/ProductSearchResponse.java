package com.bidcraft.search_service.dto;

import com.bidcraft.search_service.model.ProductDocument;

import java.util.List;

public record ProductSearchResponse(
        List<ProductDocument> items,
        long totalElements,
        int page,
        int size,
        int totalPages
) { }
