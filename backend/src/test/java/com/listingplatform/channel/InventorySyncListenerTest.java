package com.listingplatform.channel;

import com.listingplatform.channel.amazon.AmazonAdapter;
import com.listingplatform.channel.flipkart.FlipkartAdapter;
import com.listingplatform.order.InventoryChangedEvent;
import com.listingplatform.product.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventorySyncListenerTest {

    @Mock
    private ListingStatusRepository listingStatusRepository;

    @Mock
    private AmazonAdapter amazonAdapter;

    @Mock
    private FlipkartAdapter flipkartAdapter;

    private InventorySyncListener listener;

    @BeforeEach
    void setUp() {
        when(amazonAdapter.getChannelName()).thenReturn("AMAZON");
        when(flipkartAdapter.getChannelName()).thenReturn("FLIPKART");

        listener = new InventorySyncListener(listingStatusRepository, List.of(amazonAdapter, flipkartAdapter));
    }

    @Test
    @DisplayName("When order originates from FLIPKART, updateStock is called exactly once for AMAZON and never for FLIPKART")
    void testInventoryChanged_whenOriginatingFromFlipkart_callsAmazonOnceAndSkipsFlipkart() {
        Long productId = 100L;
        String sku = "TEST-TSHIRT-001";
        int newStock = 42;

        Product mockProduct = Product.builder().id(productId).sku(sku).build();

        ListingStatus amazonListing = ListingStatus.builder()
                .id(1L)
                .product(mockProduct)
                .channel("AMAZON")
                .status(Status.PUBLISHED)
                .lastSyncedAt(null)
                .build();

        ListingStatus flipkartListing = ListingStatus.builder()
                .id(2L)
                .product(mockProduct)
                .channel("FLIPKART")
                .status(Status.PUBLISHED)
                .lastSyncedAt(LocalDateTime.of(2026, 9, 30, 12, 0))
                .build();

        when(listingStatusRepository.findByProductIdAndStatus(productId, Status.PUBLISHED))
                .thenReturn(List.of(amazonListing, flipkartListing));

        InventoryChangedEvent event = new InventoryChangedEvent(
                productId,
                sku,
                1L,
                newStock,
                50,
                "FLIPKART"
        );

        listener.onInventoryChanged(event);

        // Verify non-originating channel (Amazon) is called exactly once
        verify(amazonAdapter, times(1)).updateStock(sku, newStock);
        assertNotNull(amazonListing.getLastSyncedAt(), "Amazon listing lastSyncedAt must be updated on success");

        // Verify originating channel (Flipkart) is NEVER called
        verify(flipkartAdapter, never()).updateStock(anyString(), anyInt());

        // Verify listing status was saved for Amazon
        verify(listingStatusRepository, times(1)).save(amazonListing);
    }

    @Test
    @DisplayName("When order originates from AMAZON, updateStock is called exactly once for FLIPKART and never for AMAZON")
    void testInventoryChanged_whenOriginatingFromAmazon_callsFlipkartOnceAndSkipsAmazon() {
        Long productId = 200L;
        String sku = "TEST-HOODIE-002";
        int newStock = 18;

        Product mockProduct = Product.builder().id(productId).sku(sku).build();

        ListingStatus amazonListing = ListingStatus.builder()
                .id(10L)
                .product(mockProduct)
                .channel("AMAZON")
                .status(Status.PUBLISHED)
                .lastSyncedAt(LocalDateTime.of(2026, 9, 30, 10, 0))
                .build();

        ListingStatus flipkartListing = ListingStatus.builder()
                .id(20L)
                .product(mockProduct)
                .channel("FLIPKART")
                .status(Status.PUBLISHED)
                .lastSyncedAt(null)
                .build();

        when(listingStatusRepository.findByProductIdAndStatus(productId, Status.PUBLISHED))
                .thenReturn(List.of(amazonListing, flipkartListing));

        InventoryChangedEvent event = new InventoryChangedEvent(
                productId,
                sku,
                1L,
                newStock,
                20,
                "AMAZON"
        );

        listener.onInventoryChanged(event);

        // Verify non-originating channel (Flipkart) is called exactly once
        verify(flipkartAdapter, times(1)).updateStock(sku, newStock);
        assertNotNull(flipkartListing.getLastSyncedAt(), "Flipkart listing lastSyncedAt must be updated on success");

        // Verify originating channel (Amazon) is NEVER called
        verify(amazonAdapter, never()).updateStock(anyString(), anyInt());

        // Verify listing status was saved for Flipkart
        verify(listingStatusRepository, times(1)).save(flipkartListing);
    }

    @Test
    @DisplayName("When no listings are PUBLISHED, neither adapter is called")
    void testInventoryChanged_whenNoPublishedListings_noAdaptersCalled() {
        Long productId = 300L;
        String sku = "DRAFT-SKU-003";

        when(listingStatusRepository.findByProductIdAndStatus(productId, Status.PUBLISHED))
                .thenReturn(List.of());

        InventoryChangedEvent event = new InventoryChangedEvent(
                productId,
                sku,
                1L,
                5,
                10,
                "MANUAL"
        );

        listener.onInventoryChanged(event);

        verify(amazonAdapter, never()).updateStock(anyString(), anyInt());
        verify(flipkartAdapter, never()).updateStock(anyString(), anyInt());
        verify(listingStatusRepository, never()).save(any());
    }

    @Test
    @DisplayName("When adapter fails, last_synced_at remains stale and exception does not bubble up")
    void testInventorySyncLeavesTimestampStaleWhenAdapterFails() {
        Long productId = 400L;
        String sku = "FAIL-SKU-999";
        int newStock = 15;

        Product mockProduct = Product.builder().id(productId).sku(sku).build();
        LocalDateTime originalSyncTime = LocalDateTime.of(2026, 9, 29, 10, 0);

        ListingStatus amazonListing = ListingStatus.builder()
                .id(3L)
                .product(mockProduct)
                .channel("AMAZON")
                .status(Status.PUBLISHED)
                .lastSyncedAt(originalSyncTime)
                .build();

        when(listingStatusRepository.findByProductIdAndStatus(productId, Status.PUBLISHED))
                .thenReturn(List.of(amazonListing));

        doThrow(new RuntimeException("Simulated Amazon 500 timeout"))
                .when(amazonAdapter).updateStock(sku, newStock);

        InventoryChangedEvent event = new InventoryChangedEvent(
                productId,
                sku,
                1L,
                newStock,
                20,
                "FLIPKART"
        );

        // Should not throw or crash
        assertDoesNotThrow(() -> listener.onInventoryChanged(event));

        // Verify adapter was invoked
        verify(amazonAdapter, times(1)).updateStock(sku, newStock);

        // Verify lastSyncedAt remained stale (not updated to now)
        assertEquals(originalSyncTime, amazonListing.getLastSyncedAt(),
                "last_synced_at must remain stale when synchronization fails");
        verify(listingStatusRepository, never()).save(amazonListing);
    }
}
