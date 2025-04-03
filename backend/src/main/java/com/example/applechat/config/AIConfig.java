package com.example.applechat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {
    @Value("${ai.aliyun.api-key:sk-18fcc076d5d746fea3c922d20aef7364}")
    private String apiKey;
    
    @Value("${ai.aliyun.base-url:https://dashscope.aliyuncs.com/compatible-mode/v1}")
    private String baseUrl;
    
    @Value("${ai.aliyun.model:qwen-plus}")
    private String model;
    
    @Value("${ai.aliyun.system-content:你是一个有用的AI助手}")
    private String systemContent;

    public String getApiKey() {
        return apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
    
    public String getModel() {
        return model;
    }
    
    public String getSystemContent() {
        return systemContent;
    }
} 