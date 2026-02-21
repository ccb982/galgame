package com.example.galgame.controller;

import com.example.galgame.entity.Game;
import com.example.galgame.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@RestController
@RequestMapping("/games")
public class GameController {
    @Autowired
    private GameService gameService;

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

    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }
}