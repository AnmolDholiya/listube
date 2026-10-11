package com.listingplatform.product;

import com.listingplatform.category.Category;
import com.listingplatform.seller.Seller;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "products",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_seller_sku", columnNames = {"seller_id", "sku"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE})
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "brand", length = 255)
    private String brand;

    @Column(name = "mrp", nullable = false, precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(name = "selling_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "length_cm", precision = 6, scale = 2)
    private BigDecimal lengthCm;

    @Column(name = "breadth_cm", precision = 6, scale = 2)
    private BigDecimal breadthCm;

    @Column(name = "height_cm", precision = 6, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "weight_kg", precision = 6, scale = 3)
    private BigDecimal weightKg;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }

    public void setCategoryName(String categoryName) {
        if (categoryName != null) {
            this.category = Category.builder().name(categoryName).build();
        }
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (stock == null) {
            stock = 0;
        }
        if (version == null) {
            version = 0L;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static class ProductBuilder {
        public ProductBuilder category(String categoryName) {
            if (categoryName != null) {
                this.category = Category.builder().name(categoryName).build();
            }
            return this;
        }

        public ProductBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public ProductBuilder version(Integer version) {
            this.version = version != null ? version.longValue() : 0L;
            return this;
        }

        public ProductBuilder version(Long version) {
            this.version = version;
            return this;
        }
    }
}
