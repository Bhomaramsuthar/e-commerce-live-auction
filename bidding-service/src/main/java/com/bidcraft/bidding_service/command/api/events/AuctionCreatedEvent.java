package com.bidcraft.bidding_service.command.api.events;

import java.time.Instant;

public class AuctionCreatedEvent {
    private final String auctionId;
    private final String productId;
    private final String sellerId;
    private final Double startingPrice;
    private final Double minimumBidIncrement;
    private final Instant startTime;
    private final Instant endTime;

    public AuctionCreatedEvent(String auctionId, String productId, String sellerId, Double startingPrice, Double minimumBidIncrement, Instant startTime, Instant endTime) {
        this.auctionId = auctionId;
        this.productId = productId;
        this.sellerId = sellerId;
        this.startingPrice = startingPrice;
        this.minimumBidIncrement = minimumBidIncrement;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getAuctionId() { return auctionId; }
    public String getProductId() { return productId; }
    public String getSellerId() { return sellerId; }
    public Double getStartingPrice() { return startingPrice; }
    public Double getMinimumBidIncrement() { return minimumBidIncrement; }
    public Instant getStartTime() { return startTime; }
    public Instant getEndTime() { return endTime; }
}