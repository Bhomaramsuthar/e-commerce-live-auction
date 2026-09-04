package com.bidcraft.bidding_service.query.controller;


import com.bidcraft.bidding_service.command.controller.AuctionCommandController;
import com.bidcraft.bidding_service.query.api.queries.GetAuctionStatusQuery;
import com.bidcraft.bidding_service.query.model.AuctionReadModel;
import org.axonframework.messaging.responsetypes.ResponseTypes;
import org.axonframework.queryhandling.QueryGateway;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/bidding/queries")
public class AuctionQueryController {

    private final QueryGateway queryGateway;
    public AuctionQueryController(QueryGateway queryGateway){
        this.queryGateway = queryGateway;
    }

    @GetMapping("/{auctionId}")
    public CompletableFuture<AuctionReadModel> getAuctionStatus(@PathVariable String auctionId){
        return queryGateway.query(
                new GetAuctionStatusQuery(auctionId),
                ResponseTypes.instanceOf(AuctionReadModel.class)
        );
    }
}
