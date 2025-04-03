package com.example.applechat.service;

import com.example.applechat.config.AIConfig;
import com.example.applechat.model.ChatRequest;
import com.example.applechat.model.Message;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIChatService {
    private static final Logger logger = LoggerFactory.getLogger(AIChatService.class);
    
    @Autowired
    private AIConfig aiConfig;
    
    @Autowired
    private Retrofit retrofit;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public interface OpenAIApi {
        @Headers({
            "Content-Type: application/json"
        })
        @POST("/chat/completions")
        Call<ResponseBody> createChatCompletion(@Body RequestBody requestBody);
    }
    
    public Flux<String> chatCompletion(List<Message> chatMessages) {
        // Add system message
        List<Message> messages = new ArrayList<>();
        messages.add(new Message("system", aiConfig.getSystemContent()));
        messages.addAll(chatMessages);
        
        try {
            // 创建请求体
            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("model", aiConfig.getModel());
            requestMap.put("messages", messages);
            requestMap.put("stream", true);
            
            String jsonBody = objectMapper.writeValueAsString(requestMap);
            RequestBody requestBody = RequestBody.create(okhttp3.MediaType.parse("application/json"), jsonBody);
            
            // 创建API客户端并调用
            OpenAIApi openAIApi = retrofit.create(OpenAIApi.class);
            Call<ResponseBody> call = openAIApi.createChatCompletion(requestBody);
            
            logger.info("Sending request to Aliyun Qwen: {}", jsonBody);
            
            return Flux.create(emitter -> {
                try {
                    Response<ResponseBody> response = call.execute();
                    if (!response.isSuccessful()) {
                        logger.error("Error response: {}", response.code());
                        emitter.error(new RuntimeException("API call failed with code: " + response.code()));
                        return;
                    }
                    
                    if (response.body() == null) {
                        logger.error("Empty response body");
                        emitter.error(new RuntimeException("Empty response body"));
                        return;
                    }
                    
                    // 处理流式响应
                    try {
                        String responseString = response.body().string();
                        String[] lines = responseString.split("\n");
                        
                        for (String line : lines) {
                            if (line.startsWith("data: ")) {
                                String data = line.substring(6);
                                if (!data.equals("[DONE]")) {
                                    emitter.next(line);
                                }
                            }
                        }
                        
                        emitter.complete();
                    } catch (IOException e) {
                        logger.error("Error reading response", e);
                        emitter.error(e);
                    }
                } catch (Exception e) {
                    logger.error("Error executing request", e);
                    emitter.error(e);
                }
            });
        } catch (Exception e) {
            logger.error("Error preparing request", e);
            return Flux.error(e);
        }
    }
} 