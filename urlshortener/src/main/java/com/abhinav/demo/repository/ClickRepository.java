package com.abhinav.demo.repository;

import com.abhinav.demo.entity.Click;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClickRepository extends JpaRepository<Click, Long> {

    List<Click> findByUrl_ShortCode(String shortCode);
}