package com.tplaneing.trip_planeing.controller;

import com.tplaneing.trip_planeing.model.Message;
import com.tplaneing.trip_planeing.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class HelloController {

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping("/hello")
    public Message saveMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }

    @GetMapping("/hello")
    public List<Message> getMessages() {
        return messageRepository.findAll();
    }
}
