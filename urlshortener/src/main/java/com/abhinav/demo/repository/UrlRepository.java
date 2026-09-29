package com.abhinav.demo.repository;

import com.abhinav.demo.entity.Url;
import com.abhinav.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    List<Url> findByUser(User user);
}