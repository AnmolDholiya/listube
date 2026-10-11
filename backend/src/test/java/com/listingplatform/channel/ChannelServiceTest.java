package com.listingplatform.channel;

import com.listingplatform.channel.dto.BatchStatusResponseDto;
import com.listingplatform.channel.dto.PublishBatchResponseDto;
import com.listingplatform.channel.dto.ValidationResponseDto;
import com.listingplatform.image.ProductImageRepository;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductAccessDeniedException;
import com.listingplatform.product.ProductAccessService;
import com.listingplatform.product.ProductChannelExtension;
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
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChannelServiceTest {

    @Mock
    private ProductAccessService productAccessService;
    @Mock
    private ProductChannelExtensionRepository extensionRepository;
    @Mock
    private ChannelRequiredFieldRepository channelRequiredFieldRepository;
    @Mock
    private ProductImageRepository productImageRepository;
    @Mock
    private ListingStatusRepository listingStatusRepository;
    @Mock
    private PublishBatchRepository publishBatchRepository;
    @Mock
    private SellerRepository sellerRepository;
    @Mock
    private AsyncPublishService asyncPublishService;
    @Mock
    private com.listingplatform.channel.amazon.AmazonAdapter amazonAdapter;

    @InjectMocks
    private ChannelService channelService;

    private Seller seller;
    private Product product;

    @BeforeEach
    void setUp() {
        seller = Seller.builder().id(1L).businessName("Acme").email("test@acme.com").build();
        product = Product.builder().id(10L).sku("SKU-10").seller(seller).category("Apparel > T-Shirts").build();
    }

    @Test
    void testPublishProductsInitiatesAsyncBatch() {
        when(productAccessService.verifyOwnership(10L, 1L)).thenReturn(product);
        when(sellerRepository.findById(1L)).thenReturn(Optional.of(seller));
        when(channelRequiredFieldRepository.findByChannelAndCategory(eq("FLIPKART"), anyString())).thenReturn(List.of());
        when(extensionRepository.findByProductIdAndChannel(10L, "FLIPKART")).thenReturn(List.of());
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L)).thenReturn(List.of());

        PublishBatchResponseDto res = channelService.publishProducts("FLIPKART", List.of(10L), 1L);

        assertNotNull(res);
        assertNotNull(res.getBatchId());
        assertEquals("PENDING", res.getStatus());
        assertEquals(1, res.getTotalCount());

        verify(publishBatchRepository, times(1)).save(any(PublishBatch.class));
        verify(asyncPublishService, times(1)).processBatch(eq(res.getBatchId()), anyList(), anyList(), eq("FLIPKART"));
    }

    @Test
    void testGetPublishBatchStatusOwnershipSuccess() {
        UUID batchId = UUID.randomUUID();
        PublishBatch batch = PublishBatch.builder()
                .batchId(batchId)
                .seller(seller)
                .channel("FLIPKART")
                .totalCount(1)
                .completedCount(1)
                .status("COMPLETED")
                .createdAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();

        ListingStatus ls = ListingStatus.builder()
                .id(1L)
                .product(product)
                .channel("FLIPKART")
                .status(Status.PUBLISHED)
                .batchId(batchId)
                .lastSyncedAt(LocalDateTime.now())
                .build();

        when(publishBatchRepository.findByBatchId(batchId)).thenReturn(Optional.of(batch));
        when(listingStatusRepository.findByBatchId(batchId)).thenReturn(List.of(ls));

        BatchStatusResponseDto statusDto = channelService.getPublishBatchStatus(batchId, 1L);

        assertNotNull(statusDto);
        assertEquals(batchId, statusDto.getBatchId());
        assertEquals("COMPLETED", statusDto.getStatus());
        assertEquals(1, statusDto.getResults().size());
        assertEquals("SKU-10", statusDto.getResults().get(0).getSku());
    }

    @Test
    void testGetPublishBatchStatusAccessDeniedForDifferentSeller() {
        UUID batchId = UUID.randomUUID();
        Seller otherSeller = Seller.builder().id(99L).build();
        PublishBatch batch = PublishBatch.builder()
                .batchId(batchId)
                .seller(otherSeller)
                .build();

        when(publishBatchRepository.findByBatchId(batchId)).thenReturn(Optional.of(batch));

        assertThrows(ProductAccessDeniedException.class, () -> {
            channelService.getPublishBatchStatus(batchId, 1L);
        });
    }

    @Test
    void testGetPublishBatchStatusNotFound() {
        UUID batchId = UUID.randomUUID();
        when(publishBatchRepository.findByBatchId(batchId)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> {
            channelService.getPublishBatchStatus(batchId, 1L);
        });
    }

    @Test
    void testRetryPublishWhenValidInitiatesAsyncBatch() {
        ChannelRequiredField reqField = ChannelRequiredField.builder()
                .channel("FLIPKART")
                .category("Apparel > T-Shirts")
                .requiredField("hsn")
                .build();
        ProductChannelExtension ext = ProductChannelExtension.builder()
                .product(product)
                .channel("FLIPKART")
                .fieldKey("hsn")
                .fieldValue("61091000")
                .build();
        com.listingplatform.image.ProductImage img1 = com.listingplatform.image.ProductImage.builder()
                .id(1L).product(product).widthPx(600).heightPx(600).build();
        com.listingplatform.image.ProductImage img2 = com.listingplatform.image.ProductImage.builder()
                .id(2L).product(product).widthPx(600).heightPx(600).build();

        when(productAccessService.verifyOwnership(10L, 1L)).thenReturn(product);
        when(sellerRepository.findById(1L)).thenReturn(Optional.of(seller));
        when(channelRequiredFieldRepository.findByChannelAndCategory(eq("FLIPKART"), eq("Apparel > T-Shirts"))).thenReturn(List.of(reqField));
        when(extensionRepository.findByProductIdAndChannel(10L, "FLIPKART")).thenReturn(List.of(ext));
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L)).thenReturn(List.of(img1, img2));

        PublishBatchResponseDto res = channelService.retryPublish(10L, "FLIPKART", 1L);

        assertNotNull(res);
        assertNotNull(res.getBatchId());
        assertEquals("PENDING", res.getStatus());
        assertEquals(1, res.getTotalCount());

        verify(publishBatchRepository, times(1)).save(any(PublishBatch.class));
        verify(asyncPublishService, times(1)).processBatch(eq(res.getBatchId()), eq(List.of(product)), eq(List.of()), eq("FLIPKART"));
    }

    @Test
    void testRetryPublishWhenInvalidThrowsException() {
        ChannelRequiredField reqField = ChannelRequiredField.builder()
                .channel("FLIPKART")
                .category("Apparel > T-Shirts")
                .requiredField("hsn")
                .build();

        when(productAccessService.verifyOwnership(10L, 1L)).thenReturn(product);
        when(channelRequiredFieldRepository.findByChannelAndCategory(eq("FLIPKART"), eq("Apparel > T-Shirts"))).thenReturn(List.of(reqField));
        when(extensionRepository.findByProductIdAndChannel(10L, "FLIPKART")).thenReturn(List.of());
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L)).thenReturn(List.of());
        when(listingStatusRepository.findByProductIdAndChannel(10L, "FLIPKART")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            channelService.retryPublish(10L, "FLIPKART", 1L);
        });

        verify(listingStatusRepository, atLeastOnce()).save(any(ListingStatus.class));
        verifyNoInteractions(asyncPublishService);
    }

    @Test
    void testValidateListing_whenRequiredChannelFieldMissing_blockedPrePublishAndMarkedDraft() {
        ChannelRequiredField reqFieldHsn = ChannelRequiredField.builder()
                .channel("FLIPKART")
                .category("Apparel > T-Shirts")
                .requiredField("hsn")
                .build();
        ChannelRequiredField reqFieldProc = ChannelRequiredField.builder()
                .channel("FLIPKART")
                .category("Apparel > T-Shirts")
                .requiredField("procurement_type")
                .build();

        // Product has procurement_type extension, but lacks "hsn"
        ProductChannelExtension extProc = ProductChannelExtension.builder()
                .product(product)
                .channel("FLIPKART")
                .fieldKey("procurement_type")
                .fieldValue("REGULAR")
                .build();

        // Product has 2 valid images (500x500+)
        com.listingplatform.image.ProductImage img1 = com.listingplatform.image.ProductImage.builder()
                .id(1L).product(product).widthPx(600).heightPx(600).build();
        com.listingplatform.image.ProductImage img2 = com.listingplatform.image.ProductImage.builder()
                .id(2L).product(product).widthPx(600).heightPx(600).build();

        when(productAccessService.verifyOwnership(10L, 1L)).thenReturn(product);
        when(channelRequiredFieldRepository.findByChannelAndCategory("FLIPKART", "Apparel > T-Shirts"))
                .thenReturn(List.of(reqFieldHsn, reqFieldProc));
        when(extensionRepository.findByProductIdAndChannel(10L, "FLIPKART"))
                .thenReturn(List.of(extProc));
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L))
                .thenReturn(List.of(img1, img2));
        when(listingStatusRepository.findByProductIdAndChannel(10L, "FLIPKART"))
                .thenReturn(Optional.empty());

        ValidationResponseDto valDto = channelService.validateListing(10L, "FLIPKART", 1L);

        assertNotNull(valDto);
        assertFalse(valDto.isValid(), "Listing must be invalid when required channel field is missing");
        assertTrue(valDto.isCategoryConfigured());
        assertEquals(List.of("hsn"), valDto.getMissingFields(), "Missing fields must specifically identify 'hsn'");
        assertTrue(valDto.getImageIssues().isEmpty(), "Images were valid, so imageIssues should be empty");

        // Verify status updated to DRAFT with missing fields reason
        org.mockito.ArgumentCaptor<ListingStatus> statusCaptor = org.mockito.ArgumentCaptor.forClass(ListingStatus.class);
        verify(listingStatusRepository).save(statusCaptor.capture());
        assertEquals(Status.DRAFT, statusCaptor.getValue().getStatus());
        assertTrue(statusCaptor.getValue().getErrorMessage().contains("Missing required fields: [hsn]"));
    }

    @Test
    void testPublishProducts_whenProductMissingRequiredField_placedInInvalidListAndBlockedFromPublish() {
        ChannelRequiredField reqFieldHsn = ChannelRequiredField.builder()
                .channel("FLIPKART")
                .category("Apparel > T-Shirts")
                .requiredField("hsn")
                .build();

        when(productAccessService.verifyOwnership(10L, 1L)).thenReturn(product);
        when(sellerRepository.findById(1L)).thenReturn(Optional.of(seller));
        when(channelRequiredFieldRepository.findByChannelAndCategory("FLIPKART", "Apparel > T-Shirts"))
                .thenReturn(List.of(reqFieldHsn));
        when(extensionRepository.findByProductIdAndChannel(10L, "FLIPKART"))
                .thenReturn(List.of()); // No extensions, so missing 'hsn'
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L))
                .thenReturn(List.of());
        when(listingStatusRepository.findByProductIdAndChannel(10L, "FLIPKART"))
                .thenReturn(Optional.empty());

        PublishBatchResponseDto res = channelService.publishProducts("FLIPKART", List.of(10L), 1L);

        assertNotNull(res);
        assertNotNull(res.getBatchId());

        // Verify that product 10L is passed as invalidProducts and NOT in validProducts
        verify(asyncPublishService, times(1)).processBatch(
                eq(res.getBatchId()),
                eq(List.of()),          // validProducts must be empty
                eq(List.of(product)),   // invalidProducts must contain the blocked product
                eq("FLIPKART")
        );
    }
}
