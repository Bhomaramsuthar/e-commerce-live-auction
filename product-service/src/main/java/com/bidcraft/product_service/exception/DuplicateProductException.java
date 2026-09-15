package com.bidcraft.product_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateProductException extends RuntimeException {
    public DuplicateProductException(String sku) {
        super("A product with SKU '" + sku + "' already exists");
    }
}
