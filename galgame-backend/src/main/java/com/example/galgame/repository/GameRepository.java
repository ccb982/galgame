package com.example.galgame.repository;

import com.example.galgame.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GameRepository extends JpaRepository<Game, Long> {
    Page<Game> findByStatus(Integer status, Pageable pageable);
}