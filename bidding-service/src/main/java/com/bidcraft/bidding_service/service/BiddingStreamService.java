package com.bidcraft.bidding_service.service;

import com.bidcraft.bidding_service.dto.Bid;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Service
public class BiddingStreamService {

    // This Sink is our radio tower. 'multicast' means it broadcasts to ALL connected clients at once.
    private final Sinks.Many<Bid> sink = Sinks.many().multicast().onBackpressureBuffer();

    // When a new bid is placed, we emit it to the Sink
    public void publishBid(Bid bid) {
        sink.tryEmitNext(bid);
    }

    // Clients call this to "tune in" to the broadcast for a specific product
    public Flux getBidStream(String productId) {
        return sink.asFlux()
                .filter((Bid bid) -> bid.productId().equals(productId)); // Only send bids for the item they are watching
    }
}