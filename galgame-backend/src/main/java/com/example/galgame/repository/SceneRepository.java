package com.example.galgame.repository;

import com.example.galgame.entity.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SceneRepository extends JpaRepository<Scene, Long> {
    Optional<Scene> findByGameIdAndSceneKey(Long gameId, String sceneKey);
    List<Scene> findByGameId(Long gameId);
}