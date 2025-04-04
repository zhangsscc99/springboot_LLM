package com.example.applechat.repository;

import com.example.applechat.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.Optional;

@Repository
public class JdbcUserRepository implements UserRepository {

    private static final Logger logger = LoggerFactory.getLogger(JdbcUserRepository.class);
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setEmail(rs.getString("email"));
        user.setFullName(rs.getString("full_name"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        user.setUpdatedAt(rs.getTimestamp("updated_at"));
        user.setLastLogin(rs.getTimestamp("last_login"));
        user.setRole(rs.getString("role"));
        return user;
    };

    @Autowired
    public JdbcUserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        try {
            logger.debug("查询用户名: {}", username);
            User user = jdbcTemplate.queryForObject(
                    "SELECT * FROM users WHERE username = ?",
                    userRowMapper,
                    username
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            logger.debug("未找到用户: {}", username);
            return Optional.empty();
        } catch (DataAccessException e) {
            logger.error("查询用户时出错: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        try {
            logger.debug("通过邮箱查询用户: {}", email);
            User user = jdbcTemplate.queryForObject(
                    "SELECT * FROM users WHERE email = ?",
                    userRowMapper,
                    email
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            logger.debug("未找到邮箱: {}", email);
            return Optional.empty();
        } catch (DataAccessException e) {
            logger.error("查询邮箱时出错: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public boolean existsByUsername(String username) {
        try {
            logger.debug("检查用户名是否存在: {}", username);
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE username = ?",
                    Integer.class,
                    username
            );
            return count != null && count > 0;
        } catch (DataAccessException e) {
            logger.error("检查用户名是否存在时出错: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        try {
            logger.debug("检查邮箱是否存在: {}", email);
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE email = ?",
                    Integer.class,
                    email
            );
            return count != null && count > 0;
        } catch (DataAccessException e) {
            logger.error("检查邮箱是否存在时出错: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public long insert(User user) {
        try {
            logger.debug("插入新用户: {}", user.getUsername());
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(
                        "INSERT INTO users(username, password, email, full_name, created_at, updated_at, role) " +
                                "VALUES(?, ?, ?, ?, NOW(), NOW(), ?)",
                        Statement.RETURN_GENERATED_KEYS
                );
                ps.setString(1, user.getUsername());
                ps.setString(2, user.getPassword());
                ps.setString(3, user.getEmail());
                ps.setString(4, user.getFullName());
                ps.setString(5, user.getRole());
                return ps;
            }, keyHolder);

            long id = Objects.requireNonNull(keyHolder.getKey()).longValue();
            logger.debug("用户创建成功，ID: {}", id);
            return id;
        } catch (DataAccessException e) {
            logger.error("插入用户时出错: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateLastLogin(Long id) {
        try {
            logger.debug("更新用户最后登录时间, ID: {}", id);
            jdbcTemplate.update(
                    "UPDATE users SET last_login = NOW() WHERE id = ?",
                    id
            );
        } catch (DataAccessException e) {
            logger.error("更新用户最后登录时间出错: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public Optional<User> findById(Long id) {
        try {
            logger.debug("通过ID查询用户: {}", id);
            User user = jdbcTemplate.queryForObject(
                    "SELECT * FROM users WHERE id = ?",
                    userRowMapper,
                    id
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            logger.debug("未找到ID: {}", id);
            return Optional.empty();
        } catch (DataAccessException e) {
            logger.error("查询用户ID时出错: {}", e.getMessage());
            throw e;
        }
    }
} 