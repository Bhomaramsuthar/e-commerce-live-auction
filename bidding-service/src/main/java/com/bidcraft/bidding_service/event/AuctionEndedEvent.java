package com.bidcraft.bidding_service.event;

public class AuctionEndedEvent {

    private String productId;
    private String winningBidderId;
    private Double finalPrice;

    public AuctionEndedEvent(){}

    public AuctionEndedEvent(String productId, String winningBidderId, Double finalPrice){
        this.productId = productId;
        this.winningBidderId = winningBidderId;
        this.finalPrice = finalPrice;
    }

    public String getProductId(){ return productId;}
    public String getWinningBidderId(){ return winningBidderId;}
    public Double getFinalPrice(){ return finalPrice;}


}
