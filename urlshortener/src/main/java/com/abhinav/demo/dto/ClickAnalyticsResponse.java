package com.abhinav.demo.dto;

import java.time.LocalDateTime;

public class ClickAnalyticsResponse {

    private Long id;
    private LocalDateTime clickedAt;
    private String ipAddress;
    private String userAgent;
    private String referrer;

    public ClickAnalyticsResponse(
            Long id,
            LocalDateTime clickedAt,
            String ipAddress,
            String userAgent,
            String referrer) {

        this.id = id;
        this.clickedAt = clickedAt;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.referrer = referrer;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getClickedAt() {
        return clickedAt;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public String getReferrer() {
        return referrer;
    }
}