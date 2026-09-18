package com.bidcraft.gateway_service.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    // Needs to match the secret used in auth-service
    private final String secretKey = "a48624c803f7e53f1406450f38b255da10faeb2e08e8b0a94b5952f200c9e831";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().name();

        // 1. Allow preflight OPTIONS requests
        if ("OPTIONS".equals(method)) {
            return chain.filter(exchange);
        }

        // 2. Allow public endpoints (Products, Search, Auth)
        if (path.startsWith("/api/product") || path.startsWith("/api/search") || path.startsWith("/api/auth")) {
            return chain.filter(exchange);
        }

        // 3. Check if the request contains an "Authorization" header
        if (!exchange.getRequest().getHeaders().containsKey("Authorization")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 4. Extract the Token
        String authHeader = exchange.getRequest().getHeaders().get("Authorization").get(0);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        try {
            // 5. Cryptographically validate the JWT signature
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            SecretKey key = Keys.hmacShaKeyFor(keyBytes);

            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // 6. Extract UserId and Role
            String userId = claims.get("userId", String.class);
            String role = claims.get("role", String.class);

            // 7. Inject headers for downstream microservices so they never trust the client
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Role", role)
                    .build();

            ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

            // 8. Let the request pass to the destination microservice
            return chain.filter(mutatedExchange).onErrorResume(throwable -> {
                System.out.println("Routing failed: " + throwable.getMessage());
                exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
                return exchange.getResponse().setComplete();
            });

        } catch (Exception e) {
            // Token is invalid or expired
            System.out.println("JWT Validation Failed: " + e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -1; // Ensures this filter runs before the routing happens
    }
}