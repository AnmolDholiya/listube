package com.listingplatform.channel;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class BatchReconciliationJob {

    private final PublishBatchRepository publishBatchRepository;

    @Scheduled(fixedRate = 60000)
    public void reconcileStaleBatches() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(10);
        List<PublishBatch> staleBatches = publishBatchRepository.findStaleBatches(cutoff);

        if (staleBatches.isEmpty()) {
            log.debug("[RECONCILIATION] No stale publish batches found.");
            return;
        }

        log.info("[RECONCILIATION] Found {} potentially stale publish batches. Evaluating with optimistic locking...", staleBatches.size());

        for (PublishBatch candidate : staleBatches) {
            reconcileSingleBatch(candidate.getId());
        }
    }

    public void reconcileSingleBatch(UUID batchDbId) {
        try {
            executeReconciliationInNewTransaction(batchDbId);
        } catch (OptimisticLockException | ObjectOptimisticLockingFailureException | UnexpectedRollbackException e) {
            log.info("[RECONCILIATION] Optimistic lock conflict on batch DB ID {}: worker completed concurrently, backed off cleanly.", batchDbId);
        } catch (Exception e) {
            log.error("[RECONCILIATION] Unexpected error while reconciling batch DB ID {}: {}", batchDbId, e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void executeReconciliationInNewTransaction(UUID batchDbId) {
        // 1. Reload the entity fresh from DB in a new transaction
        PublishBatch batch = publishBatchRepository.findById(batchDbId).orElse(null);
        if (batch == null) {
            log.warn("[RECONCILIATION] Batch with DB ID {} no longer exists, skipping.", batchDbId);
            return;
        }

        // 2. Check if the worker already finished while we were scanning
        if (!"PENDING".equalsIgnoreCase(batch.getStatus()) && !"IN_PROGRESS".equalsIgnoreCase(batch.getStatus())) {
            log.info("[RECONCILIATION] Batch {} (ID: {}) backed off: status is already '{}' (completed concurrently by async worker).",
                    batch.getBatchId(), batch.getId(), batch.getStatus());
            return;
        }

        // 3. Mark as FAILED through JPA managed entity to trigger optimistic @Version check
        batch.setStatus("FAILED");
        batch.setErrorMessage("Batch did not complete within expected window — possible worker failure");
        batch.setCompletedAt(LocalDateTime.now());

        publishBatchRepository.saveAndFlush(batch);

        log.warn("[RECONCILIATION] Stale batch {} (ID: {}) marked as FAILED due to timeout (created at: {}, version: {}).",
                batch.getBatchId(), batch.getId(), batch.getCreatedAt(), batch.getVersion());
    }
}
