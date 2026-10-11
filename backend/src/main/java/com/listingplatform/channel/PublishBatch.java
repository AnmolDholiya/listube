package com.listingplatform.channel;

import com.listingplatform.seller.Seller;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "publish_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublishBatch {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @Column(name = "channel", nullable = false, length = 50)
    private String channel;

    @Column(name = "total_items", nullable = false)
    private Integer totalItems;

    @Column(name = "completed_items", nullable = false)
    private Integer completedItems;

    @Column(name = "successful_items", nullable = false)
    private Integer successfulItems;

    @Column(name = "failed_items", nullable = false)
    private Integer failedItems;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public UUID getBatchId() {
        return this.id;
    }

    public void setBatchId(UUID batchId) {
        this.id = batchId;
    }

    public Integer getTotalCount() {
        return totalItems != null ? totalItems : 0;
    }

    public void setTotalCount(Integer totalCount) {
        this.totalItems = totalCount;
    }

    public Integer getCompletedCount() {
        return completedItems != null ? completedItems : 0;
    }

    public void setCompletedCount(Integer completedCount) {
        this.completedItems = completedCount;
    }

    public LocalDateTime getCompletedAt() {
        return updatedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.updatedAt = completedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (totalItems == null) {
            totalItems = 0;
        }
        if (completedItems == null) {
            completedItems = 0;
        }
        if (successfulItems == null) {
            successfulItems = 0;
        }
        if (failedItems == null) {
            failedItems = 0;
        }
        if (status == null) {
            status = "PENDING";
        }
        if (version == null) {
            version = 0L;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static class PublishBatchBuilder {
        public PublishBatchBuilder batchId(UUID batchId) {
            this.id = batchId;
            return this;
        }

        public PublishBatchBuilder totalCount(Integer totalCount) {
            this.totalItems = totalCount;
            return this;
        }

        public PublishBatchBuilder completedCount(Integer completedCount) {
            this.completedItems = completedCount;
            return this;
        }

        public PublishBatchBuilder completedAt(LocalDateTime completedAt) {
            this.updatedAt = completedAt;
            return this;
        }

        public PublishBatchBuilder version(Integer version) {
            this.version = version != null ? version.longValue() : 0L;
            return this;
        }

        public PublishBatchBuilder version(Long version) {
            this.version = version;
            return this;
        }
    }
}
