package com.bidcraft.order_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_line_items")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class OrderLineItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productId; // This will eventually link back to the MongoDB product ID
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}