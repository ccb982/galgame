package com.example.galgame.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import java.util.Date;
import java.util.List;

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
    private Integer status = 1;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // 级联删除关系
    @OneToMany(mappedBy = "gameId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Scene> scenes;

    @OneToMany(mappedBy = "gameId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Save> saves;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
    
    public Long getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getCoverUrl() {
        return coverUrl;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getTags() {
        return tags;
    }
    
    public Integer getStatus() {
        return status;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}