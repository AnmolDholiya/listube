package com.listingplatform.channel;

import com.listingplatform.channel.flipkart.FlipkartAdapter;
import com.listingplatform.channel.flipkart.PublishResult;
import com.listingplatform.product.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncPublishService {

    private final FlipkartAdapter flipkartAdapter;
    private final ListingStatusRepository listingStatusRepository;
    private final PublishBatchRepository publishBatchRepository;
    private final PublishBatchUpdateService publishBatchUpdateService;

    @Async("publishExecutor")
    public void processBatch(UUID batchId, List<Product> validProducts,
                             List<Product> invalidProducts, String channel) {
        log.info("[ASYNC-PUBLISH] processBatch started on thread: '{}' for batchId: {}", Thread.currentThread().getName(), batchId);
        try {
            publishBatchUpdateService.updateStatusToInProgress(batchId);

            // Process invalid products
            if (invalidProducts != null) {
                for (Product product : invalidProducts) {
                    upsertListingStatus(product, channel, Status.REJECTED, "Listing validation failed before publish", batchId);
                    publishBatchUpdateService.incrementCompletedCount(batchId);
                }
            }

            // Process valid products with FlipkartAdapter
            if (validProducts != null && !validProducts.isEmpty()) {
                Map<String, PublishResult> publishMap = flipkartAdapter.publishListings(validProducts);

                for (Product product : validProducts) {
                    PublishResult pubRes = publishMap.get(product.getSku());
                    String statusStr = (pubRes != null && pubRes.getStatus() != null) ? pubRes.getStatus() : "REJECTED";
                    String errorMsg = pubRes != null ? pubRes.getErrorMessage() : "No response from channel mock service";

                    Status finalStatus = "PUBLISHED".equalsIgnoreCase(statusStr) ? Status.PUBLISHED : Status.REJECTED;

                    upsertListingStatus(product, channel, finalStatus, errorMsg, batchId);
                    publishBatchUpdateService.incrementCompletedCount(batchId);
                }
            }

            // Full completion
            publishBatchUpdateService.markCompleted(batchId);
            log.info("[ASYNC-PUBLISH] processBatch successfully completed on thread: '{}' for batchId: {}", Thread.currentThread().getName(), batchId);

        } catch (Exception e) {
            log.error("[ASYNC-PUBLISH] processBatch failed on thread: '{}' for batchId: {}. Error: {}", Thread.currentThread().getName(), batchId, e.getMessage(), e);
            try {
                publishBatchUpdateService.markFailed(batchId, e.getMessage());
            } catch (Exception dbEx) {
                log.error("[ASYNC-PUBLISH] Failed to update PublishBatch status to FAILED for batchId: {}", batchId, dbEx);
            }

            // Ensure ListingStatus is not left as PUBLISHED when the batch genuinely failed
            if (validProducts != null) {
                for (Product product : validProducts) {
                    try {
                        upsertListingStatus(product, channel, Status.REJECTED, "Batch failed: " + e.getMessage(), batchId);
                    } catch (Exception statusEx) {
                        log.error("[ASYNC-PUBLISH] Failed to reset listing status for product {} after batch failure: {}", product.getId(), statusEx.getMessage());
                    }
                }
            }
        }
    }

    private void upsertListingStatus(Product product, String channel, Status status, String errorMessage, UUID batchId) {
        Optional<ListingStatus> statusOpt = listingStatusRepository.findByProductIdAndChannel(product.getId(), channel);
        ListingStatus listingStatus = statusOpt.orElseGet(() -> ListingStatus.builder()
                .product(product)
                .channel(channel)
                .build());

        listingStatus.setStatus(status);
        listingStatus.setErrorMessage(errorMessage);
        listingStatus.setBatchId(batchId);
        listingStatus.setLastSyncedAt(LocalDateTime.now());
        listingStatusRepository.save(listingStatus);
    }
}
