package com.abhinav.demo.controller;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/redis")
public class RedisTestController {

    private final StringRedisTemplate redisTemplate;

    public RedisTestController(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostMapping("/set")
    public String setValue(
            @RequestParam String key,
            @RequestParam String value) {

        redisTemplate.opsForValue().set(key, value);

        return "Saved to Redis";
    }

    @GetMapping("/get")
    public String getValue(
            @RequestParam String key) {

        String value = redisTemplate.opsForValue().get(key);

        if (value == null) {
            return "Key not found";
        }

        return value;
    }
}