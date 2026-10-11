package com.listingplatform.order;

import com.listingplatform.order.dto.FlipkartOrderWebhookPayload;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductNotFoundException;
import com.listingplatform.product.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/flipkart")
@Tag(name = "Order Webhooks", description = "Inbound marketplace order webhooks")
public class OrderWebhookController {

    private static final Logger log = LoggerFactory.getLogger(OrderWebhookController.class);

    private final OrderService orderService;
    private final ProductRepository productRepository;

    @Value("${flipkart.webhook.secret:flipkart-secret-webhook-key-2026}")
    private String expectedWebhookSecret;

    public OrderWebhookController(OrderService orderService, ProductRepository productRepository) {
        this.orderService = orderService;
        this.productRepository = productRepository;
    }

    @PostMapping("/order")
    @Operation(summary = "Receive Flipkart Order Webhook", description = "Validates shared secret header and processes stock decrement under optimistic concurrency")
    public ResponseEntity<?> handleOrderWebhook(
            @RequestHeader(value = "X-Webhook-Secret", required = false) String secretHeader,
            @Valid @RequestBody FlipkartOrderWebhookPayload payload) {

        if (secretHeader == null || !expectedWebhookSecret.equals(secretHeader)) {
            log.warn("Unauthorized webhook attempt rejected: invalid or missing X-Webhook-Secret header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "Unauthorized",
                            "message", "Invalid or missing webhook secret header"
                    ));
        }

        Long sellerId = payload.sellerId();
        if (sellerId == null) {
            Product product = productRepository.findFirstBySku(payload.sku())
                    .orElseThrow(() -> new ProductNotFoundException(
                            "Product not found with SKU '" + payload.sku() + "'"));
            sellerId = product.getSeller().getId();
        }

        try {
            orderService.processOrder(payload.sku(), sellerId, payload.quantity(), "FLIPKART");
        } catch (InsufficientStockException e) {
            log.warn("Order webhook rejected due to insufficient stock: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error", "InsufficientStock",
                            "message", e.getMessage(),
                            "channelOrderId", payload.channelOrderId()
                    ));
        }

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Order processed and stock decremented successfully",
                "channelOrderId", payload.channelOrderId()
        ));
    }
}
