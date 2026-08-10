package com.bidcraft.order_service.service;

import com.bidcraft.order_service.client.ProductClient;
import com.bidcraft.order_service.event.OrderPlacedEvent;
import com.bidcraft.order_service.model.Order;
import com.bidcraft.order_service.model.OrderLineItems;
import com.bidcraft.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional // This is the shield that ensures data integrity!
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;


    public void placeOrder(Order order) {
        // Verify that each product exists by calling the Product Service
        if (order.getOrderLineItemsList() != null) {
            for (OrderLineItems item : order.getOrderLineItemsList()) {
                productClient.getProductById(item.getProductId());
            }
        }

        // Automatically generate a unique order tracking number
        order.setOrderNumber(UUID.randomUUID().toString());

        // Save the order (and because of CascadeType.ALL in our model, it saves the
        // line items automatically too)
        orderRepository.save(order);

        //NEW : Boradcast the event to KAfka!
        kafkaTemplate.send("notificationTopic",new OrderPlacedEvent(order.getOrderNumber()));
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