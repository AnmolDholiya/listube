package com.listingplatform.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FlipkartOrderWebhookPayload(
        @NotBlank(message = "SKU cannot be blank")
        String sku,

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        Integer quantity,

        @NotBlank(message = "Channel order ID cannot be blank")
        String channelOrderId,

        String timestamp,
        Long sellerId
) {
}
