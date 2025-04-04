package com.example.applechat.mapper;

import com.example.applechat.model.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    
    @Select("SELECT * FROM users WHERE username = #{username}")
    User findByUsername(String username);
    
    @Select("SELECT * FROM users WHERE email = #{email}")
    User findByEmail(String email);
    
    @Select("SELECT COUNT(*) > 0 FROM users WHERE username = #{username}")
    boolean existsByUsername(String username);
    
    @Select("SELECT COUNT(*) > 0 FROM users WHERE email = #{email}")
    boolean existsByEmail(String email);
    
    @Insert("INSERT INTO users(username, password, email, full_name, created_at, updated_at, role) " +
            "VALUES(#{username}, #{password}, #{email}, #{fullName}, NOW(), NOW(), #{role})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE users SET last_login = NOW() WHERE id = #{id}")
    void updateLastLogin(Long id);
    
    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(Long id);
} 