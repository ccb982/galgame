package com.example.galgame.service;

import com.example.galgame.entity.Game;
import com.example.galgame.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
@Transactional
public class GameService {
    @Autowired
    private GameRepository gameRepository;

    public Page<Game> getGamesByStatus(Integer status, Pageable pageable) {
        return gameRepository.findByStatus(status, pageable);
    }

    public Optional<Game> getGameById(Long id) {
        return gameRepository.findById(id);
    }

    public Game saveGame(Game game) {
        if (game.getStatus() == null) {
            game.setStatus(1);
        }
        return gameRepository.save(game);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}