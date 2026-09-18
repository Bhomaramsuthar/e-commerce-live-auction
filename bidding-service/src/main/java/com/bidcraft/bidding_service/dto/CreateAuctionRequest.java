package com.bidcraft.bidding_service.dto;

import java.time.Instant;

public class CreateAuctionRequest {
    private String productId;
    private String sellerId;
    private Double startingPrice;
    private Double minimumBidIncrement;
    private Instant startTime;
    private Instant endTime;

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public Double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(Double startingPrice) { this.startingPrice = startingPrice; }

    public Double getMinimumBidIncrement() { return minimumBidIncrement; }
    public void setMinimumBidIncrement(Double minimumBidIncrement) { this.minimumBidIncrement = minimumBidIncrement; }

    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
}
