package com.listingplatform.channel;

import com.listingplatform.channel.dto.BatchStatusResponseDto;
import com.listingplatform.channel.dto.PublishBatchResponseDto;
import com.listingplatform.channel.dto.ValidationResponseDto;
import com.listingplatform.channel.flipkart.FlipkartAdapter;
import com.listingplatform.channel.flipkart.PublishResult;
import com.listingplatform.image.ProductImageRepository;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductAccessDeniedException;
import com.listingplatform.product.ProductAccessService;
import com.listingplatform.product.ProductChannelExtensionRepository;
import com.listingplatform.product.ProductNotFoundException;
import com.listingplatform.seller.Seller;
import com.listingplatform.seller.SellerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AsyncPublishServiceTest {

    @Mock
    private FlipkartAdapter flipkartAdapter;

    @Mock
    private ListingStatusRepository listingStatusRepository;

    @Mock
    private PublishBatchRepository publishBatchRepository;

    @Mock
    private PublishBatchUpdateService publishBatchUpdateService;

    @InjectMocks
    private AsyncPublishService asyncPublishService;

    private UUID batchId;
    private Product product1;
    private Product product2;
    private Seller seller;

    @BeforeEach
    void setUp() {
        batchId = UUID.randomUUID();
        seller = Seller.builder().id(1L).businessName("Acme").email("test@acme.com").build();

        product1 = Product.builder().id(101L).sku("SKU-101").seller(seller).category("Apparel > T-Shirts").build();
        product2 = Product.builder().id(102L).sku("SKU-102").seller(seller).category("Apparel > T-Shirts").build();
    }

    @Test
    void testProcessBatchSuccess() {
        when(flipkartAdapter.publishListings(List.of(product1))).thenReturn(Map.of(
                "SKU-101", new PublishResult("PUBLISHED", null)
        ));
        when(listingStatusRepository.findByProductIdAndChannel(anyLong(), eq("FLIPKART"))).thenReturn(Optional.empty());

        asyncPublishService.processBatch(batchId, List.of(product1), List.of(product2), "FLIPKART");

        verify(publishBatchUpdateService, times(1)).updateStatusToInProgress(batchId);
        verify(flipkartAdapter, times(1)).publishListings(List.of(product1));
        verify(listingStatusRepository, times(2)).save(any(ListingStatus.class));
        verify(publishBatchUpdateService, times(2)).incrementCompletedCount(batchId);
        verify(publishBatchUpdateService, times(1)).markCompleted(batchId);
    }

    @Test
    void testProcessBatchFailureHandling() {
        when(flipkartAdapter.publishListings(List.of(product1))).thenThrow(new RuntimeException("Flipkart mock network error"));

        asyncPublishService.processBatch(batchId, List.of(product1), List.of(), "FLIPKART");

        verify(publishBatchUpdateService, times(1)).updateStatusToInProgress(batchId);
        verify(publishBatchUpdateService, times(1)).markFailed(eq(batchId), eq("Flipkart mock network error"));
        verify(listingStatusRepository, times(1)).save(any(ListingStatus.class));
    }
}
