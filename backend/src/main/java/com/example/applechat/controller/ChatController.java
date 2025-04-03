package com.example.applechat.controller;

import com.example.applechat.config.AIConfig;
import com.example.applechat.config.SimpleOpenAIClient;
import com.example.applechat.model.Message;
import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.Response;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // 允许所有跨域请求
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    
    @Autowired
    private SimpleOpenAIClient openAIClient;
    
    @Autowired
    private AIConfig aiConfig;
    
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/completions")
    public ResponseEntity<String> chatCompletion(@RequestBody List<Message> messages) {
        logger.info("Received chat request with {} messages", messages.size());
        
        try {
            // 添加系统消息
            List<Message> allMessages = new ArrayList<>();
            allMessages.add(new Message("system", aiConfig.getSystemContent()));
            allMessages.addAll(messages);
            
            // 准备请求参数
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("model", aiConfig.getModel());
            requestData.put("messages", allMessages);
            requestData.put("stream", false); // 关闭流式响应
            
            // 发送请求
            Response response = openAIClient.createChatCompletion(requestData);
            
            if (!response.isSuccessful()) {
                logger.error("API调用失败，状态码: {}", response.code());
                return ResponseEntity.status(response.code())
                        .body("API调用失败: " + response.code());
            }
            
            ResponseBody body = response.body();
            if (body == null) {
                logger.error("响应体为空");
                return ResponseEntity.status(500).body("响应体为空");
            }
            
            String responseStr = body.string();
            return ResponseEntity.ok(responseStr);
            
        } catch (Exception e) {
            logger.error("处理聊天请求时出错", e);
            return ResponseEntity.status(500)
                    .body("处理请求时发生错误: " + e.getMessage());
        }
    }
} 