package com.trulydesignfirm.emenu.service.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.trulydesignfirm.emenu.service.QrCodeService;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class QRCodeServiceImpl implements QrCodeService {

    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 300;

    private BufferedImage generateQRCodeImage(String text) throws WriterException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }

    @Override
    public Optional<Path> saveQRCodeToFile(String text, Path directoryPath) {
        try {
            BufferedImage qrImage = generateQRCodeImage(text);
            Files.createDirectories(directoryPath);
            String fileName = UUID.randomUUID() + ".png";
            Path qrFilePath = directoryPath.resolve(fileName);
            ImageIO.write(qrImage, "PNG", qrFilePath.toFile());
            return Optional.of(qrFilePath);
        } catch (IOException | WriterException e) {
            System.out.println("Error while saving QR Code: " + e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public Optional<String> generateQRCodeBase64(String text) {
        try {
            BufferedImage qrImage = generateQRCodeImage(text);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "PNG", outputStream);
            return Optional.of(Base64.getEncoder().encodeToString(outputStream.toByteArray()));
        } catch (IOException | WriterException e) {
            System.out.println("Error: " + e.getMessage());
            return Optional.empty();
        }
    }
}