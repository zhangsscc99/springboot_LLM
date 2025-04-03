package com.example.applechat.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 简化版OpenAI客户端，类似于Node.js的OpenAI客户端
 */
@Component
public class SimpleOpenAIClient {

    private final OkHttpClient client;
    private final String apiKey;
    private final String baseURL;
    private final ObjectMapper objectMapper;

    @Autowired
    public SimpleOpenAIClient(AIConfig aiConfig, ObjectMapper objectMapper) {
        this.apiKey = aiConfig.getApiKey();
        this.baseURL = aiConfig.getBaseUrl();
        this.objectMapper = objectMapper;

        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    /**
     * 创建聊天完成请求
     * @param requestData 请求数据
     * @return 响应内容
     * @throws IOException 如果请求失败
     */
    public Response createChatCompletion(Map<String, Object> requestData) throws IOException {
        String url = baseURL + "chat/completions";
        
        String json = objectMapper.writeValueAsString(requestData);
        RequestBody body = RequestBody.create(MediaType.parse("application/json"), json);
        
        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();
        
        return client.newCall(request).execute();
    }
} 