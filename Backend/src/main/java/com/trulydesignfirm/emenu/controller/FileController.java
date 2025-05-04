package com.trulydesignfirm.emenu.controller;

import com.trulydesignfirm.emenu.repository.FileRepo;
import com.trulydesignfirm.emenu.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final FileRepo fileRepo;

    @Value("${backend_url}")
    private String baseUrl;


    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return baseUrl+"/api/files/get-image/"+fileService.saveFile(file).getId();
    }

    @GetMapping("/get-image/{imageId}")
    public ResponseEntity<Resource> getImage(@PathVariable UUID imageId) throws IOException {
        String filePath = fileRepo.findById(imageId)
                .orElseThrow(() -> new IOException("Required ImageFile Not Found"))
                .getFilePath();
        Path path = Path.of(filePath);
        Resource resource = new FileSystemResource(path);
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = Files.probeContentType(path);
        if (contentType == null || !contentType.startsWith("image/")) {
            contentType = "image/jpeg";
        }
        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType));
        return responseBuilder.body(resource);
    }

}