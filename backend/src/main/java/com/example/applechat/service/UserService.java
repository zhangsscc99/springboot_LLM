package com.example.applechat.service;

import com.example.applechat.repository.UserRepository;
import com.example.applechat.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public User registerUser(String username, String email, String password, String fullName) {
        logger.debug("注册用户: {}, 密码长度: {}", username, password.length());
        String encodedPassword = passwordEncoder.encode(password);
        logger.debug("密码加密后长度: {}, 加密结果: {}", encodedPassword.length(), encodedPassword);
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setFullName(fullName);
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        user.setRole("USER");
        
        long id = userRepository.insert(user);
        user.setId(id);
        
        return user;
    }
    
    public void updateLastLogin(Long userId) {
        userRepository.updateLastLogin(userId);
    }
    
    public User findByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            logger.debug("查找到用户: {}, 密码哈希值: {}", username, user.getPassword());
        } else {
            logger.debug("未找到用户: {}", username);
        }
        return user;
    }
    
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
} 