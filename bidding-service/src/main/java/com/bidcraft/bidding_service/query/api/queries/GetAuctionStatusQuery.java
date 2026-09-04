package com.bidcraft.bidding_service.query.api.queries;

public class GetAuctionStatusQuery {
    private final String auctionId;

    public GetAuctionStatusQuery(String auctionId){
        this.auctionId = auctionId;
    }
    public String getAuctionId(){
        return auctionId;
    }
}
