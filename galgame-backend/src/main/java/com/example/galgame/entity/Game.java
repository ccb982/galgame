package com.example.galgame.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "game")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "cover_url", length = 255)
    private String coverUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "tags", length = 255)
    private String tags;

    @Column(name = "status", nullable = false, columnDefinition = "TINYINT DEFAULT 1")
    private Integer status;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
}