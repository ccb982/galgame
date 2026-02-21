package com.example.galgame.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;

@Entity
@Table(name = "scene")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scene {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "game_id", nullable = false)
    private Long gameId;

    @Column(name = "scene_key", nullable = false, length = 50)
    private String sceneKey;

    @Column(name = "content", nullable = false, columnDefinition = "JSON")
    private String content;

    @Column(name = "next_scene", length = 50)
    private String nextScene;
}