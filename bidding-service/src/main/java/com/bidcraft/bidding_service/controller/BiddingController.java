package com.bidcraft.bidding_service.controller;

import com.bidcraft.bidding_service.BiddingServiceApplication;
import com.bidcraft.bidding_service.dto.Bid;
import com.bidcraft.bidding_service.event.AuctionEndedEvent;
import com.bidcraft.bidding_service.service.BiddingStreamService;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.awt.*;


@RestController
@RequestMapping("/api/bidding")
public class BiddingController {

    private final BiddingStreamService biddingStreamService;
    private final KafkaTemplate<String,Object> kafkaTemplate;

    public BiddingController(BiddingStreamService biddingStreamService, KafkaTemplate<String, Object> kafkaTemplate){
        this.biddingStreamService=biddingStreamService;
        this.kafkaTemplate= kafkaTemplate ;
    }

    //Endpoint 1 : place a new bid
    @PostMapping("/{productId}")
    public void placeBid(@PathVariable String productId, @RequestBody Bid bid){
        // in real scenario , you'd validate the amount is higher than the current highest bid here
        biddingStreamService.publishBid(new Bid(productId,bid.bidderId(),bid.amount()));
    }
    // Endpoint 2 : Listen to live bids via server-sent events (SSE)
    @GetMapping(value = "/stream/{productId}",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux streamBids(@PathVariable String productId){
        return biddingStreamService.getBidStream(productId);
    }

    // endpoint 3 : to end the bidding trigger
    @PostMapping("/{productId}/end")
    public String endAuction(@PathVariable String productId,@RequestParam String winningId, @RequestParam Double finalPrice){
        AuctionEndedEvent event = new AuctionEndedEvent(productId,winningId,finalPrice);
        kafkaTemplate.send("auctionTopic",event);
        return "Auction for "+productId+" ended. Winner "+winningId+" at $ " +finalPrice;
    }
}
