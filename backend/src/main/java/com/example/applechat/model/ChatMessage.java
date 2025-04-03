package com.example.applechat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;
    
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
} 