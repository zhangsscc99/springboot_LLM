package com.example.applechat.controller;

import com.example.applechat.dto.JwtResponse;
import com.example.applechat.dto.LoginRequest;
import com.example.applechat.dto.RegisterRequest;
import com.example.applechat.model.User;
import com.example.applechat.security.JwtUtils;
import com.example.applechat.security.services.UserDetailsImpl;
import com.example.applechat.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        logger.debug("收到登录请求: {}, 密码长度: {}", loginRequest.getUsername(), loginRequest.getPassword().length());
        
        // 检查用户是否存在
        User user = userService.findByUsername(loginRequest.getUsername());
        if (user == null) {
            logger.error("登录失败: 用户不存在 - {}", loginRequest.getUsername());
            return ResponseEntity.badRequest().body("用户名或密码不正确");
        }
        
        // 手动验证密码
        boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        logger.debug("密码验证结果: {}, 输入密码长度: {}, 数据库密码长度: {}", 
                    passwordMatches, loginRequest.getPassword().length(), user.getPassword().length());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            logger.debug("登录成功: {}", userDetails.getUsername());
            
            // 更新最后登录时间
            userService.updateLastLogin(userDetails.getId());
            
            return ResponseEntity.ok(new JwtResponse(jwt, 
                                                    userDetails.getId(),
                                                    userDetails.getUsername(),
                                                    userDetails.getEmail(),
                                                    userDetails.getAuthorities().iterator().next().getAuthority()));
        } catch (BadCredentialsException e) {
            logger.error("登录失败: 密码不匹配 - {}", loginRequest.getUsername());
            return ResponseEntity.badRequest().body("用户名或密码不正确");
        } catch (Exception e) {
            logger.error("登录过程中发生错误", e);
            return ResponseEntity.badRequest().body("登录失败: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // 添加调试日志
        logger.debug("收到注册请求: {}, 邮箱: {}, 密码长度: {}", 
                    registerRequest.getUsername(), registerRequest.getEmail(), registerRequest.getPassword().length());
        
        if (userService.existsByUsername(registerRequest.getUsername())) {
            logger.debug("注册失败: 用户名已存在 - {}", registerRequest.getUsername());
            return ResponseEntity
                    .badRequest()
                    .body("错误：用户名已被使用！");
        }

        if (userService.existsByEmail(registerRequest.getEmail())) {
            logger.debug("注册失败: 邮箱已存在 - {}", registerRequest.getEmail());
            return ResponseEntity
                    .badRequest()
                    .body("错误：邮箱已被使用！");
        }

        // 创建新用户
        User user = userService.registerUser(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                registerRequest.getFullName());

        logger.debug("注册成功: {}, ID: {}", user.getUsername(), user.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "用户注册成功！");
        response.put("username", user.getUsername());
        
        return ResponseEntity.ok(response);
    }
}