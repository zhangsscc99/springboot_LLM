package com.example.applechat.model;

import java.util.List;

public class ChatRequest {
    private String model;
    private List<Message> messages;
    private boolean stream;

    public ChatRequest() {
    }

    public ChatRequest(String model, List<Message> messages, boolean stream) {
        this.model = model;
        this.messages = messages;
        this.stream = stream;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public boolean isStream() {
        return stream;
    }

    public void setStream(boolean stream) {
        this.stream = stream;
    }
} 