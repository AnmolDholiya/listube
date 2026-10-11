package com.listingplatform.order;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.listingplatform.order.dto.FlipkartOrderWebhookPayload;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductRepository;
import com.listingplatform.seller.Seller;
import com.listingplatform.seller.SellerRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OrderWebhookIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private com.listingplatform.category.CategoryRepository categoryRepository;

    @Value("${flipkart.webhook.secret}")
    private String configuredSecret;

    private ListAppender<ILoggingEvent> listAppender;
    private Logger orderServiceLogger;

    @BeforeEach
    void setUp() {
        orderServiceLogger = (Logger) LoggerFactory.getLogger(OrderService.class);
        listAppender = new ListAppender<>();
        listAppender.start();
        orderServiceLogger.addAppender(listAppender);
    }

    @AfterEach
    void tearDown() {
        if (orderServiceLogger != null && listAppender != null) {
            orderServiceLogger.detachAppender(listAppender);
        }
    }

    @Test
    void testInboundFlipkartWebhookAuthenticatesDecrementsStockAndLogs() throws Exception {
        Seller seller = sellerRepository.findAll().stream().findFirst().orElseGet(() -> {
            Seller newSeller = Seller.builder()
                    .businessName("Webhook Test Seller")
                    .email("webhook-" + UUID.randomUUID() + "@test.com")
                    .passwordHash("hash")
                    .build();
            return sellerRepository.save(newSeller);
        });

        String testSku = "WH-SKU-" + UUID.randomUUID().toString().substring(0, 8);
        com.listingplatform.category.Category testCat = categoryRepository.findByName("Apparel > T-Shirts")
                .orElseGet(() -> categoryRepository.save(new com.listingplatform.category.Category("Apparel > T-Shirts")));

        Product product = Product.builder()
                .seller(seller)
                .sku(testSku)
                .title("Webhook Test Tee")
                .category(testCat)
                .brand("Brand")
                .mrp(new BigDecimal("800.00"))
                .sellingPrice(new BigDecimal("400.00"))
                .stock(10)
                .version(0)
                .build();
        product = productRepository.saveAndFlush(product);

        int testQuantity = 2;
        String testOrderId = "OD-FK-99881122";
        String testTimestamp = "2026-09-30T13:35:00Z";

        FlipkartOrderWebhookPayload payload = new FlipkartOrderWebhookPayload(
                testSku,
                testQuantity,
                testOrderId,
                testTimestamp,
                seller.getId()
        );

        // 1. Post to webhook endpoint with valid secret header
        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .header("X-Webhook-Secret", configuredSecret)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.channelOrderId").value(testOrderId));

        // 2. Assert stock was decremented from 10 to 8
        Product updatedProduct = productRepository.findById(product.getId()).orElseThrow();
        assertEquals(8, updatedProduct.getStock(), "Stock should be decremented from 10 to 8");

        // 3. Assert that OrderService logged the decrement
        boolean loggedExpected = listAppender.list.stream()
                .anyMatch(event -> event.getFormattedMessage().contains("Successfully decremented stock for SKU")
                        && event.getFormattedMessage().contains(testSku)
                        && event.getFormattedMessage().contains("10 -> 8"));

        assertTrue(loggedExpected, "OrderService should have logged the stock decrement");
    }

    @Test
    void testWebhookRejectsMissingSecret() throws Exception {
        FlipkartOrderWebhookPayload payload = new FlipkartOrderWebhookPayload(
                "SKU-1", 1, "OD-1", "2026-09-30T13:35:00Z", 1L
        );

        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void testWebhookRejectsIncorrectSecret() throws Exception {
        FlipkartOrderWebhookPayload payload = new FlipkartOrderWebhookPayload(
                "SKU-1", 1, "OD-1", "2026-09-30T13:35:00Z", 1L
        );

        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .header("X-Webhook-Secret", "tampered-secret-header")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }
}
