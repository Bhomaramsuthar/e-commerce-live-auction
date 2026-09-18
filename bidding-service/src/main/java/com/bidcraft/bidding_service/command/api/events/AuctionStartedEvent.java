package com.bidcraft.bidding_service.command.api.events;

public class AuctionStartedEvent {
    private final String auctionId;

    public AuctionStartedEvent(String auctionId) {
        this.auctionId = auctionId;
    }

    public String getAuctionId() {
        return auctionId;
    }
}
