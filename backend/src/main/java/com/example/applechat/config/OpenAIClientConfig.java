package com.example.applechat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import io.reactivex.disposables.Disposable;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;
import retrofit2.converter.jackson.JacksonConverterFactory;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Configuration
public class OpenAIClientConfig {

    @Autowired
    private AIConfig aiConfig;

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectionPool(new ConnectionPool(5, 1, TimeUnit.SECONDS))
                .connectTimeout(Duration.ofSeconds(30))
                .readTimeout(Duration.ofSeconds(30))
                .writeTimeout(Duration.ofSeconds(30))
                .addInterceptor(chain -> {
                    okhttp3.Request original = chain.request();
                    
                    okhttp3.Request request = original.newBuilder()
                            .header("Authorization", "Bearer " + aiConfig.getApiKey())
                            .header("Content-Type", "application/json")
                            .method(original.method(), original.body())
                            .build();
                    
                    return chain.proceed(request);
                })
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        return mapper;
    }

    @Bean
    public Retrofit retrofit(OkHttpClient okHttpClient, ObjectMapper objectMapper) {
        return new Retrofit.Builder()
                .baseUrl(aiConfig.getBaseUrl())
                .client(okHttpClient)
                .addConverterFactory(JacksonConverterFactory.create(objectMapper))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .build();
    }
}