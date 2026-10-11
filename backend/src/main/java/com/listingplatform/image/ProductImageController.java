package com.listingplatform.image;

import com.listingplatform.common.SecurityUtils;
import com.listingplatform.image.dto.ImageUploadResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Images", description = "Product image upload and in-memory dimension/magic-byte validation")
@RestController
@RequestMapping("/api/products/{productId}/images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

    @Operation(summary = "Validate image magic bytes, minimum 500x500px resolution, and store product catalog images")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ImageUploadResponseDto>> uploadImages(
            @PathVariable("productId") Long productId,
            @RequestParam("images") List<MultipartFile> images) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        List<ImageUploadResponseDto> response = productImageService.uploadImages(productId, images, sellerId);
        return ResponseEntity.ok(response);
    }
}
