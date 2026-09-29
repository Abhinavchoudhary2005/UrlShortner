package com.abhinav.demo.dto;

import java.time.LocalDateTime;

public class AnalyticsSummaryResponse {

    private long totalClicks;
    private long uniqueVisitors;
    private LocalDateTime firstClick;
    private LocalDateTime lastClick;

    public AnalyticsSummaryResponse(
            long totalClicks,
            long uniqueVisitors,
            LocalDateTime firstClick,
            LocalDateTime lastClick) {

        this.totalClicks = totalClicks;
        this.uniqueVisitors = uniqueVisitors;
        this.firstClick = firstClick;
        this.lastClick = lastClick;
    }

    public long getTotalClicks() {
        return totalClicks;
    }

    public long getUniqueVisitors() {
        return uniqueVisitors;
    }

    public LocalDateTime getFirstClick() {
        return firstClick;
    }

    public LocalDateTime getLastClick() {
        return lastClick;
    }
}