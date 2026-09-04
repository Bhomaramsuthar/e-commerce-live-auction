package com.bidcraft.bidding_service.command.api.events;

public class AuctionCreatedEvent {
    private final String auctionId;
    private final String productId;
    private final Double startingPrice;

    public AuctionCreatedEvent(String auctionId, String productId, Double startingPrice) {
        this.auctionId = auctionId;
        this.productId = productId;
        this.startingPrice = startingPrice;
    }

    public String getAuctionId() { return auctionId; }
    public String getProductId() { return productId; }
    public Double getStartingPrice() { return startingPrice; }
}