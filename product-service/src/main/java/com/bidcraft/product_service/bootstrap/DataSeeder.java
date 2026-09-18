package com.bidcraft.product_service.bootstrap;

import com.bidcraft.product_service.model.Product;
import com.bidcraft.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            log.info("Database empty, seeding products...");
            seedProducts();
            log.info("Finished seeding products.");
        } else {
            log.info("Database already contains data, skipping seeding.");
        }
    }

    private void seedProducts() {
        Product watch1 = Product.builder()
                .sku("SKU-WATCH-001")
                .name("Automatic Rose Gold 40mm")
                .description("A stunning 40mm automatic watch crafted in 18k rose gold with a sunburst dial.")
                .price(new BigDecimal("4200.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Maison Vachette",
                        "category", "Watches",
                        "isNew", "true",
                        "endsAt", Instant.now().plus(Duration.ofHours(5)).toString()
                ))
                .build();

        Product bag1 = Product.builder()
                .sku("SKU-BAG-001")
                .name("Sellier 28 Noir")
                .description("Classic silhouette in premium black leather with gold-tone hardware.")
                .price(new BigDecimal("8750.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Atelier Marchand",
                        "category", "Bags",
                        "isNew", "true",
                        "endsAt", Instant.now().plus(Duration.ofHours(12)).toString()
                ))
                .build();

        Product ring1 = Product.builder()
                .sku("SKU-RING-001")
                .name("Solitaire 0.5ct VVS1")
                .description("Brilliant cut 0.5 carat diamond set in a platinum band.")
                .price(new BigDecimal("3100.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Carat & Co",
                        "category", "Jewelry",
                        "isNew", "true",
                        "endsAt", Instant.now().plus(Duration.ofHours(2)).toString()
                ))
                .build();

        Product shoes1 = Product.builder()
                .sku("SKU-SHOES-001")
                .name("Oxford Cap-Toe Cognac")
                .description("Hand-crafted leather oxfords with a rich cognac patina.")
                .price(new BigDecimal("1850.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Berluti Reserve",
                        "category", "Shoes",
                        "isNew", "true",
                        "endsAt", Instant.now().plus(Duration.ofHours(8)).toString()
                ))
                .build();

        Product watch2 = Product.builder()
                .sku("SKU-WATCH-002")
                .name("Chronograph Steel 42mm")
                .description("Professional chronograph in stainless steel with a black ceramic bezel.")
                .price(new BigDecimal("6500.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Alpine Horology",
                        "category", "Watches",
                        "isNew", "false",
                        "endsAt", Instant.now().plus(Duration.ofHours(24)).toString()
                ))
                .build();

        Product bag2 = Product.builder()
                .sku("SKU-BAG-002")
                .name("Tote Monogram Vintage")
                .description("Iconic monogram canvas tote with natural cowhide leather trim.")
                .price(new BigDecimal("1200.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Heritage House",
                        "category", "Bags",
                        "isNew", "false",
                        "endsAt", Instant.now().plus(Duration.ofHours(4)).toString()
                ))
                .build();

        Product ring2 = Product.builder()
                .sku("SKU-RING-002")
                .name("Sapphire Halo 1.2ct")
                .description("Deep blue cushion-cut sapphire surrounded by a halo of brilliant diamonds.")
                .price(new BigDecimal("5400.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Royal Gems",
                        "category", "Jewelry",
                        "isNew", "true",
                        "endsAt", Instant.now().plus(Duration.ofHours(16)).toString()
                ))
                .build();

        Product shoes2 = Product.builder()
                .sku("SKU-SHOES-002")
                .name("Suede Loafers Navy")
                .description("Elegant navy suede loafers perfect for casual and formal wear.")
                .price(new BigDecimal("650.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Milano Artisans",
                        "category", "Shoes",
                        "isNew", "true",
                        "endsAt", Instant.now().plus(Duration.ofHours(6)).toString()
                ))
                .build();

        Product watch3 = Product.builder()
                .sku("SKU-WATCH-003")
                .name("Vintage Diver 1968")
                .description("A rare vintage dive watch with a beautifully faded ghost bezel and tropical dial.")
                .price(new BigDecimal("12500.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Oceanic",
                        "category", "Watches",
                        "isNew", "false",
                        "endsAt", Instant.now().plus(Duration.ofHours(48)).toString()
                ))
                .build();

        Product bag3 = Product.builder()
                .sku("SKU-BAG-003")
                .name("Mini Crossbody Ruby")
                .description("Compact crossbody bag in vibrant ruby red calfskin.")
                .price(new BigDecimal("950.00"))
                .dynamicAttributes(Map.of(
                        "designer", "Bella Moda",
                        "category", "Bags",
                        "isNew", "true",
                        "endsAt", Instant.now().plus(Duration.ofHours(3)).toString()
                ))
                .build();

        productRepository.saveAll(List.of(
                watch1, bag1, ring1, shoes1, watch2,
                bag2, ring2, shoes2, watch3, bag3
        ));
    }
}
