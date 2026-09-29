package com.abhinav.demo.dto;

import java.time.LocalDateTime;

public class UrlResponse {

    private Long id;
    private String originalUrl;
    private String shortCode;
    private String customAlias;
    private Long clickCount;
    private LocalDateTime expiresAt;

    public UrlResponse(
            Long id,
            String originalUrl,
            String shortCode,
            String customAlias,
            Long clickCount,
            LocalDateTime expiresAt) {

        this.id = id;
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.customAlias = customAlias;
        this.clickCount = clickCount;
        this.expiresAt = expiresAt;
    }

    public Long getId() {
        return id;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public String getShortCode() {
        return shortCode;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public Long getClickCount() {
        return clickCount;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}