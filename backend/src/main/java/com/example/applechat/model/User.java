package com.example.applechat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias("User")
public class User {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String fullName;
    private Date createdAt;
    private Date updatedAt;
    private Date lastLogin;
    private String role;
} 