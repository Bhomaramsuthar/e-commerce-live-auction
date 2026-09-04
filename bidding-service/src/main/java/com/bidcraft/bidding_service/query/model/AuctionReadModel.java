package com.bidcraft.bidding_service.query.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

@RedisHash("Auction")
public class AuctionReadModel implements Serializable {

    @Id
    private  String auctionId;
    private  String productId;
    private  Double currentHighestBid;
    private  String highestBidderId;
    private  boolean active;

    public AuctionReadModel(){}

    public AuctionReadModel(String auctionId,String productId,Double currentHighestBid,String highestBidderId,boolean active){
        this.auctionId = auctionId;
        this.productId = productId;
        this.currentHighestBid = currentHighestBid;
        this.highestBidderId = highestBidderId;
        this.active = active;
    }

    public String getAuctionId(){return auctionId;}
    public void setAuctionId(String auctionId){this.auctionId = auctionId;}

    public String getProductId(){return productId;}
    public void setProductId(String productId){this.productId = productId;}

    public Double getCurrentHighestBid(){return currentHighestBid;}
    public void setCurrentHighestBid(Double currentHighestBid){this.currentHighestBid = currentHighestBid;}

    public String getHighestBidderId(){return highestBidderId;}
    public void setHighestBidderId(String highestBidderId){this.highestBidderId = highestBidderId;}

    public boolean isActive(){ return active;}
    public void setActive(boolean active){this.active = active;}
}
