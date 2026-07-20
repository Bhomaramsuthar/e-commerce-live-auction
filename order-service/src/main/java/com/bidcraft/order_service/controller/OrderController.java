package com.bidcraft.order_service.controller;

import com.bidcraft.order_service.model.Order;
import com.bidcraft.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody Order order) {
        orderService.placeOrder(order);
        return "Order Placed Successfully!";
    }
}