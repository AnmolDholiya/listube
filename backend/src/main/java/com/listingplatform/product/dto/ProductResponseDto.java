package com.listingplatform.product.dto;

import com.listingplatform.product.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {

    private Long id;
    private Long sellerId;
    private String sku;
    private String title;
    private String description;
    private String category;
    private String brand;
    private BigDecimal mrp;
    private BigDecimal sellingPrice;
    private Integer stock;
    private BigDecimal lengthCm;
    private BigDecimal breadthCm;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private Long version;
    private String status;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductResponseDto fromEntity(Product product) {
        return fromEntity(product, "DRAFT", null);
    }

    public static ProductResponseDto fromEntity(Product product, String status) {
        return fromEntity(product, status, null);
    }

    public static ProductResponseDto fromEntity(Product product, String status, String errorMessage) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
                .sku(product.getSku())
                .title(product.getTitle())
                .description(product.getDescription())
                .category(product.getCategoryName())
                .brand(product.getBrand())
                .mrp(product.getMrp())
                .sellingPrice(product.getSellingPrice())
                .stock(product.getStock())
                .lengthCm(product.getLengthCm())
                .breadthCm(product.getBreadthCm())
                .heightCm(product.getHeightCm())
                .weightKg(product.getWeightKg())
                .version(product.getVersion())
                .status(status != null ? status : "DRAFT")
                .errorMessage(errorMessage)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
