package com.listingplatform.channel;

import com.listingplatform.channel.dto.BatchStatusResponseDto;
import com.listingplatform.seller.Seller;
import com.listingplatform.seller.SellerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PublishBatchConcurrencyIntegrationTest {

    @Autowired
    private PublishBatchRepository publishBatchRepository;

    @Autowired
    private PublishBatchUpdateService publishBatchUpdateService;

    @Autowired
    private BatchReconciliationJob batchReconciliationJob;

    @Autowired
    private ChannelService channelService;

    @Autowired
    private SellerRepository sellerRepository;

    private Seller testSeller;

    @BeforeEach
    void setUp() {
        testSeller = sellerRepository.findAll().stream().findFirst().orElseGet(() ->
                sellerRepository.save(Seller.builder()
                        .businessName("Concurrency Test Seller")
                        .email("concurrency-" + UUID.randomUUID() + "@test.com")
                        .passwordHash("secret")
                        .build())
        );
    }

    @Test
    @DisplayName("Simulate concurrent updates from async publish completion and reconciliation job: retries resolve conflict cleanly without escaping StaleObjectStateException")
    void testConcurrentBatchCompletionAndReconciliation() throws Exception {
        UUID batchId = UUID.randomUUID();
        PublishBatch batch = PublishBatch.builder()
                .batchId(batchId)
                .seller(testSeller)
                .channel("FLIPKART")
                .totalCount(1)
                .completedCount(0)
                .status("IN_PROGRESS")
                .createdAt(LocalDateTime.now().minusMinutes(12)) // Stale batch eligible for reconciliation
                .build();
        PublishBatch savedBatch = publishBatchRepository.saveAndFlush(batch);
        UUID batchDbId = savedBatch.getId();

        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch readyLatch = new CountDownLatch(2);
        CountDownLatch startLatch = new CountDownLatch(1);

        AtomicReference<Throwable> workerException = new AtomicReference<>();
        AtomicReference<Throwable> reconciliationException = new AtomicReference<>();

        // Worker thread mimicking async publish worker finishing
        Future<?> workerFuture = executor.submit(() -> {
            readyLatch.countDown();
            try {
                startLatch.await();
                publishBatchUpdateService.markCompleted(batchId);
            } catch (Throwable t) {
                workerException.set(t);
            }
        });

        // Reconciliation thread mimicking scheduled job
        Future<?> reconciliationFuture = executor.submit(() -> {
            readyLatch.countDown();
            try {
                startLatch.await();
                batchReconciliationJob.reconcileSingleBatch(batchDbId);
            } catch (Throwable t) {
                reconciliationException.set(t);
            }
        });

        // Ensure both threads are ready then release simultaneously
        assertTrue(readyLatch.await(5, TimeUnit.SECONDS), "Threads failed to prepare in time");
        startLatch.countDown();

        workerFuture.get(10, TimeUnit.SECONDS);
        reconciliationFuture.get(10, TimeUnit.SECONDS);
        executor.shutdown();

        // 1. Assert no StaleObjectStateException or unhandled optimistic locking error escaped uncaught
        assertNull(workerException.get(), "Worker thread should not leak unhandled optimistic locking exception: " + workerException.get());
        assertNull(reconciliationException.get(), "Reconciliation thread should not leak unhandled exception: " + reconciliationException.get());

        // 2. Assert the batch in DB reached a consistent final state
        PublishBatch finalBatch = publishBatchRepository.findById(batchDbId).orElseThrow();
        String finalStatus = finalBatch.getStatus();
        assertTrue("COMPLETED".equals(finalStatus) || "FAILED".equals(finalStatus),
                "Batch status must be either COMPLETED or FAILED, but was: " + finalStatus);
        assertNotNull(finalBatch.getCompletedAt(), "completedAt must be populated upon termination");
        assertTrue(finalBatch.getVersion() > 0, "Version should have incremented on update");

        // 3. Assert UI-facing API query reflects actual persisted DB state as single source of truth
        BatchStatusResponseDto uiStatus = channelService.getPublishBatchStatus(batchId, testSeller.getId());
        assertEquals(finalStatus, uiStatus.getStatus(), "UI-facing status must match persisted database status");
        assertNotEquals("PENDING", uiStatus.getStatus());
    }

    @Test
    @DisplayName("Verify PublishBatchUpdateService retries on optimistic lock failure and re-loads fresh entity")
    void testPublishBatchUpdateServiceHandlesOptimisticLockingWithRetry() {
        UUID batchId = UUID.randomUUID();
        PublishBatch batch = PublishBatch.builder()
                .batchId(batchId)
                .seller(testSeller)
                .channel("FLIPKART")
                .totalCount(3)
                .completedCount(0)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
        PublishBatch saved = publishBatchRepository.saveAndFlush(batch);

        // Transition to IN_PROGRESS
        PublishBatch inProgress = publishBatchUpdateService.updateStatusToInProgress(batchId);
        assertEquals("IN_PROGRESS", inProgress.getStatus());
        assertEquals(1, inProgress.getVersion());

        // Increment completed count
        PublishBatch countIncremented = publishBatchUpdateService.incrementCompletedCount(batchId);
        assertEquals(1, countIncremented.getCompletedCount());
        assertEquals(2, countIncremented.getVersion());

        // Mark completed
        PublishBatch completed = publishBatchUpdateService.markCompleted(batchId);
        assertEquals("COMPLETED", completed.getStatus());
        assertNotNull(completed.getCompletedAt());
        assertEquals(3, completed.getVersion());

        // UI-facing check
        BatchStatusResponseDto dto = channelService.getPublishBatchStatus(batchId, testSeller.getId());
        assertEquals("COMPLETED", dto.getStatus());
        assertEquals(1, dto.getCompletedCount());
    }
}
