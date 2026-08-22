package com.bidcraft.order_service.scheduler;

import com.bidcraft.order_service.model.OutboxEvent;
import com.bidcraft.order_service.repository.OutboxEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OutboxPoller {

    private static final Logger log = LoggerFactory.getLogger(OutboxPoller.class);

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String ,Object>kafkaTemplate;

    public OutboxPoller(OutboxEventRepository outboxEventRepository,KafkaTemplate<String,Object> kafkaTemplate){
        this.outboxEventRepository = outboxEventRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    //runs every 5 sec
    @Scheduled(fixedDelay = 5000)
    public void pollOutbox(){
        List<OutboxEvent> pendingEvents = outboxEventRepository.findAll();
        for(OutboxEvent event : pendingEvents){
            //send to kafka
            kafkaTemplate.send("notificationTopic",event.getPayLoad());

            //log it cleanly
            log.info("OUTBOX : Successfully pushed {} event to KAFKA.Deleting from database.",event.getEventType());

            //delete from outbox once successfully handed off to kafka
            outboxEventRepository.delete(event);
        }
    }



}
