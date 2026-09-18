package com.bidcraft.bidding_service.query.projection;

import com.bidcraft.bidding_service.command.api.enums.AuctionStatus;
import com.bidcraft.bidding_service.command.api.events.AuctionCreatedEvent;
import com.bidcraft.bidding_service.command.api.events.AuctionEndedEvent;
import com.bidcraft.bidding_service.command.api.events.AuctionStartedEvent;
import com.bidcraft.bidding_service.command.api.events.BidPlacedEvent;
import com.bidcraft.bidding_service.query.api.queries.GetAuctionStatusQuery;
import com.bidcraft.bidding_service.query.api.queries.GetAuctionsQuery;
import com.bidcraft.bidding_service.query.model.AuctionReadModel;
import com.bidcraft.bidding_service.query.repository.AuctionRedisRepository;
import org.axonframework.eventhandling.EventHandler;
import org.axonframework.queryhandling.QueryHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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
        AuctionReadModel model = new AuctionReadModel();
        model.setAuctionId(event.getAuctionId());
        model.setProductId(event.getProductId());
        model.setSellerId(event.getSellerId());
        model.setStartingPrice(event.getStartingPrice());
        model.setCurrentHighestBid(event.getStartingPrice());
        model.setMinimumBidIncrement(event.getMinimumBidIncrement());
        model.setStartTime(event.getStartTime());
        model.setEndTime(event.getEndTime());
        model.setStatus(AuctionStatus.SCHEDULED);
        redisRepository.save(model);
    }

    @EventHandler
    public void on(AuctionStartedEvent event) {
        log.info("Projecting AuctionStartedEvent into Redis: {}", event.getAuctionId());
        redisRepository.findById(event.getAuctionId()).ifPresent(auction -> {
            auction.setStatus(AuctionStatus.LIVE);
            redisRepository.save(auction);
        });
    }

    @EventHandler
    public void on(AuctionEndedEvent event) {
        log.info("Projecting AuctionEndedEvent into Redis: {}", event.getAuctionId());
        redisRepository.findById(event.getAuctionId()).ifPresent(auction -> {
            auction.setStatus(AuctionStatus.ENDED);
            auction.setWinnerId(event.getWinnerId());
            auction.setFinalPrice(event.getFinalPrice());
            redisRepository.save(auction);
        });
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

    @QueryHandler
    public List<AuctionReadModel> handle(GetAuctionsQuery query) {
        List<AuctionReadModel> auctions = new ArrayList<>();
        redisRepository.findAll().forEach(auctions::add);
        if (query.getStatus() != null) {
            return auctions.stream()
                    .filter(a -> a.getStatus() == query.getStatus())
                    .collect(Collectors.toList());
        }
        return auctions;
    }
}