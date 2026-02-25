package com.example.galgame.controller;

import com.example.galgame.entity.Scene;
import com.example.galgame.service.SceneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/games/{gameId}/scenes")
public class SceneController {
    @Autowired
    private SceneService sceneService;

    @GetMapping
    public List<Scene> getScenesByGameId(@PathVariable Long gameId) {
        return sceneService.getScenesByGameId(gameId);
    }

    @GetMapping("/{sceneKey}")
    public Optional<Scene> getScene(@PathVariable Long gameId, @PathVariable String sceneKey) {
        return sceneService.getSceneByGameIdAndSceneKey(gameId, sceneKey);
    }

    @PostMapping
    public Scene saveScene(@PathVariable Long gameId, @RequestBody Scene scene) {
        scene.setGameId(gameId);
        return sceneService.saveScene(scene);
    }

    @DeleteMapping("/{id}")
    public void deleteScene(@PathVariable Long id) {
        sceneService.deleteScene(id);
    }
}