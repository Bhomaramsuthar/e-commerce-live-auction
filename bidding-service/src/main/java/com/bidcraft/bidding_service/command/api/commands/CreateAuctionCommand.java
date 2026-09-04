package com.bidcraft.bidding_service.command.api.commands;

import org.axonframework.modelling.command.TargetAggregateIdentifier;

import java.lang.annotation.Target;

public class CreateAuctionCommand {

    @TargetAggregateIdentifier
    private final String auctionId;
    private final String productId;
    private final Double startingPrice;

    public CreateAuctionCommand(String auctionId,String productId,Double startingPrice){
        this.auctionId = auctionId;
        this.productId = productId;
        this.startingPrice = startingPrice;
    }

    public String getAuctionId(){ return auctionId; }
    public String getProductId(){ return productId; }
    public Double getStartingPrice(){ return startingPrice; }

}
