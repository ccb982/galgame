package com.example.galgame.controller;

import com.example.galgame.service.SceneImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/games/{gameId}/scene-images")
public class SceneImageController {
    
    @Autowired
    private SceneImageService sceneImageService;
    
    /**
     * 上传背景图片
     */
    @PostMapping("/backgrounds")
    public ResponseEntity<Map<String, String>> uploadBackground(
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
     * 上传角色图片
     */
    @PostMapping("/characters")
    public ResponseEntity<Map<String, String>> uploadCharacter(
            @PathVariable Long gameId,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = sceneImageService.uploadCharacterImage(file);
        return ResponseEntity.ok(Map.of(
            "gameId", String.valueOf(gameId),
            "imageUrl", imageUrl,
            "type", "character"
        ));
    }
}