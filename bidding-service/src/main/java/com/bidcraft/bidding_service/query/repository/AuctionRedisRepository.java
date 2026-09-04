package com.bidcraft.bidding_service.query.repository;

import com.bidcraft.bidding_service.command.aggregate.AuctionAggregate;
import com.bidcraft.bidding_service.query.model.AuctionReadModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionRedisRepository extends CrudRepository<AuctionReadModel,String> {
}
