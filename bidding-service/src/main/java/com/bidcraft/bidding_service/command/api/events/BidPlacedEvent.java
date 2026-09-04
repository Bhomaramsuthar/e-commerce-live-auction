package com.bidcraft.bidding_service.command.api.events;

public class BidPlacedEvent {
    private final String auctionId;
    private final String bidderId;
    private final Double bidAmount;

    public BidPlacedEvent(String auctionId, String bidderId, Double bidAmount) {
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.bidAmount = bidAmount;
    }

    public String getAuctionId() { return auctionId; }
    public String getBidderId() { return bidderId; }
    public Double getBidAmount() { return bidAmount; }
}