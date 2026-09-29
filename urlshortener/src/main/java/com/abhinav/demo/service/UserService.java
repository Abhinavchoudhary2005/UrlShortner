package com.abhinav.demo.service;

import com.abhinav.demo.dto.RegisterRequest;
import com.abhinav.demo.entity.User;
import com.abhinav.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setEmail(request.getEmail());

        // Hash password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // New users are normal users
        user.setRole("USER");

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        // Check password against BCrypt hash
        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}