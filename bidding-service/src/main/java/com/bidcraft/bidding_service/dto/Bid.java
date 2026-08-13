package com.bidcraft.bidding_service.dto;

public record Bid(String productId, String bidderId, Double amount) {
}
