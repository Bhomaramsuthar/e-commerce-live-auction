package com.bidcraft.bidding_service.command.api.events;

public class AuctionEndedEvent {
    private final String auctionId;
    private final String winnerId;
    private final Double finalPrice;

    public AuctionEndedEvent(String auctionId, String winnerId, Double finalPrice) {
        this.auctionId = auctionId;
        this.winnerId = winnerId;
        this.finalPrice = finalPrice;
    }

    public String getAuctionId() { return auctionId; }
    public String getWinnerId() { return winnerId; }
    public Double getFinalPrice() { return finalPrice; }
}
