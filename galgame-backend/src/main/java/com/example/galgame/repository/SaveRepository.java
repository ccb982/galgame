package com.example.galgame.repository;

import com.example.galgame.entity.Save;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SaveRepository extends JpaRepository<Save, Long> {
    List<Save> findByGameIdAndUserId(Long gameId, Long userId);
    List<Save> findByGameIdAndVisitorId(Long gameId, String visitorId);
}