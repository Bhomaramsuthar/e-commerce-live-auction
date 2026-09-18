package com.bidcraft.order_service.service;

import com.bidcraft.order_service.client.ProductClient;
import com.bidcraft.order_service.event.OrderPlacedEvent;
import com.bidcraft.order_service.model.Order;
import com.bidcraft.order_service.model.OrderLineItems;
import com.bidcraft.order_service.model.OutboxEvent;
import com.bidcraft.order_service.repository.OrderRepository;
import com.bidcraft.order_service.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional // This is the shield that ensures data integrity!
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ProductClient productClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;


    public void placeOrder(Order order) {
        // Verify that each product exists by calling the Product Service
        if (order.getOrderLineItemsList() != null) {
            for (OrderLineItems item : order.getOrderLineItemsList()) {
                productClient.getProductById(item.getProductId());
            }
        }

        // Automatically generate a unique order tracking number
        order.setOrderNumber(UUID.randomUUID().toString());

        //1. Save to PostgreSQL
        orderRepository.save(order);

        try {
            //2. Create the event
            OrderPlacedEvent event = new OrderPlacedEvent(order.getOrderNumber());

            //3. Convert to JSON and Save to the out box table
            String jsonPayload = objectMapper.writeValueAsString(event);
            OutboxEvent outboxEvent = new OutboxEvent("OrderPlaced",jsonPayload);
            outboxEventRepository.save(outboxEvent);

        }catch (Exception e){
            throw new RuntimeException("Failed to save event to outbox",e);
        }
    }

    public void createAuctionInvoice(String userId, String productId, Double finalPrice) {
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        OrderLineItems item = new OrderLineItems();
        item.setProductId(productId);
        item.setProductName("Auction Won: " + productId);
        item.setPrice(java.math.BigDecimal.valueOf(finalPrice));
        item.setQuantity(1);

        order.setOrderLineItemsList(List.of(item));

        orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrder(Long id, Order order) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        existingOrder.setOrderLineItemsList(order.getOrderLineItemsList());
        existingOrder.setOrderNumber(order.getOrderNumber());
        return orderRepository.save(existingOrder);
    }

    public Order patchOrder(Long id, Order order) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        if (order.getOrderLineItemsList() != null) {
            existingOrder.setOrderLineItemsList(order.getOrderLineItemsList());
        }
        if (order.getOrderNumber() != null) {
            existingOrder.setOrderNumber(order.getOrderNumber());
        }
        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}