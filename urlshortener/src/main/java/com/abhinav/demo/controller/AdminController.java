package com.abhinav.demo.controller;

import com.abhinav.demo.dto.UrlResponse;
import com.abhinav.demo.entity.Url;
import com.abhinav.demo.entity.User;
import com.abhinav.demo.repository.ClickRepository;
import com.abhinav.demo.repository.UrlRepository;
import com.abhinav.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final UrlRepository urlRepository;
    private final ClickRepository clickRepository;

    public AdminController(
            UserRepository userRepository,
            UrlRepository urlRepository,
            ClickRepository clickRepository) {

        this.userRepository = userRepository;
        this.urlRepository = urlRepository;
        this.clickRepository = clickRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Welcome to Admin Dashboard";
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/urls")
    public List<UrlResponse> getAllUrls() {

        List<Url> urls = urlRepository.findAll();

        return urls.stream()
                .map(url -> new UrlResponse(
                        url.getId(),
                        url.getOriginalUrl(),
                        url.getShortCode(),
                        url.getCustomAlias(),
                        url.getClickCount(),
                        url.getExpiresAt()
                ))
                .toList();
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        long totalUsers = userRepository.count();
        long totalUrls = urlRepository.count();
        long totalClicks = clickRepository.count();

        return Map.of(
                "totalUsers", totalUsers,
                "totalUrls", totalUrls,
                "totalClicks", totalClicks
        );
    }
}