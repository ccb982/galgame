package com.example.galgame.controller;

import com.example.galgame.service.SceneImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
public class SceneImageController {
    
    @Autowired
    private SceneImageService sceneImageService;
    
    /**
     * 上传背景图片（需要 gameId，兼容旧接口）
     */
    @PostMapping("/games/{gameId}/scene-images/backgrounds")
    public ResponseEntity<Map<String, String>> uploadBackgroundWithGameId(
            @PathVariable Long gameId,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = sceneImageService.uploadBackgroundImage(file);
        return ResponseEntity.ok(Map.of(
            "gameId", String.valueOf(gameId),
            "imageUrl", imageUrl,
            "type", "background"
        ));
    }
    
    /**
     * 上传角色图片（需要 gameId，兼容旧接口）
     */
    @PostMapping("/games/{gameId}/scene-images/characters")
    public ResponseEntity<Map<String, String>> uploadCharacterWithGameId(
            @PathVariable Long gameId,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = sceneImageService.uploadCharacterImage(file);
        return ResponseEntity.ok(Map.of(
            "gameId", String.valueOf(gameId),
            "imageUrl", imageUrl,
            "type", "character"
        ));
    }
    
    /**
     * 上传背景图片（不需要 gameId）
     */
    @PostMapping("/scene-images/backgrounds")
    public ResponseEntity<Map<String, String>> uploadBackground(
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = sceneImageService.uploadBackgroundImage(file);
        return ResponseEntity.ok(Map.of(
            "imageUrl", imageUrl,
            "type", "background"
        ));
    }
    
    /**
     * 上传角色图片（不需要 gameId）
     */
    @PostMapping("/scene-images/characters")
    public ResponseEntity<Map<String, String>> uploadCharacter(
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = sceneImageService.uploadCharacterImage(file);
        return ResponseEntity.ok(Map.of(
            "imageUrl", imageUrl,
            "type", "character"
        ));
    }
}