package com.bidcraft.bidding_service.dto;

public class PlaceBidRequest {
    private String bidderId;
    private Double amount;

    public String getBidderId() { return bidderId; }
    public void setBidderId(String bidderId) { this.bidderId = bidderId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
