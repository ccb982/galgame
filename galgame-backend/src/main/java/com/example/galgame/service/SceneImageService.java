package com.example.galgame.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class SceneImageService {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    /**
     * 上传背景图片
     */
    public String uploadBackgroundImage(MultipartFile file) throws IOException {
        return uploadSceneImage(file, "backgrounds");
    }
    
    /**
     * 上传角色图片
     */
    public String uploadCharacterImage(MultipartFile file) throws IOException {
        return uploadSceneImage(file, "characters");
    }
    
    /**
     * 上传剧本图片
     */
    private String uploadSceneImage(MultipartFile file, String imageType) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("只支持图片文件");
        }
        
        String finalUploadDir = uploadDir + "/scenes/" + imageType;
        Path uploadPath = Paths.get(finalUploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + extension;
        
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);
        
        return "/uploads/images/scenes/" + imageType + "/" + newFilename;
    }
}