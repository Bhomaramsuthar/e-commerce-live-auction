package com.bidcraft.bidding_service.query.api.queries;

import com.bidcraft.bidding_service.command.api.enums.AuctionStatus;

public class GetAuctionsQuery {
    private final AuctionStatus status;

    public GetAuctionsQuery(AuctionStatus status) {
        this.status = status;
    }

    public GetAuctionsQuery() {
        this.status = null;
    }

    public AuctionStatus getStatus() {
        return status;
    }
}
