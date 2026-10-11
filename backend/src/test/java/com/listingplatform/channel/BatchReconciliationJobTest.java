package com.listingplatform.channel;

import jakarta.persistence.OptimisticLockException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BatchReconciliationJobTest {

    @Mock
    private PublishBatchRepository publishBatchRepository;

    @InjectMocks
    private BatchReconciliationJob reconciliationJob;

    private UUID batchId;
    private PublishBatch staleBatch;

    @BeforeEach
    void setUp() {
        batchId = UUID.randomUUID();
        staleBatch = PublishBatch.builder()
                .id(batchId)
                .batchId(batchId)
                .channel("FLIPKART")
                .totalCount(3)
                .completedCount(1)
                .status("IN_PROGRESS")
                .version(0)
                .createdAt(LocalDateTime.now().minusMinutes(15))
                .build();
    }

    @Test
    void testReconcileStaleBatchesMarksStaleAsFailed() {
        when(publishBatchRepository.findStaleBatches(any(LocalDateTime.class))).thenReturn(List.of(staleBatch));
        when(publishBatchRepository.findById(batchId)).thenReturn(Optional.of(staleBatch));

        reconciliationJob.reconcileStaleBatches();

        verify(publishBatchRepository, times(1)).saveAndFlush(staleBatch);
        assertEquals("FAILED", staleBatch.getStatus());
        assertEquals("Batch did not complete within expected window — possible worker failure", staleBatch.getErrorMessage());
        assertNotNull(staleBatch.getCompletedAt());
    }

    @Test
    void testReconciliationBacksOffWhenBatchCompletedConcurrently() {
        staleBatch.setStatus("COMPLETED");
        when(publishBatchRepository.findStaleBatches(any(LocalDateTime.class))).thenReturn(List.of(staleBatch));
        when(publishBatchRepository.findById(batchId)).thenReturn(Optional.of(staleBatch));

        reconciliationJob.reconcileStaleBatches();

        verify(publishBatchRepository, never()).saveAndFlush(staleBatch);
        assertEquals("COMPLETED", staleBatch.getStatus());
    }

    @Test
    void testReconciliationHandlesOptimisticLockExceptionCleanly() {
        when(publishBatchRepository.findStaleBatches(any(LocalDateTime.class))).thenReturn(List.of(staleBatch));
        when(publishBatchRepository.findById(batchId)).thenReturn(Optional.of(staleBatch));
        when(publishBatchRepository.saveAndFlush(any(PublishBatch.class))).thenThrow(new OptimisticLockException("Row modified by worker"));

        assertDoesNotThrow(() -> reconciliationJob.reconcileStaleBatches());
    }
}
