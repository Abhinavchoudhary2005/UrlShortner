package com.abhinav.demo.controller;

import com.abhinav.demo.dto.RegisterRequest;
import com.abhinav.demo.entity.User;
import com.abhinav.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.abhinav.demo.dto.UserResponse;
import com.abhinav.demo.dto.LoginRequest;
import com.abhinav.demo.dto.LoginResponse;
import com.abhinav.demo.service.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
        UserService userService,
        JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        try {

            User user = userService.register(request);

            UserResponse response = new UserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getRole()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        try {

            User user = userService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            String token = jwtService.generateToken(user);

            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getRole(),
                    token
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}