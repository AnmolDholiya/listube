package com.listingplatform.channel;

import com.listingplatform.product.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "listing_status",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_product_channel", columnNames = {"product_id", "channel"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "channel", nullable = false, length = 50)
    private String channel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    /**
     * In-memory batch ID association (marked @Transient since Supabase listing_status schema omits batch_id column).
     */
    @Transient
    private UUID batchId;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = Status.DRAFT;
        }
        if (channel == null) {
            channel = "FLIPKART";
        }
    }
}
