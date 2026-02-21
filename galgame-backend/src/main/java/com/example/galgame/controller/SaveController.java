package com.example.galgame.controller;

import com.example.galgame.entity.Save;
import com.example.galgame.service.SaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/saves")
public class SaveController {
    @Autowired
    private SaveService saveService;

    @GetMapping
    public List<Save> getSaves(@RequestParam(required = false) Long gameId, 
                              @RequestParam(required = false) Long userId, 
                              @RequestParam(required = false) String visitorId) {
        if (gameId != null && userId != null) {
            return saveService.getSavesByGameIdAndUserId(gameId, userId);
        } else if (gameId != null && visitorId != null) {
            return saveService.getSavesByGameIdAndVisitorId(gameId, visitorId);
        }
        return List.of();
    }

    @PostMapping
    public Save saveSave(@RequestBody Save save) {
        return saveService.saveSave(save);
    }

    @PutMapping("/{id}")
    public Save updateSave(@PathVariable Long id, @RequestBody Save save) {
        Optional<Save> existingSave = saveService.getSaveById(id);
        if (existingSave.isPresent()) {
            Save updatedSave = existingSave.get();
            updatedSave.setSceneKey(save.getSceneKey());
            updatedSave.setVariables(save.getVariables());
            updatedSave.setUpdatedAt(save.getUpdatedAt());
            return saveService.saveSave(updatedSave);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteSave(@PathVariable Long id) {
        saveService.deleteSave(id);
    }
}