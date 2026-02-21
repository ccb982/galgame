package com.example.galgame.service;

import com.example.galgame.entity.Save;
import com.example.galgame.repository.SaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SaveService {
    @Autowired
    private SaveRepository saveRepository;

    public List<Save> getSavesByGameIdAndUserId(Long gameId, Long userId) {
        return saveRepository.findByGameIdAndUserId(gameId, userId);
    }

    public List<Save> getSavesByGameIdAndVisitorId(Long gameId, String visitorId) {
        return saveRepository.findByGameIdAndVisitorId(gameId, visitorId);
    }

    public Save saveSave(Save save) {
        return saveRepository.save(save);
    }

    public Optional<Save> getSaveById(Long id) {
        return saveRepository.findById(id);
    }

    public void deleteSave(Long id) {
        saveRepository.deleteById(id);
    }
}