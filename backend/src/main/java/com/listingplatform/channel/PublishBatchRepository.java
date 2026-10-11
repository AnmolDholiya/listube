package com.listingplatform.channel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PublishBatchRepository extends JpaRepository<PublishBatch, UUID> {

    default Optional<PublishBatch> findByBatchId(UUID batchId) {
        return findById(batchId);
    }

    @Query("SELECT b FROM PublishBatch b WHERE b.status IN ('PENDING', 'IN_PROGRESS') AND b.createdAt < :cutoff")
    List<PublishBatch> findStaleBatches(@Param("cutoff") LocalDateTime cutoff);
}
