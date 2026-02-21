package com.example.galgame.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "save")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Save {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "visitor_id", length = 36)
    private String visitorId;

    @Column(name = "game_id", nullable = false)
    private Long gameId;

    @Column(name = "scene_key", nullable = false, length = 50)
    private String sceneKey;

    @Column(name = "variables", columnDefinition = "JSON")
    private String variables;

    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}