package com.trulydesignfirm.emenu.service.impl;

import com.trulydesignfirm.emenu.model.ImageFile;
import com.trulydesignfirm.emenu.repository.FileRepo;
import com.trulydesignfirm.emenu.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    @Value("${file.storage.path}")
    private String storagePath;

    private final FileRepo fileRepo;

    @Override
    public ImageFile saveFile(MultipartFile file) throws IOException {
        ImageFile newFile = new ImageFile();
        String patientDirPath = storagePath + "/";
        String filePath = patientDirPath + "/" + file.getOriginalFilename();
        Path parentDir = Paths.get(patientDirPath);
        Path dest = Paths.get(filePath);
        if(Files.notExists(parentDir)) {
            Files.createDirectories(parentDir);
        }
        file.transferTo(dest);
        newFile.setFileName(file.getOriginalFilename());
        newFile.setFilePath(filePath);
        newFile.setFileSize(file.getSize());
        return fileRepo.save(newFile);
    }

    public String deleteFile(UUID fileId) throws IOException {
        ImageFile file = fileRepo.findById(fileId)
                .orElseThrow(() -> new IOException("File not found."));
        String filePath = storagePath + "/" + file.getFileName();
        Path fileToDelete = Paths.get(filePath);
        if (Files.exists(fileToDelete)) {
            Files.delete(fileToDelete);
            fileRepo.delete(file);
            return file.getFileName();
        } else {
            throw new IOException("File " + file.getFileName() + " does not exist.");
        }
    }

    @Override
    public ImageFile uploadFile(Path path) throws IOException {
        ImageFile newFile = new ImageFile();
        String patientDirPath = storagePath + "/";
        String filePath = patientDirPath + "/" + path.getFileName().toString();
        Path parentDir = Paths.get(patientDirPath);
        Path dest = Paths.get(filePath);
        if(Files.notExists(parentDir)) {
            Files.createDirectories(parentDir);
        }
        Files.copy(path, dest, StandardCopyOption.REPLACE_EXISTING);
        newFile.setFileName(path.getFileName().toString());
        newFile.setFilePath(filePath);
        newFile.setFileSize(Files.size(path));
        return fileRepo.save(newFile);
    }

}
