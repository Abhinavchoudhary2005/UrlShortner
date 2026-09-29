package com.abhinav.demo.controller;

import com.abhinav.demo.entity.Url;
import com.abhinav.demo.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@RestController
public class RedirectController {

    private final UrlService urlService;

    public RedirectController(UrlService urlService) {
        this.urlService = urlService;
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(
            @PathVariable String shortCode,
            HttpServletRequest request) {

        // Get URL from Redis first
        String originalUrl =
                urlService.getOriginalUrlFromCache(shortCode);

        String ipAddress = request.getRemoteAddr();

        String userAgent = request.getHeader("User-Agent");

        String referrer = request.getHeader("Referer");

        // =========================
        // REDIS CACHE HIT
        // =========================

        if (originalUrl != null) {

            System.out.println("REDIS CACHE HIT");

            Url url = urlService.recordClick(
                    shortCode,
                    ipAddress,
                    userAgent,
                    referrer
            );

            if (url == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity
                    .status(HttpStatus.FOUND)
                    .header("Location", originalUrl)
                    .build();
        }

        // =========================
        // REDIS CACHE MISS
        // =========================

        System.out.println("REDIS CACHE MISS");

        Url url = urlService.getUrlByShortCode(shortCode);

        if (url == null) {
            return ResponseEntity.notFound().build();
        }

        // Check expiration
        if (url.getExpiresAt() != null
            && LocalDateTime.now()
            .isAfter(url.getExpiresAt())) {

            return ResponseEntity
                .status(HttpStatus.GONE)
                .build();
        }

        // Record analytics
        urlService.recordClick(
                shortCode,
                ipAddress,
                userAgent,
                referrer
        );

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .header("Location", url.getOriginalUrl())
                .build();
    }
}