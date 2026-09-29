package com.abhinav.demo.controller;

import com.abhinav.demo.dto.AnalyticsSummaryResponse;
import com.abhinav.demo.dto.ClickAnalyticsResponse;
import com.abhinav.demo.dto.UrlResponse;
import com.abhinav.demo.entity.Click;
import com.abhinav.demo.entity.Url;
import com.abhinav.demo.repository.ClickRepository;
import com.abhinav.demo.service.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;
    private final ClickRepository clickRepository;

    public UrlController(
            UrlService urlService,
            ClickRepository clickRepository) {

        this.urlService = urlService;
        this.clickRepository = clickRepository;
    }

    @PostMapping
    public ResponseEntity<UrlResponse> createUrl(
            @RequestBody Url url) {

        try {

            Url savedUrl = urlService.saveUrl(url);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(toResponse(savedUrl));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<UrlResponse>> getMyUrls() {

        List<Url> urls = urlService.getMyUrls();

        List<UrlResponse> response = urls.stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/info/{shortCode}")
    public ResponseEntity<UrlResponse> getUrlInfo(
            @PathVariable String shortCode) {

        Url url = urlService.getUrlByShortCode(shortCode);

        if (url == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(toResponse(url));
    }

    @GetMapping("/analytics/{shortCode}")
    public ResponseEntity<List<ClickAnalyticsResponse>> getAnalytics(
            @PathVariable String shortCode) {

        if (!urlService.isOwner(shortCode)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        List<Click> clicks =
                clickRepository.findByUrl_ShortCode(shortCode);

        List<ClickAnalyticsResponse> analytics =
                clicks.stream()
                        .map(click -> new ClickAnalyticsResponse(
                                click.getId(),
                                click.getClickedAt(),
                                click.getIpAddress(),
                                click.getUserAgent(),
                                click.getReferrer()
                        ))
                        .toList();

        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/{shortCode}/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getAnalyticsSummary(
            @PathVariable String shortCode) {

        if (!urlService.isOwner(shortCode)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        List<Click> clicks =
                clickRepository.findByUrl_ShortCode(shortCode);

        if (clicks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        long totalClicks = clicks.size();

        long uniqueVisitors = clicks.stream()
                .map(Click::getIpAddress)
                .filter(ip -> ip != null)
                .distinct()
                .count();

        LocalDateTime firstClick = clicks.stream()
                .map(Click::getClickedAt)
                .min(LocalDateTime::compareTo)
                .orElse(null);

        LocalDateTime lastClick = clicks.stream()
                .map(Click::getClickedAt)
                .max(LocalDateTime::compareTo)
                .orElse(null);

        AnalyticsSummaryResponse summary =
                new AnalyticsSummaryResponse(
                        totalClicks,
                        uniqueVisitors,
                        firstClick,
                        lastClick
                );

        return ResponseEntity.ok(summary);
    }

    private UrlResponse toResponse(Url url) {

        return new UrlResponse(
                url.getId(),
                url.getOriginalUrl(),
                url.getShortCode(),
                url.getCustomAlias(),
                url.getClickCount(),
                url.getExpiresAt()
        );
    }
}