package com.bidcraft.order_service.repository;

import com.bidcraft.order_service.model.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent,Long> {
}
