package com.bidcraft.bidding_service.command.aggregate;

import com.bidcraft.bidding_service.command.api.commands.CreateAuctionCommand;
import com.bidcraft.bidding_service.command.api.commands.EndAuctionCommand;
import com.bidcraft.bidding_service.command.api.commands.PlaceBidCommand;
import com.bidcraft.bidding_service.command.api.commands.StartAuctionCommand;
import com.bidcraft.bidding_service.command.api.enums.AuctionStatus;
import com.bidcraft.bidding_service.command.api.events.AuctionCreatedEvent;
import com.bidcraft.bidding_service.command.api.events.AuctionEndedEvent;
import com.bidcraft.bidding_service.command.api.events.AuctionStartedEvent;
import com.bidcraft.bidding_service.command.api.events.BidPlacedEvent;
import org.axonframework.commandhandling.CommandHandler;
import org.axonframework.eventsourcing.EventSourcingHandler;
import org.axonframework.modelling.command.AggregateIdentifier;
import org.axonframework.modelling.command.AggregateLifecycle;
import org.axonframework.spring.stereotype.Aggregate;

import java.time.Instant;

@Aggregate
public class AuctionAggregate {

    @AggregateIdentifier
    private String auctionId;
    private String productId;
    private String sellerId;
    private Double startingPrice;
    private Double currentHighestBid;
    private String highestBidderId;
    private Double minimumBidIncrement;
    private Instant startTime;
    private Instant endTime;
    private AuctionStatus status;
    private String winnerId;
    private Double finalPrice;

    public AuctionAggregate(){
        // Required by Axon for rebuilding state
    }

    @CommandHandler
    public AuctionAggregate(CreateAuctionCommand command){
        if(command.getStartingPrice() <= 0){
            throw new IllegalArgumentException("Starting price must be greater than 0");
        }
        if(command.getMinimumBidIncrement() < 0) {
            throw new IllegalArgumentException("Minimum bid increment must be non-negative");
        }
        if(command.getStartTime() != null && command.getEndTime() != null && command.getStartTime().isAfter(command.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        AggregateLifecycle.apply(new AuctionCreatedEvent(
                command.getAuctionId(),
                command.getProductId(),
                command.getSellerId(),
                command.getStartingPrice(),
                command.getMinimumBidIncrement(),
                command.getStartTime(),
                command.getEndTime()
        ));
    }

    @CommandHandler
    public void handle(StartAuctionCommand command) {
        if (status != AuctionStatus.SCHEDULED) {
            throw new IllegalStateException("Auction must be SCHEDULED to be started.");
        }
        AggregateLifecycle.apply(new AuctionStartedEvent(command.getAuctionId()));
    }

    @CommandHandler
    public void handle(EndAuctionCommand command) {
        if (status == AuctionStatus.ENDED || status == AuctionStatus.CANCELLED) {
            throw new IllegalStateException("Auction is already ended or cancelled.");
        }

        Double finalPriceCalc = currentHighestBid;
        String winnerIdCalc = highestBidderId;

        // If no bids, final price might just be starting price and no winner, depending on business logic.
        AggregateLifecycle.apply(new AuctionEndedEvent(
                command.getAuctionId(),
                winnerIdCalc,
                finalPriceCalc
        ));
    }

    @CommandHandler
    public void handle(PlaceBidCommand command){
        if(status != AuctionStatus.LIVE){
            throw new IllegalStateException("Auction is not LIVE");
        }
        if(endTime != null && Instant.now().isAfter(endTime)) {
            throw new IllegalStateException("Auction has expired");
        }
        if(command.getBidderId().equals(sellerId)) {
            throw new IllegalArgumentException("Seller cannot bid on their own auction");
        }
        
        Double requiredBid = currentHighestBid;
        if(highestBidderId != null) {
            requiredBid += (minimumBidIncrement != null ? minimumBidIncrement : 0);
        }

        if(command.getBidAmount() < requiredBid){
            throw new IllegalArgumentException("Bid amount $" + command.getBidAmount() + " must be at least $" + requiredBid);
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
        this.sellerId = event.getSellerId();
        this.startingPrice = event.getStartingPrice();
        this.currentHighestBid = event.getStartingPrice();
        this.minimumBidIncrement = event.getMinimumBidIncrement();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.status = AuctionStatus.SCHEDULED;
    }

    @EventSourcingHandler
    public void on(AuctionStartedEvent event) {
        this.status = AuctionStatus.LIVE;
    }

    @EventSourcingHandler
    public void on(AuctionEndedEvent event) {
        this.status = AuctionStatus.ENDED;
        this.winnerId = event.getWinnerId();
        this.finalPrice = event.getFinalPrice();
    }

    @EventSourcingHandler
    public void on(BidPlacedEvent event){
        this.currentHighestBid = event.getBidAmount();
        this.highestBidderId = event.getBidderId();
    }
}
