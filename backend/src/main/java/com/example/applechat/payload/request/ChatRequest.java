package com.example.applechat.payload.request;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotEmpty;

/**
 * 聊天请求的数据传输对象
 */
public class ChatRequest {
    
    @NotEmpty
    private List<Map<String, String>> messages;
    
    // 可选参数，如果使用特定LLM时可能会用到
    private String model;
    private Double temperature;
    private Integer maxTokens;
    
    // 构造函数
    public ChatRequest() {
    }
    
    public ChatRequest(List<Map<String, String>> messages) {
        this.messages = messages;
    }
    
    // Getters and setters
    public List<Map<String, String>> getMessages() {
        return messages;
    }
    
    public void setMessages(List<Map<String, String>> messages) {
        this.messages = messages;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    
    public Integer getMaxTokens() {
        return maxTokens;
    }
    
    public void setMaxTokens(Integer maxTokens) {
        this.maxTokens = maxTokens;
    }
    
    @Override
    public String toString() {
        return "ChatRequest{" +
                "messageCount=" + (messages != null ? messages.size() : 0) +
                ", model='" + model + '\'' +
                '}';
    }
} 