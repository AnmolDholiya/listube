package com.listingplatform.image.dto;

import com.listingplatform.image.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadResponseDto {

    private Long id;
    private String imageUrl;
    private Integer widthPx;
    private Integer heightPx;
    private Integer displayOrder;

    public static ImageUploadResponseDto fromEntity(ProductImage image) {
        return ImageUploadResponseDto.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .widthPx(image.getWidthPx())
                .heightPx(image.getHeightPx())
                .displayOrder(image.getDisplayOrder())
                .build();
    }
}
