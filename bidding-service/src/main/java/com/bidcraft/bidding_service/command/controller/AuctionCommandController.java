package com.bidcraft.bidding_service.command.controller;


import com.bidcraft.bidding_service.command.api.commands.CreateAuctionCommand;
import com.bidcraft.bidding_service.command.api.commands.PlaceBidCommand;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/bidding/commands")
public class AuctionCommandController {

    private final CommandGateway commandGateway;
    public AuctionCommandController(CommandGateway commandGateway){
        this.commandGateway = commandGateway;
    }

    @PostMapping("/create")
    public CompletableFuture<String> createAuction(@RequestParam String productId, @RequestParam double startingPrice){
        String auctionId = UUID.randomUUID().toString();
        return commandGateway.send(new CreateAuctionCommand(auctionId,productId,startingPrice));
    }

    @PostMapping("/bid")
    public CompletableFuture<String> placeBid(@RequestParam String auctionId,@RequestParam String bidderId ,@RequestParam Double amount){
        return commandGateway.send(new PlaceBidCommand(auctionId,bidderId,amount));
    }

}
