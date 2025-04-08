package com.trulydesignfirm.emenu.service;

import com.google.zxing.WriterException;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.nio.file.Path;
import java.util.Optional;

@Service
public interface QrCodeService {
    Optional<Path> saveQRCodeToFile(String text, Path directoryPath);
    Optional<String> generateQRCodeBase64(String text);
}
