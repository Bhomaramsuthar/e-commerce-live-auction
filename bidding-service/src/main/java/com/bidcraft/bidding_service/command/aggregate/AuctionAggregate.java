package com.bidcraft.bidding_service.command.aggregate;

import com.bidcraft.bidding_service.command.api.commands.CreateAuctionCommand;
import com.bidcraft.bidding_service.command.api.commands.PlaceBidCommand;
import com.bidcraft.bidding_service.command.api.events.AuctionCreatedEvent;
import com.bidcraft.bidding_service.command.api.events.BidPlacedEvent;
import org.axonframework.commandhandling.CommandHandler;
import org.axonframework.eventhandling.EventHandler;
import org.axonframework.eventsourcing.EventSourcingHandler;
import org.axonframework.modelling.command.AggregateIdentifier;
import org.axonframework.modelling.command.AggregateLifecycle;
import org.axonframework.spring.stereotype.Aggregate;

@Aggregate
public class AuctionAggregate {

    @AggregateIdentifier
    private String auctionId;
    private String productId;
    private Double currentHighestBid;
    private String highestBidderId;
    private boolean active;

    public AuctionAggregate(){
        // Required by Axon for rebuilding state
    }

    @CommandHandler
    public AuctionAggregate(CreateAuctionCommand command){
        if(command.getStartingPrice() <= 0){
            throw new IllegalArgumentException("Starting price must be greater than 0");
        }

        AggregateLifecycle.apply(new AuctionCreatedEvent(
                command.getAuctionId(),
                command.getProductId(),
                command.getStartingPrice()
        ));
    }

    @CommandHandler
    public void handle(PlaceBidCommand command){
        if(!active){
            throw new IllegalArgumentException("Auction is closed");
        }
        if(command.getBidAmount() <= currentHighestBid){
            throw  new IllegalArgumentException("Bid amount $" + command.getBidAmount() + " must be higher than current highest bid $" + currentHighestBid);
        }

        AggregateLifecycle.apply(new BidPlacedEvent(
                command.getAuctionId(),
                command.getBidderId(),
                command.getBidAmount()
        ));
    }

    @EventSourcingHandler
    public void on(AuctionCreatedEvent event){
        this.auctionId = event.getAuctionId();
        this.productId = event.getProductId();
        this.currentHighestBid = event.getStartingPrice();
        this.active = true;
    }

    @EventSourcingHandler
    public  void on(BidPlacedEvent event){
        this.currentHighestBid = event.getBidAmount();
        this.highestBidderId = event.getBidderId();
    }
}
