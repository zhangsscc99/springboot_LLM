package com.example.applechat.repository;

import com.example.applechat.model.User;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long insert(User user);
    void updateLastLogin(Long id);
    Optional<User> findById(Long id);
} 