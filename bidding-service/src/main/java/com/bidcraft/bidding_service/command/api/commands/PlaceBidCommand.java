package com.bidcraft.bidding_service.command.api.commands;

import org.axonframework.modelling.command.TargetAggregateIdentifier; // Make sure this is imported!

public class PlaceBidCommand {

    @TargetAggregateIdentifier // <--- THIS IS THE MAGIC FIX
    private final String auctionId;

    private final String bidderId;
    private final Double bidAmount;

    public PlaceBidCommand(String auctionId, String bidderId, Double bidAmount) {
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.bidAmount = bidAmount;
    }

    public String getAuctionId() { return auctionId; }
    public String getBidderId() { return bidderId; }
    public Double getBidAmount() { return bidAmount; }
}