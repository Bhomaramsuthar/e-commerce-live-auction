package com.bidcraft.gateway_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

@RestController
public class SessionTestController {

    @GetMapping("/api/session-test")
    public Mono<String> testSession(WebSession session) {
        // Explicitly put an attribute to force session creation in Redis
        session.getAttributes().put("test-key", "Hello from Gateway Session!");
        return Mono.just("Session created! Check your Redis DB. Session ID: " + session.getId());
    }
}
