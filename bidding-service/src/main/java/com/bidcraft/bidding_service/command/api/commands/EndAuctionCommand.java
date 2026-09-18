package com.bidcraft.bidding_service.command.api.commands;

import org.axonframework.modelling.command.TargetAggregateIdentifier;

public class EndAuctionCommand {

    @TargetAggregateIdentifier
    private final String auctionId;

    public EndAuctionCommand(String auctionId) {
        this.auctionId = auctionId;
    }

    public String getAuctionId() {
        return auctionId;
    }
}
