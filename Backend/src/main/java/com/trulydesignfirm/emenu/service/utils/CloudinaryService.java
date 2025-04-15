package com.trulydesignfirm.emenu.service.utils;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public String uploadFile(File file) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString();
    }

    public void deleteFile(String imageUrl) throws IOException {
        String publicId = extractPublicIdFromUrl(imageUrl);
        Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        if (result != null && result.containsKey("result") && result.get("result").equals("ok")) {
            log.info("File successfully deleted from Cloudinary: {}", publicId);
        } else {
            log.warn("Failed to delete file from Cloudinary: {}", publicId);
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        return fileName.contains(".") ? fileName.substring(0, fileName.lastIndexOf(".")) : fileName;
    }
}