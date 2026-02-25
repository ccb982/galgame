package com.example.galgame.service;

import com.example.galgame.entity.Scene;
import com.example.galgame.repository.SceneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SceneService {
    @Autowired
    private SceneRepository sceneRepository;

    public Optional<Scene> getSceneByGameIdAndSceneKey(Long gameId, String sceneKey) {
        return sceneRepository.findByGameIdAndSceneKey(gameId, sceneKey);
    }

    public List<Scene> getScenesByGameId(Long gameId) {
        return sceneRepository.findByGameId(gameId);
    }

    public Scene saveScene(Scene scene) {
        return sceneRepository.save(scene);
    }

    public void deleteScene(Long id) {
        sceneRepository.deleteById(id);
    }
}