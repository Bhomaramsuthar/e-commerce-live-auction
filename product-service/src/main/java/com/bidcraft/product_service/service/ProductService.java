package com.bidcraft.product_service.service;

import com.bidcraft.product_service.model.Product;
import com.bidcraft.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product createProduct(Product product) {
        // Here is where future business logic would go (e.g., checking if price > 0)
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Cacheable(value = "product", key = "#id")
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @CacheEvict(value = "product", key = "#id")
    public Product updateProduct(String id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setDynamicAttributes(product.getDynamicAttributes());
        return productRepository.save(existingProduct);
    }

    @CacheEvict(value = "product", key = "#id")
    public Product patchProduct(String id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        if (product.getName() != null) {
            existingProduct.setName(product.getName());
        }
        if (product.getDescription() != null) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getPrice() != null) {
            existingProduct.setPrice(product.getPrice());
        }
        if (product.getDynamicAttributes() != null) {
            existingProduct.setDynamicAttributes(product.getDynamicAttributes());
        }
        return productRepository.save(existingProduct);
    }

    @CacheEvict(value = "product", key = "#id")
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}