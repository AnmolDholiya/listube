package com.listingplatform.order;

public record InventoryChangedEvent(
        Long productId,
        String sku,
        Long sellerId,
        int newStock,
        int previousStock,
        String originatingChannel
) {
    public InventoryChangedEvent(Long productId, String sku, Long sellerId, int newStock, int previousStock) {
        this(productId, sku, sellerId, newStock, previousStock, null);
    }
}
