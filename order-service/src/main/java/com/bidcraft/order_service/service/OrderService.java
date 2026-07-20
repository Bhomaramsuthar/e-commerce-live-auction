package com.bidcraft.order_service.service;

import com.bidcraft.order_service.model.Order;
import com.bidcraft.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional // This is the shield that ensures data integrity!
public class OrderService {

    private final OrderRepository orderRepository;

    public void placeOrder(Order order) {
        // Automatically generate a unique order tracking number
        order.setOrderNumber(UUID.randomUUID().toString());

        // Save the order (and because of CascadeType.ALL in our model, it saves the line items automatically too)
        orderRepository.save(order);
    }
}