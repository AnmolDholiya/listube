package com.listingplatform.channel.flipkart;

import com.listingplatform.image.ProductImageRepository;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductChannelExtensionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlipkartAdapterTest {

    @Mock
    private FlipkartTokenService tokenService;

    @Mock
    private FlipkartMapper flipkartMapper;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private ProductChannelExtensionRepository extensionRepository;

    private FlipkartConfig config;
    private FlipkartAdapter adapter;

    @BeforeEach
    void setUp() {
        config = new FlipkartConfig();
        config.setMode("SANDBOX");
        config.setEnvironment("sandbox");
        config.setClientId("test-client");
        config.setClientSecret("test-secret");
        config.setBaseUrl("http://localhost:8089");
        config.setServiceUrl("http://localhost:8081");

        adapter = new FlipkartAdapter(config, tokenService, flipkartMapper, productImageRepository, extensionRepository);
    }

    @Test
    @DisplayName("Returns empty map for empty products list")
    void testPublishListings_emptyList() {
        Map<String, PublishResult> results = adapter.publishListings(List.of());
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    @DisplayName("getChannelName returns FLIPKART")
    void testGetChannelName() {
        assertEquals("FLIPKART", adapter.getChannelName());
    }

    @Test
    @DisplayName("Mock mode updateStock logs and completes gracefully")
    void testUpdateStock_mockMode() {
        config.setMode("MOCK");
        assertDoesNotThrow(() -> adapter.updateStock("SKU-001", 15));
    }
}
