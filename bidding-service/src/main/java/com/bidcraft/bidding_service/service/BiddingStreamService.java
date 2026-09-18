package com.bidcraft.bidding_service.service;

import com.bidcraft.bidding_service.dto.Bid;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Service
public class BiddingStreamService {

    private final Sinks.Many<Bid> sink = Sinks.many().multicast().onBackpressureBuffer();

    public void publishBid(Bid bid) {
        sink.tryEmitNext(bid);
    }

    public Flux<Bid> getBidStream(String auctionId) {
        return sink.asFlux()
                .filter(bid -> bid.auctionId().equals(auctionId));
    }
}