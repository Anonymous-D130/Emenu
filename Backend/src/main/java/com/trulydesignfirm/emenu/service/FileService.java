package com.trulydesignfirm.emenu.service;

import com.trulydesignfirm.emenu.model.ImageFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.UUID;

@Service
public interface FileService {
    ImageFile saveFile(MultipartFile file) throws IOException;
    String deleteFile(UUID fileId) throws IOException;
    ImageFile uploadFile(Path path) throws IOException;
}
