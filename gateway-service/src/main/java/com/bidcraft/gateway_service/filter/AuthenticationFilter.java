package com.bidcraft.gateway_service.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1. Check if the request contains an "Authorization" header
        if (!exchange.getRequest().getHeaders().containsKey("Authorization")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 2. Extract the Token
        String authHeader = exchange.getRequest().getHeaders().get("Authorization").get(0);

        // 3. (Future Logic) Validate the JWT signature here
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // If valid, let the request pass to the destination microservice
        return chain.filter(exchange).onErrorResume(throwable -> {
            // If the microservice is down or unreachable, return a 503 instead of a 500 crash
            System.out.println("Routing failed: " + throwable.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
            return exchange.getResponse().setComplete();
        });
    }

    @Override
    public int getOrder() {
        return -1; // Ensures this filter runs before the routing happens
    }
}