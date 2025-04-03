package com.example.applechat.service;

import com.example.applechat.model.ChatMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class BotService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public BotService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    
    public void processUserMessage(ChatMessage userMessage) {
        if (userMessage.getSender().equals("user")) {
            // Create a bot response message
            ChatMessage botResponse = new ChatMessage();
            botResponse.setContent(generateBotResponse(userMessage.getContent()));
            botResponse.setSender("Apple Assistant");
            botResponse.setType(ChatMessage.MessageType.CHAT);
            
            // Send bot response after a small delay to simulate thinking
            new Thread(() -> {
                try {
                    Thread.sleep(1000);
                    messagingTemplate.convertAndSend("/topic/public", botResponse);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
    
    private String generateBotResponse(String userMessage) {
        userMessage = userMessage.toLowerCase();
        
        if (userMessage.contains("hello") || userMessage.contains("hi")) {
            return "Hello! How can I help you today?";
        } else if (userMessage.contains("name")) {
            return "I'm Apple Assistant, your friendly chat bot!";
        } else if (userMessage.contains("feature") || userMessage.contains("help")) {
            return "I can chat with you about Apple products and services. Feel free to ask me anything!";
        } else if (userMessage.contains("iphone")) {
            return "Apple's iPhone is our flagship smartphone, combining cutting-edge technology with elegant design. Would you like to know more about a specific model?";
        } else if (userMessage.contains("macbook")) {
            return "MacBooks are Apple's premium laptops, designed for both productivity and creativity. They come in Air and Pro models to suit different needs.";
        } else if (userMessage.contains("bye") || userMessage.contains("goodbye")) {
            return "Goodbye! Have a great day!";
        } else {
            return "That's interesting! Tell me more or ask me about Apple products.";
        }
    }
} 