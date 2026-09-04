package com.bidcraft.bidding_service.query.projection;

import com.bidcraft.bidding_service.command.api.events.AuctionCreatedEvent;
import com.bidcraft.bidding_service.command.api.events.BidPlacedEvent;
import com.bidcraft.bidding_service.query.api.queries.GetAuctionStatusQuery;
import com.bidcraft.bidding_service.query.model.AuctionReadModel;
import com.bidcraft.bidding_service.query.repository.AuctionRedisRepository;
import org.axonframework.eventhandling.EventHandler;
import org.axonframework.queryhandling.QueryHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AuctionProjection {

    private static final Logger log = LoggerFactory.getLogger(AuctionProjection.class);
    private final AuctionRedisRepository redisRepository;

    public AuctionProjection(AuctionRedisRepository redisRepository) {
        this.redisRepository = redisRepository;
    }

    @EventHandler
    public void on(AuctionCreatedEvent event) {
        log.info("Projecting AuctionCreatedEvent into Redis: {}", event.getAuctionId());
        AuctionReadModel model = new AuctionReadModel(
                event.getAuctionId(),
                event.getProductId(),
                event.getStartingPrice(),
                "NO_BIDS_YET",
                true
        );
        redisRepository.save(model);
    }

    @EventHandler
    public void on(BidPlacedEvent event) {
        log.info("Projecting BidPlacedEvent into Redis: {} -> ${}", event.getAuctionId(), event.getBidAmount());
        redisRepository.findById(event.getAuctionId()).ifPresent(auction -> {
            auction.setCurrentHighestBid(event.getBidAmount());
            auction.setHighestBidderId(event.getBidderId());
            redisRepository.save(auction);
        });
    }

    @QueryHandler
    public AuctionReadModel handle(GetAuctionStatusQuery query) {
        return redisRepository.findById(query.getAuctionId())
                .orElseThrow(() -> new RuntimeException("Auction not found in read model: " + query.getAuctionId()));
    }
}