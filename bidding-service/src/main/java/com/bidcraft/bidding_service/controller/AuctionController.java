package com.bidcraft.bidding_service.controller;

import com.bidcraft.bidding_service.command.api.commands.CreateAuctionCommand;
import com.bidcraft.bidding_service.command.api.commands.EndAuctionCommand;
import com.bidcraft.bidding_service.command.api.commands.PlaceBidCommand;
import com.bidcraft.bidding_service.command.api.commands.StartAuctionCommand;
import com.bidcraft.bidding_service.command.api.enums.AuctionStatus;
import com.bidcraft.bidding_service.dto.Bid;
import com.bidcraft.bidding_service.dto.CreateAuctionRequest;
import com.bidcraft.bidding_service.dto.PlaceBidRequest;
import com.bidcraft.bidding_service.query.api.queries.GetAuctionStatusQuery;
import com.bidcraft.bidding_service.query.api.queries.GetAuctionsQuery;
import com.bidcraft.bidding_service.query.model.AuctionReadModel;
import com.bidcraft.bidding_service.service.BiddingStreamService;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.axonframework.messaging.responsetypes.ResponseTypes;
import org.axonframework.queryhandling.QueryGateway;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final CommandGateway commandGateway;
    private final QueryGateway queryGateway;
    private final BiddingStreamService biddingStreamService;

    public AuctionController(CommandGateway commandGateway, QueryGateway queryGateway, BiddingStreamService biddingStreamService) {
        this.commandGateway = commandGateway;
        this.queryGateway = queryGateway;
        this.biddingStreamService = biddingStreamService;
    }

    @GetMapping
    public CompletableFuture<List<AuctionReadModel>> getAuctions() {
        return queryGateway.query(
                new GetAuctionsQuery(),
                ResponseTypes.multipleInstancesOf(AuctionReadModel.class)
        );
    }

    @GetMapping("/live")
    public CompletableFuture<List<AuctionReadModel>> getLiveAuctions() {
        return queryGateway.query(
                new GetAuctionsQuery(AuctionStatus.LIVE),
                ResponseTypes.multipleInstancesOf(AuctionReadModel.class)
        );
    }

    @GetMapping("/{auctionId}")
    public CompletableFuture<AuctionReadModel> getAuction(@PathVariable String auctionId) {
        return queryGateway.query(
                new GetAuctionStatusQuery(auctionId),
                ResponseTypes.instanceOf(AuctionReadModel.class)
        );
    }

    @PostMapping
    public CompletableFuture<String> createAuction(@RequestBody CreateAuctionRequest request) {
        String auctionId = UUID.randomUUID().toString();
        return commandGateway.send(new CreateAuctionCommand(
                auctionId,
                request.getProductId(),
                request.getSellerId(),
                request.getStartingPrice(),
                request.getMinimumBidIncrement(),
                request.getStartTime(),
                request.getEndTime()
        ));
    }

    @PostMapping("/{auctionId}/start")
    public CompletableFuture<String> startAuction(@PathVariable String auctionId) {
        return commandGateway.send(new StartAuctionCommand(auctionId));
    }

    @PostMapping("/{auctionId}/end")
    public CompletableFuture<String> endAuction(@PathVariable String auctionId) {
        return commandGateway.send(new EndAuctionCommand(auctionId));
    }

    @PostMapping("/{auctionId}/bids")
    public CompletableFuture<String> placeBid(@PathVariable String auctionId, @RequestBody PlaceBidRequest request) {
        return commandGateway.<String>send(new PlaceBidCommand(
                auctionId,
                request.getBidderId(),
                request.getAmount()
        )).thenApply(result -> {
            // After successful Axon command processing, broadcast to SSE
            biddingStreamService.publishBid(new Bid(auctionId, request.getBidderId(), request.getAmount()));
            return result;
        });
    }

    @GetMapping(value = "/{auctionId}/bids/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Bid> streamBids(@PathVariable String auctionId) {
        return biddingStreamService.getBidStream(auctionId);
    }
}
