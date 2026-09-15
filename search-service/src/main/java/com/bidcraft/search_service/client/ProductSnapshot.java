package com.bidcraft.search_service.client;

import java.math.BigDecimal;
import java.util.Map;

public record ProductSnapshot(String id, String name, String description, BigDecimal price,
                              Map<String, String> dynamicAttributes) { }
