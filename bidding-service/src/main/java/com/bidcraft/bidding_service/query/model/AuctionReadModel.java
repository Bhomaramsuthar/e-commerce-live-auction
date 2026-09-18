package com.bidcraft.bidding_service.query.model;

import com.bidcraft.bidding_service.command.api.enums.AuctionStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.time.Instant;

@RedisHash("Auction")
public class AuctionReadModel implements Serializable {

    @Id
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

    public AuctionReadModel(){}

    public String getAuctionId() { return auctionId; }
    public void setAuctionId(String auctionId) { this.auctionId = auctionId; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public Double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(Double startingPrice) { this.startingPrice = startingPrice; }

    public Double getCurrentHighestBid() { return currentHighestBid; }
    public void setCurrentHighestBid(Double currentHighestBid) { this.currentHighestBid = currentHighestBid; }

    public String getHighestBidderId() { return highestBidderId; }
    public void setHighestBidderId(String highestBidderId) { this.highestBidderId = highestBidderId; }

    public Double getMinimumBidIncrement() { return minimumBidIncrement; }
    public void setMinimumBidIncrement(Double minimumBidIncrement) { this.minimumBidIncrement = minimumBidIncrement; }

    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }

    public AuctionStatus getStatus() { return status; }
    public void setStatus(AuctionStatus status) { this.status = status; }

    public String getWinnerId() { return winnerId; }
    public void setWinnerId(String winnerId) { this.winnerId = winnerId; }

    public Double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(Double finalPrice) { this.finalPrice = finalPrice; }
}
