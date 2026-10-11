package com.listingplatform.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.listingplatform.order.dto.FlipkartOrderWebhookPayload;
import com.listingplatform.product.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrderWebhookControllerTest {

    private static final String SECRET = "test-secret-key-123";

    @Mock
    private OrderService orderService;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderWebhookController controller;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(controller, "expectedWebhookSecret", SECRET);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testValidWebhookReceives200AndDelegatesToOrderService() throws Exception {
        FlipkartOrderWebhookPayload payload = new FlipkartOrderWebhookPayload(
                "TSHIRT-RED-L",
                3,
                "OD-FK-998877",
                "2026-09-30T13:30:00Z",
                1L
        );

        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .header("X-Webhook-Secret", SECRET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.channelOrderId").value("OD-FK-998877"));

        verify(orderService, times(1)).processOrder("TSHIRT-RED-L", 1L, 3, "FLIPKART");
    }

    @Test
    void testMissingSecretHeaderReturns401Unauthorized() throws Exception {
        FlipkartOrderWebhookPayload payload = new FlipkartOrderWebhookPayload(
                "TSHIRT-RED-L",
                1,
                "OD-FK-111",
                "2026-09-30T13:30:00Z",
                1L
        );

        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));

        verifyNoInteractions(orderService);
    }

    @Test
    void testInvalidSecretHeaderReturns401Unauthorized() throws Exception {
        FlipkartOrderWebhookPayload payload = new FlipkartOrderWebhookPayload(
                "TSHIRT-RED-L",
                1,
                "OD-FK-222",
                "2026-09-30T13:30:00Z",
                1L
        );

        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .header("X-Webhook-Secret", "wrong-secret-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));

        verifyNoInteractions(orderService);
    }

    @Test
    void testInsufficientStockReturns409Conflict() throws Exception {
        FlipkartOrderWebhookPayload payload = new FlipkartOrderWebhookPayload(
                "TSHIRT-RED-L",
                100,
                "OD-FK-333",
                "2026-09-30T13:30:00Z",
                1L
        );

        doThrow(new InsufficientStockException("Insufficient stock for SKU 'TSHIRT-RED-L'"))
                .when(orderService).processOrder("TSHIRT-RED-L", 1L, 100, "FLIPKART");

        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .header("X-Webhook-Secret", SECRET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("InsufficientStock"))
                .andExpect(jsonPath("$.channelOrderId").value("OD-FK-333"));
    }

    @Test
    void testInvalidPayloadValidationFailure() throws Exception {
        // Missing SKU and negative quantity
        String invalidPayloadJson = """
                {
                    "sku": "",
                    "quantity": 0,
                    "channelOrderId": "",
                    "timestamp": "2026-09-30T13:30:00Z"
                }
                """;

        mockMvc.perform(post("/api/webhooks/flipkart/order")
                        .header("X-Webhook-Secret", SECRET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayloadJson))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(orderService);
    }
}
