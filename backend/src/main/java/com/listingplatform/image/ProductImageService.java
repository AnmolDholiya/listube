package com.listingplatform.image;

import com.listingplatform.image.dto.ImageUploadResponseDto;
import com.listingplatform.image.dto.ImageValidationErrorDto;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductAccessService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductAccessService productAccessService;
    private final ProductImageRepository productImageRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Getter
    private static class ValidatedFile {
        private final MultipartFile file;
        private final byte[] bytes;
        private final String extension;
        private final int widthPx;
        private final int heightPx;

        public ValidatedFile(MultipartFile file, byte[] bytes, String extension, int widthPx, int heightPx) {
            this.file = file;
            this.bytes = bytes;
            this.extension = extension;
            this.widthPx = widthPx;
            this.heightPx = heightPx;
        }
    }

    @Transactional
    public List<ImageUploadResponseDto> uploadImages(Long productId, List<MultipartFile> files, Long sellerId) {
        // Step 1: Verify product existence and seller ownership FIRST via ProductAccessService
        Product product = productAccessService.verifyOwnership(productId, sellerId);

        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one image file must be provided");
        }

        // Check image count limit (Max 8 per product)
        long existingCount = productImageRepository.countByProductId(productId);
        if (existingCount + files.size() > 8) {
            ImageValidationErrorDto limitError = new ImageValidationErrorDto(
                    "batch",
                    "Uploading " + files.size() + " image(s) would exceed the limit of 8 images per product (currently " + existingCount + " images exist)"
            );
            throw new ImageValidationException("Image upload limit exceeded", Collections.singletonList(limitError));
        }

        // Step 2: Validate ALL files in memory BEFORE writing any of them to disk
        List<ValidatedFile> validatedFiles = new ArrayList<>();
        List<ImageValidationErrorDto> validationErrors = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown";

            if (file.isEmpty()) {
                validationErrors.add(new ImageValidationErrorDto(originalFilename, "File is empty"));
                continue;
            }

            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equalsIgnoreCase("image/jpeg")
                    && !contentType.equalsIgnoreCase("image/jpg")
                    && !contentType.equalsIgnoreCase("image/png"))) {
                validationErrors.add(new ImageValidationErrorDto(originalFilename, "Declared content-type '" + contentType + "' is not supported. Only image/jpeg and image/png are allowed."));
                continue;
            }

            byte[] bytes;
            try {
                bytes = file.getBytes();
            } catch (IOException e) {
                validationErrors.add(new ImageValidationErrorDto(originalFilename, "Failed to read file input stream: " + e.getMessage()));
                continue;
            }

            // Magic bytes check
            boolean isJpeg = isJpegMagicBytes(bytes);
            boolean isPng = isPngMagicBytes(bytes);

            String extension;
            if ((contentType.equalsIgnoreCase("image/jpeg") || contentType.equalsIgnoreCase("image/jpg"))) {
                if (!isJpeg) {
                    validationErrors.add(new ImageValidationErrorDto(originalFilename, "Declared type image/jpeg does not match actual magic bytes (expected JPEG header FF D8 FF)"));
                    continue;
                }
                extension = ".jpg";
            } else if (contentType.equalsIgnoreCase("image/png")) {
                if (!isPng) {
                    validationErrors.add(new ImageValidationErrorDto(originalFilename, "Declared type image/png does not match actual magic bytes (expected PNG header 89 50 4E 47)"));
                    continue;
                }
                extension = ".png";
            } else {
                validationErrors.add(new ImageValidationErrorDto(originalFilename, "Unsupported content-type: " + contentType));
                continue;
            }

            // ImageIO width/height verification
            int width;
            int height;
            try {
                BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));
                if (image == null) {
                    validationErrors.add(new ImageValidationErrorDto(originalFilename, "Unable to decode image (corrupt or invalid image format)"));
                    continue;
                }
                width = image.getWidth();
                height = image.getHeight();
                if (width <= 0 || height <= 0) {
                    validationErrors.add(new ImageValidationErrorDto(originalFilename, "Invalid image dimensions: " + width + "x" + height));
                    continue;
                }
            } catch (Exception e) {
                validationErrors.add(new ImageValidationErrorDto(originalFilename, "Failed to parse image dimensions: " + e.getMessage()));
                continue;
            }

            validatedFiles.add(new ValidatedFile(file, bytes, extension, width, height));
        }

        // If ANY file failed validation, abort completely (WRITE NOTHING TO DISK OR DB)
        if (!validationErrors.isEmpty()) {
            throw new ImageValidationException("Image validation failed", validationErrors);
        }

        // Step 3: Write to disk and DB only after 100% validation success
        Path targetFolder = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(productId.toString());
        try {
            Files.createDirectories(targetFolder);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory for product ID " + productId + ": " + e.getMessage(), e);
        }

        List<ProductImage> savedEntities = new ArrayList<>();
        int currentDisplayOrder = (int) existingCount + 1;

        for (ValidatedFile valFile : validatedFiles) {
            String filename = UUID.randomUUID() + valFile.getExtension();
            Path filePath = targetFolder.resolve(filename);

            try {
                Files.write(filePath, valFile.getBytes());
            } catch (IOException e) {
                throw new IllegalStateException("Failed to write file " + filename + " to disk: " + e.getMessage(), e);
            }

            String imageUrl = "/images/" + productId + "/" + filename;
            ProductImage productImage = ProductImage.builder()
                    .product(product)
                    .imageUrl(imageUrl)
                    .displayOrder(currentDisplayOrder++)
                    .widthPx(valFile.getWidthPx())
                    .heightPx(valFile.getHeightPx())
                    .build();

            savedEntities.add(productImageRepository.save(productImage));
        }

        return savedEntities.stream()
                .map(ImageUploadResponseDto::fromEntity)
                .toList();
    }

    private boolean isJpegMagicBytes(byte[] bytes) {
        return bytes.length >= 3
                && (bytes[0] & 0xFF) == 0xFF
                && (bytes[1] & 0xFF) == 0xD8
                && (bytes[2] & 0xFF) == 0xFF;
    }

    private boolean isPngMagicBytes(byte[] bytes) {
        return bytes.length >= 4
                && (bytes[0] & 0xFF) == 0x89
                && (bytes[1] & 0xFF) == 0x50
                && (bytes[2] & 0xFF) == 0x4E
                && (bytes[3] & 0xFF) == 0x47;
    }
}
