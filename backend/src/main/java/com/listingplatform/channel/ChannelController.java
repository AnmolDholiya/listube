package com.listingplatform.channel;

import com.listingplatform.channel.dto.BatchStatusResponseDto;
import com.listingplatform.channel.dto.PublishBatchResponseDto;
import com.listingplatform.channel.dto.PublishRequestDto;
import com.listingplatform.channel.dto.ValidationResponseDto;
import com.listingplatform.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Tag(name = "Channel & Publish", description = "Marketplace channel extension attributes, pre-publish validation, and async batch publishing")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelService channelService;

    @Operation(summary = "Save or update marketplace-specific extension attributes (e.g. HSN, procurement type) for a product")
    @PostMapping("/{productId}/channel-fields/{channel}")
    public ResponseEntity<Map<String, String>> upsertChannelFields(
            @PathVariable("productId") Long productId,
            @PathVariable("channel") String channel,
            @RequestBody Map<String, String> fields) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        Map<String, String> updatedFields = channelService.upsertChannelFields(productId, channel, fields, sellerId);
        return ResponseEntity.ok(updatedFields);
    }

    @Operation(summary = "Evaluate listing readiness against marketplace category rules and image requirements without publishing")
    @GetMapping("/{productId}/validate/{channel}")
    public ResponseEntity<ValidationResponseDto> validateListing(
            @PathVariable("productId") Long productId,
            @PathVariable("channel") String channel) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        ValidationResponseDto validation = channelService.validateListing(productId, channel, sellerId);
        return ResponseEntity.ok(validation);
    }

    @Operation(summary = "Initiate an asynchronous batch publish job for eligible products to the specified channel")
    @PostMapping("/publish/{channel}")
    public ResponseEntity<PublishBatchResponseDto> publishProducts(
            @PathVariable("channel") String channel,
            @RequestBody PublishRequestDto request) {
        log.info("[CONTROLLER] publishProducts received request on thread: '{}' for channel: {}", Thread.currentThread().getName(), channel);
        Long sellerId = SecurityUtils.getCurrentSellerId();
        List<Long> productIds = request != null ? request.getProductIds() : List.of();
        PublishBatchResponseDto response = channelService.publishProducts(channel, productIds, sellerId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Re-runs pre-publish validation and re-dispatches to async publish pipeline if valid")
    @PostMapping("/{id}/channels/{channel}/retry-publish")
    public ResponseEntity<PublishBatchResponseDto> retryPublish(
            @PathVariable("id") Long id,
            @PathVariable("channel") String channel) {
        log.info("[CONTROLLER] retryPublish received for product {} and channel {}", id, channel);
        Long sellerId = SecurityUtils.getCurrentSellerId();
        PublishBatchResponseDto response = channelService.retryPublish(id, channel, sellerId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Poll the live progress, completion status, and per-item listing outcomes of an asynchronous publish batch")
    @GetMapping("/publish-status/{batchId}")
    public ResponseEntity<BatchStatusResponseDto> getPublishBatchStatus(
            @PathVariable("batchId") UUID batchId) {
        log.info("[CONTROLLER] getPublishBatchStatus received request on thread: '{}' for batchId: {}", Thread.currentThread().getName(), batchId);
        Long sellerId = SecurityUtils.getCurrentSellerId();
        BatchStatusResponseDto status = channelService.getPublishBatchStatus(batchId, sellerId);
        return ResponseEntity.ok(status);
    }

    @Operation(summary = "Get multi-channel sync status across Flipkart and Amazon for visual proof demo")
    @GetMapping("/{productId}/channel-sync-status")
    public ResponseEntity<Map<String, Object>> getChannelSyncStatus(
            @PathVariable("productId") Long productId) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        Map<String, Object> syncStatus = channelService.getChannelSyncStatus(productId, sellerId);
        return ResponseEntity.ok(syncStatus);
    }

    @Operation(summary = "Set mock status for a channel (e.g. mark AMAZON as PUBLISHED) to setup multi-channel demo")
    @PostMapping("/{productId}/publish-mock/{channel}")
    public ResponseEntity<Map<String, Object>> setMockChannelStatus(
            @PathVariable("productId") Long productId,
            @PathVariable("channel") String channel) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        Map<String, Object> updatedStatus = channelService.setMockChannelStatus(productId, channel, Status.PUBLISHED, sellerId);
        return ResponseEntity.ok(updatedStatus);
    }
}
