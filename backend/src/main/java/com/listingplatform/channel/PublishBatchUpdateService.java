package com.listingplatform.channel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PublishBatchUpdateService {

    private final PublishBatchRepository publishBatchRepository;

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PublishBatch updateStatusToInProgress(UUID batchId) {
        log.debug("[BATCH-UPDATE] Setting status to IN_PROGRESS for batch: {}", batchId);
        PublishBatch batch = publishBatchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new IllegalStateException("PublishBatch not found for batchId: " + batchId));
        batch.setStatus("IN_PROGRESS");
        batch.setUpdatedAt(LocalDateTime.now());
        return publishBatchRepository.saveAndFlush(batch);
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PublishBatch incrementCompletedCount(UUID batchId) {
        return incrementCompletedCount(batchId, true);
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PublishBatch incrementCompletedCount(UUID batchId, boolean success) {
        log.debug("[BATCH-UPDATE] Incrementing completed count for batch: {} (success={})", batchId, success);
        PublishBatch batch = publishBatchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new IllegalStateException("PublishBatch not found for batchId: " + batchId));

        int completed = batch.getCompletedItems() != null ? batch.getCompletedItems() : 0;
        batch.setCompletedItems(completed + 1);

        if (success) {
            int succ = batch.getSuccessfulItems() != null ? batch.getSuccessfulItems() : 0;
            batch.setSuccessfulItems(succ + 1);
        } else {
            int fail = batch.getFailedItems() != null ? batch.getFailedItems() : 0;
            batch.setFailedItems(fail + 1);
        }

        batch.setUpdatedAt(LocalDateTime.now());
        return publishBatchRepository.saveAndFlush(batch);
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PublishBatch markCompleted(UUID batchId) {
        log.debug("[BATCH-UPDATE] Marking batch COMPLETED for batch: {}", batchId);
        PublishBatch batch = publishBatchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new IllegalStateException("PublishBatch not found for batchId: " + batchId));
        batch.setStatus("COMPLETED");
        batch.setUpdatedAt(LocalDateTime.now());
        return publishBatchRepository.saveAndFlush(batch);
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PublishBatch markFailed(UUID batchId, String errorMessage) {
        log.debug("[BATCH-UPDATE] Marking batch FAILED for batch: {}", batchId);
        PublishBatch batch = publishBatchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new IllegalStateException("PublishBatch not found for batchId: " + batchId));
        batch.setStatus("FAILED");
        batch.setErrorMessage(errorMessage);
        batch.setUpdatedAt(LocalDateTime.now());
        return publishBatchRepository.saveAndFlush(batch);
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PublishBatch markCompletedByDbId(UUID id) {
        log.debug("[BATCH-UPDATE] Marking batch COMPLETED for id: {}", id);
        PublishBatch batch = publishBatchRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("PublishBatch not found for id: " + id));
        batch.setStatus("COMPLETED");
        batch.setUpdatedAt(LocalDateTime.now());
        return publishBatchRepository.saveAndFlush(batch);
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PublishBatch markFailedByDbId(UUID id, String errorMessage) {
        log.debug("[BATCH-UPDATE] Marking batch FAILED for id: {}", id);
        PublishBatch batch = publishBatchRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("PublishBatch not found for id: " + id));
        batch.setStatus("FAILED");
        batch.setErrorMessage(errorMessage);
        batch.setUpdatedAt(LocalDateTime.now());
        return publishBatchRepository.saveAndFlush(batch);
    }
}
