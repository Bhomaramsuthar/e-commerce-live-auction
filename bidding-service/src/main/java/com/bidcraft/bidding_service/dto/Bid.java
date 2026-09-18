package com.bidcraft.bidding_service.dto;

public record Bid(String auctionId, String bidderId, Double amount) {
}
