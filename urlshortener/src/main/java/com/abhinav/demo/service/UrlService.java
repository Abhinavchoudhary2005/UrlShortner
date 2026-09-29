package com.abhinav.demo.service;

import com.abhinav.demo.entity.Click;
import com.abhinav.demo.entity.Url;
import com.abhinav.demo.entity.User;
import com.abhinav.demo.repository.ClickRepository;
import com.abhinav.demo.repository.UrlRepository;
import com.abhinav.demo.repository.UserRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final StringRedisTemplate redisTemplate;
    private final ClickRepository clickRepository;
    private final UserRepository userRepository;

    public UrlService(
            UrlRepository urlRepository,
            StringRedisTemplate redisTemplate,
            ClickRepository clickRepository,
            UserRepository userRepository) {

        this.urlRepository = urlRepository;
        this.redisTemplate = redisTemplate;
        this.clickRepository = clickRepository;
        this.userRepository = userRepository;
    }

    public Url saveUrl(Url url) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        url.setUser(user);

        // Custom alias
        if (url.getCustomAlias() != null
                && !url.getCustomAlias().isBlank()) {

            String alias = url.getCustomAlias();

            if (urlRepository.existsByShortCode(alias)) {
                throw new RuntimeException(
                        "Custom alias already exists"
                );
            }

            url.setShortCode(alias);

            Url savedUrl = urlRepository.save(url);

            cacheUrl(savedUrl);

            return savedUrl;
        }

        // Normal Base62 URL
        Url savedUrl = urlRepository.save(url);

        Long id = savedUrl.getId();

        String shortCode = encodeBase62(id);

        savedUrl.setShortCode(shortCode);

        savedUrl = urlRepository.save(savedUrl);

        cacheUrl(savedUrl);

        return savedUrl;
    }

    private String encodeBase62(Long number) {

        String characters =
                "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        StringBuilder result = new StringBuilder();

        while (number > 0) {

            int remainder =
                    (int) (number % 62);

            result.append(
                    characters.charAt(remainder)
            );

            number = number / 62;
        }

        return result.reverse().toString();
    }

    public Url getUrlByShortCode(String shortCode) {

        String redisKey = "url:" + shortCode;

        String originalUrl =
                redisTemplate.opsForValue().get(redisKey);

        if (originalUrl != null) {

            System.out.println("REDIS CACHE HIT");

            Url url = new Url();

            url.setShortCode(shortCode);
            url.setOriginalUrl(originalUrl);

            return url;
        }

        System.out.println("REDIS CACHE MISS");

        Url url = urlRepository
                .findByShortCode(shortCode)
                .orElse(null);

        if (url != null) {
            cacheUrl(url);
        }

        return url;
    }

    public String getOriginalUrlFromCache(
            String shortCode) {

        String redisKey = "url:" + shortCode;

        return redisTemplate
                .opsForValue()
                .get(redisKey);
    }

    public Url recordClick(
            String shortCode,
            String ipAddress,
            String userAgent,
            String referrer) {

        Url url = urlRepository
                .findByShortCode(shortCode)
                .orElse(null);

        if (url == null) {
            return null;
        }

        // Check expiration
        if (url.getExpiresAt() != null
                && LocalDateTime.now()
                .isAfter(url.getExpiresAt())) {

            return null;
        }

        // Increase click count
        url.setClickCount(
                url.getClickCount() + 1
        );

        urlRepository.save(url);

        // Save click analytics
        Click click = new Click();

        click.setClickedAt(
                LocalDateTime.now()
        );

        click.setIpAddress(ipAddress);
        click.setUserAgent(userAgent);
        click.setReferrer(referrer);
        click.setUrl(url);

        clickRepository.save(click);

        System.out.println(
                "CLICK SAVED SUCCESSFULLY"
        );

        cacheUrl(url);

        return url;
    }

    private void cacheUrl(Url url) {

        String redisKey =
                "url:" + url.getShortCode();

        if (url.getExpiresAt() != null) {

            long seconds =
                    Duration.between(
                            LocalDateTime.now(),
                            url.getExpiresAt()
                    ).getSeconds();

            if (seconds > 0) {

                redisTemplate.opsForValue().set(
                        redisKey,
                        url.getOriginalUrl(),
                        seconds,
                        TimeUnit.SECONDS
                );
            }

        } else {

            redisTemplate.opsForValue().set(
                    redisKey,
                    url.getOriginalUrl()
            );
        }
    }

    public Url getUrlFromDatabase(
            String shortCode) {

        return urlRepository
                .findByShortCode(shortCode)
                .orElse(null);
    }

    public List<Url> getMyUrls() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return urlRepository.findByUser(user);
    }

    public boolean isOwner(String shortCode) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        Url url = urlRepository
                .findByShortCode(shortCode)
                .orElse(null);

        if (url == null
                || url.getUser() == null) {

            return false;
        }

        return url.getUser()
                .getId()
                .equals(user.getId());
    }
}