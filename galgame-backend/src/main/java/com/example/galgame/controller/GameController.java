package com.example.galgame.controller;

import com.example.galgame.entity.Game;
import com.example.galgame.service.GameService;
import com.example.galgame.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/games")
public class GameController {
    @Autowired
    private GameService gameService;
    
    @Autowired
    private FileUploadService fileUploadService;

    @GetMapping
    public Page<Game> getGames(@RequestParam(defaultValue = "0") int page, 
                               @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return gameService.getGamesByStatus(1, pageable);
    }

    @GetMapping("/{id}")
    public Optional<Game> getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    @PostMapping
    public Game saveGame(@RequestBody Game game) {
        return gameService.saveGame(game);
    }
    
    @PostMapping("/upload")
    public Game saveGameWithCover(
            @RequestParam("title") String title,
            @RequestParam(value = "coverFile", required = false) MultipartFile coverFile,
            @RequestParam(value = "coverUrl", required = false) String coverUrl,
            @RequestParam("description") String description,
            @RequestParam("tags") String tags) throws IOException {
        
        Game game = new Game();
        game.setTitle(title);
        game.setDescription(description);
        game.setTags(tags);
        
        if (coverFile != null && !coverFile.isEmpty()) {
            String filePath = fileUploadService.uploadFile(coverFile, "covers");
            game.setCoverUrl(filePath);
        } else if (coverUrl != null && !coverUrl.isEmpty()) {
            game.setCoverUrl(coverUrl);
        }
        
        return gameService.saveGame(game);
    }

    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }
}