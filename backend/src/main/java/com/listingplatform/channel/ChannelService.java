package com.listingplatform.channel;

import com.listingplatform.channel.dto.BatchListingResultDto;
import com.listingplatform.channel.dto.BatchStatusResponseDto;
import com.listingplatform.channel.dto.ImageIssueDto;
import com.listingplatform.channel.dto.PublishBatchResponseDto;
import com.listingplatform.channel.dto.SkippedProductDto;
import com.listingplatform.channel.dto.ValidationResponseDto;
import com.listingplatform.image.ProductImage;
import com.listingplatform.image.ProductImageRepository;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductAccessDeniedException;
import com.listingplatform.product.ProductAccessService;
import com.listingplatform.product.ProductChannelExtension;
import com.listingplatform.product.ProductChannelExtensionRepository;
import com.listingplatform.product.ProductNotFoundException;
import com.listingplatform.seller.Seller;
import com.listingplatform.seller.SellerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChannelService {

    private final ProductAccessService productAccessService;
    private final ProductChannelExtensionRepository extensionRepository;
    private final ChannelRequiredFieldRepository channelRequiredFieldRepository;
    private final ProductImageRepository productImageRepository;
    private final ListingStatusRepository listingStatusRepository;
    private final PublishBatchRepository publishBatchRepository;
    private final SellerRepository sellerRepository;
    private final AsyncPublishService asyncPublishService;
    private final com.listingplatform.channel.amazon.AmazonAdapter amazonAdapter;

    public String normalizeAndValidateChannel(String channelStr) {
        if (channelStr == null || !channelStr.trim().equalsIgnoreCase("FLIPKART")) {
            throw new IllegalArgumentException("Unsupported channel: '" + channelStr + "'. Only 'FLIPKART' is supported in this prototype.");
        }
        return "FLIPKART";
    }

    @Transactional
    public Map<String, String> upsertChannelFields(Long productId, String channelStr, Map<String, String> fields, Long sellerId) {
        Product product = productAccessService.verifyOwnership(productId, sellerId);
        String channel = normalizeAndValidateChannel(channelStr);

        if (fields == null || fields.isEmpty()) {
            throw new IllegalArgumentException("Channel fields payload cannot be empty");
        }

        for (Map.Entry<String, String> entry : fields.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (!StringUtils.hasText(key)) {
                continue;
            }
            key = key.trim();
            String cleanVal = value != null ? value.trim() : "";

            Optional<ProductChannelExtension> extOpt = extensionRepository.findByProductIdAndChannelAndFieldKey(productId, channel, key);
            if (extOpt.isPresent()) {
                ProductChannelExtension ext = extOpt.get();
                ext.setFieldValue(cleanVal);
                extensionRepository.save(ext);
            } else {
                ProductChannelExtension newExt = ProductChannelExtension.builder()
                        .product(product)
                        .channel(channel)
                        .fieldKey(key)
                        .fieldValue(cleanVal)
                        .build();
                extensionRepository.save(newExt);
            }
        }

        List<ProductChannelExtension> currentExtensions = extensionRepository.findByProductIdAndChannel(productId, channel);
        return currentExtensions.stream()
                .collect(Collectors.toMap(
                        ProductChannelExtension::getFieldKey,
                        ProductChannelExtension::getFieldValue,
                        (v1, v2) -> v2
                ));
    }

    @Transactional
    public ValidationResponseDto validateListing(Long productId, String channelStr, Long sellerId) {
        Product product = productAccessService.verifyOwnership(productId, sellerId);
        String channel = normalizeAndValidateChannel(channelStr);

        // Required fields lookup
        List<ChannelRequiredField> requiredFields = channelRequiredFieldRepository.findByChannelAndCategory(channel, product.getCategoryName());
        boolean categoryConfigured = !requiredFields.isEmpty();

        // Product extension fields lookup
        List<ProductChannelExtension> extensions = extensionRepository.findByProductIdAndChannel(productId, channel);
        Map<String, String> extensionMap = extensions.stream()
                .collect(Collectors.toMap(
                        ProductChannelExtension::getFieldKey,
                        ProductChannelExtension::getFieldValue,
                        (v1, v2) -> v2
                ));

        List<String> missingFields = new ArrayList<>();
        if (categoryConfigured) {
            for (ChannelRequiredField req : requiredFields) {
                String val = extensionMap.get(req.getRequiredField());
                if (!StringUtils.hasText(val)) {
                    missingFields.add(req.getRequiredField());
                }
            }
        }

        // Product images lookup and validation
        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(productId);
        List<ImageIssueDto> imageIssues = new ArrayList<>();

        if (images.size() < 2) {
            imageIssues.add(new ImageIssueDto(null, null, "At least 2 product images are required (found " + images.size() + ")"));
        }

        for (ProductImage img : images) {
            if (img.getWidthPx() != null && img.getHeightPx() != null) {
                boolean widthOk = img.getWidthPx() >= 500;
                boolean heightOk = img.getHeightPx() >= 500;
                if (!widthOk || !heightOk) {
                    String reason = "Image dimensions (" + img.getWidthPx() + "px x " + img.getHeightPx() + "px) do not meet the minimum required 500x500px";
                    imageIssues.add(new ImageIssueDto(img.getId(), img.getImageUrl(), reason));
                }
            }
        }

        boolean valid = categoryConfigured && missingFields.isEmpty() && imageIssues.isEmpty();

        // Update listing_status table
        updateListingStatus(product, channel, valid ? Status.VALIDATED : Status.DRAFT, buildValidationSummary(categoryConfigured, product.getCategoryName(), channel, missingFields, imageIssues));

        return ValidationResponseDto.builder()
                .valid(valid)
                .categoryConfigured(categoryConfigured)
                .missingFields(missingFields)
                .imageIssues(imageIssues)
                .build();
    }

    @Transactional
    public PublishBatchResponseDto publishProducts(String channelStr, List<Long> productIds, Long sellerId) {
        String channel = normalizeAndValidateChannel(channelStr);

        List<SkippedProductDto> skipped = new ArrayList<>();
        List<Product> ownedProducts = new ArrayList<>();

        if (productIds == null || productIds.isEmpty()) {
            return PublishBatchResponseDto.builder()
                    .batchId(null)
                    .status("COMPLETED")
                    .totalCount(0)
                    .skipped(skipped)
                    .build();
        }

        // 1. Ownership filtering
        for (Long productId : productIds) {
            try {
                Product product = productAccessService.verifyOwnership(productId, sellerId);
                ownedProducts.add(product);
            } catch (ProductNotFoundException | ProductAccessDeniedException e) {
                skipped.add(new SkippedProductDto(productId, "not owned"));
            }
        }

        if (ownedProducts.isEmpty()) {
            return PublishBatchResponseDto.builder()
                    .batchId(null)
                    .status("COMPLETED")
                    .totalCount(0)
                    .skipped(skipped)
                    .build();
        }

        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found: " + sellerId));

        List<Product> validProducts = new ArrayList<>();
        List<Product> invalidProducts = new ArrayList<>();

        // 2. Validation step
        for (Product product : ownedProducts) {
            ValidationResponseDto valDto = validateListing(product.getId(), channel, sellerId);
            if (!valDto.isValid()) {
                invalidProducts.add(product);
            } else {
                validProducts.add(product);
            }
        }

        int totalCount = validProducts.size() + invalidProducts.size();
        UUID batchId = UUID.randomUUID();

        // 3. Create PublishBatch row
        PublishBatch batch = PublishBatch.builder()
                .batchId(batchId)
                .seller(seller)
                .channel(channel)
                .totalCount(totalCount)
                .completedCount(0)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
        publishBatchRepository.save(batch);

        // 4. Trigger async publish processing via separate AsyncPublishService bean
        asyncPublishService.processBatch(batchId, validProducts, invalidProducts, channel);

        // 5. Return immediately
        return PublishBatchResponseDto.builder()
                .batchId(batchId)
                .status("PENDING")
                .totalCount(totalCount)
                .skipped(skipped)
                .build();
    }

    @Transactional
    public PublishBatchResponseDto retryPublish(Long productId, String channelStr, Long sellerId) {
        String channel = normalizeAndValidateChannel(channelStr);
        Product product = productAccessService.verifyOwnership(productId, sellerId);

        // 1. Re-run pre-publish validation
        ValidationResponseDto valDto = validateListing(productId, channel, sellerId);
        if (!valDto.isValid()) {
            String validationMsg = buildValidationErrorMessage(valDto);
            updateListingStatus(product, channel, Status.REJECTED, "Listing validation failed before publish: " + validationMsg);
            throw new IllegalArgumentException("Cannot retry publish: Pre-publish validation failed. " + validationMsg);
        }

        // 2. If valid, re-dispatches through the existing AsyncPublishService path exactly as a fresh publish would
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found: " + sellerId));

        UUID batchId = UUID.randomUUID();
        PublishBatch batch = PublishBatch.builder()
                .batchId(batchId)
                .seller(seller)
                .channel(channel)
                .totalCount(1)
                .completedCount(0)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
        publishBatchRepository.save(batch);

        asyncPublishService.processBatch(batchId, List.of(product), List.of(), channel);

        return PublishBatchResponseDto.builder()
                .batchId(batchId)
                .status("PENDING")
                .totalCount(1)
                .skipped(List.of())
                .build();
    }

    @Transactional(readOnly = true)
    public BatchStatusResponseDto getPublishBatchStatus(UUID batchId, Long sellerId) {
        PublishBatch batch = publishBatchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new ProductNotFoundException("Batch not found with ID: " + batchId));

        if (!batch.getSeller().getId().equals(sellerId)) {
            throw new ProductAccessDeniedException("You do not have permission to view batch: " + batchId);
        }

        List<ListingStatus> listingStatuses = listingStatusRepository.findByBatchId(batchId);
        List<BatchListingResultDto> results = listingStatuses.stream()
                .map(ls -> BatchListingResultDto.builder()
                        .productId(ls.getProduct() != null ? ls.getProduct().getId() : null)
                        .sku(ls.getProduct() != null ? ls.getProduct().getSku() : null)
                        .channel(ls.getChannel())
                        .status(ls.getStatus() != null ? ls.getStatus().name() : null)
                        .errorMessage(ls.getErrorMessage())
                        .lastSyncedAt(ls.getLastSyncedAt())
                        .build())
                .toList();

        return BatchStatusResponseDto.builder()
                .batchId(batch.getBatchId())
                .status(batch.getStatus())
                .totalCount(batch.getTotalCount())
                .completedCount(batch.getCompletedCount())
                .errorMessage(batch.getErrorMessage())
                .createdAt(batch.getCreatedAt())
                .completedAt(batch.getCompletedAt())
                .results(results)
                .build();
    }

    private void updateListingStatus(Product product, String channel, Status status, String errorMessage) {
        Optional<ListingStatus> statusOpt = listingStatusRepository.findByProductIdAndChannel(product.getId(), channel);
        ListingStatus listingStatus = statusOpt.orElseGet(() -> ListingStatus.builder()
                .product(product)
                .channel(channel)
                .build());

        listingStatus.setStatus(status);
        listingStatus.setErrorMessage(errorMessage);
        listingStatus.setLastSyncedAt(LocalDateTime.now());
        listingStatusRepository.save(listingStatus);
    }

    private String buildValidationSummary(boolean categoryConfigured, String category, String channel, List<String> missingFields, List<ImageIssueDto> imageIssues) {
        if (categoryConfigured && missingFields.isEmpty() && imageIssues.isEmpty()) {
            return null;
        }
        List<String> parts = new ArrayList<>();
        if (!categoryConfigured) {
            parts.add("Category '" + category + "' not configured for channel " + channel);
        }
        if (!missingFields.isEmpty()) {
            parts.add("Missing required fields: " + missingFields);
        }
        if (!imageIssues.isEmpty()) {
            parts.add("Image issues: " + imageIssues.size());
        }
        return String.join("; ", parts);
    }

    private String buildValidationErrorMessage(ValidationResponseDto valDto) {
        if (valDto == null) {
            return "Unknown validation failure";
        }
        List<String> parts = new ArrayList<>();
        if (!valDto.isCategoryConfigured()) {
            parts.add("Category is not configured for this marketplace");
        }
        if (valDto.getMissingFields() != null && !valDto.getMissingFields().isEmpty()) {
            parts.add("Missing required fields: " + String.join(", ", valDto.getMissingFields()));
        }
        if (valDto.getImageIssues() != null && !valDto.getImageIssues().isEmpty()) {
            List<String> issues = valDto.getImageIssues().stream()
                    .map(com.listingplatform.channel.dto.ImageIssueDto::getReason)
                    .toList();
            parts.add("Image issues: " + String.join(", ", issues));
        }
        return parts.isEmpty() ? "Validation failed" : String.join("; ", parts);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getChannelSyncStatus(Long productId, Long sellerId) {
        Product product = productAccessService.verifyOwnership(productId, sellerId);
        List<ListingStatus> statuses = listingStatusRepository.findByProductId(productId);
        Map<String, ListingStatus> statusMap = statuses.stream()
                .collect(Collectors.toMap(s -> s.getChannel().toUpperCase(), s -> s, (a, b) -> a));

        List<Map<String, Object>> channelList = new ArrayList<>();

        // Flipkart
        ListingStatus fkStatus = statusMap.get("FLIPKART");
        Map<String, Object> fkMap = new java.util.HashMap<>();
        fkMap.put("channel", "FLIPKART");
        fkMap.put("status", fkStatus != null ? fkStatus.getStatus().name() : "DRAFT");
        fkMap.put("lastSyncedAt", fkStatus != null && fkStatus.getLastSyncedAt() != null ? fkStatus.getLastSyncedAt().toString() : "Not synced");
        fkMap.put("errorMessage", fkStatus != null && fkStatus.getErrorMessage() != null ? fkStatus.getErrorMessage() : "");
        channelList.add(fkMap);

        // Amazon
        ListingStatus amzStatus = statusMap.get("AMAZON");
        Map<String, Object> amzMap = new java.util.HashMap<>();
        amzMap.put("channel", "AMAZON");
        amzMap.put("status", amzStatus != null ? amzStatus.getStatus().name() : "DRAFT");
        amzMap.put("lastSyncedAt", amzStatus != null && amzStatus.getLastSyncedAt() != null ? amzStatus.getLastSyncedAt().toString() : "Not synced");
        amzMap.put("errorMessage", amzStatus != null && amzStatus.getErrorMessage() != null ? amzStatus.getErrorMessage() : "");
        Integer remoteStock = amazonAdapter.getRemoteStock(product.getSku());
        if (remoteStock != null) {
            amzMap.put("mockStock", remoteStock);
        }
        channelList.add(amzMap);

        return Map.of(
                "productId", product.getId(),
                "sku", product.getSku(),
                "title", product.getTitle(),
                "currentStock", product.getStock(),
                "channels", channelList
        );
    }

    @Transactional
    public Map<String, Object> setMockChannelStatus(Long productId, String channelStr, Status status, Long sellerId) {
        Product product = productAccessService.verifyOwnership(productId, sellerId);
        String channel = channelStr.trim().toUpperCase();

        Optional<ListingStatus> statusOpt = listingStatusRepository.findByProductIdAndChannel(product.getId(), channel);
        ListingStatus listingStatus = statusOpt.orElseGet(() -> ListingStatus.builder()
                .product(product)
                .channel(channel)
                .build());

        listingStatus.setStatus(status);
        listingStatus.setLastSyncedAt(LocalDateTime.now());
        listingStatus.setErrorMessage(null);
        listingStatusRepository.save(listingStatus);

        if ("AMAZON".equals(channel) && status == Status.PUBLISHED) {
            try {
                amazonAdapter.updateStock(product.getSku(), product.getStock());
            } catch (Exception e) {
                log.warn("Could not immediately update mock Amazon stock: {}", e.getMessage());
            }
        }

        return getChannelSyncStatus(productId, sellerId);
    }
}
