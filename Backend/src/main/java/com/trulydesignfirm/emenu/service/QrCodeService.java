package com.trulydesignfirm.emenu.service;

import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.Optional;

@Service
public interface QrCodeService {
    Optional<Path> saveQRCodeToFile(String text, Path directoryPath);
}
