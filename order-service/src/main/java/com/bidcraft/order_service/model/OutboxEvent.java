package com.bidcraft.order_service.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Locale;

@Entity
@Table(name="outbox_events")
public class OutboxEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String eventType;

    @Column
    private String payload;
    private LocalDateTime createdAt = LocalDateTime.now();

    public OutboxEvent(){}

    public OutboxEvent(String eventType,String payLoad){
        this.eventType = eventType;
        this.payload = payload;
    }

    public String getEventType(){ return eventType; }
    public String getPayLoad(){ return payload; }
    public Long getId() { return id; }

}
