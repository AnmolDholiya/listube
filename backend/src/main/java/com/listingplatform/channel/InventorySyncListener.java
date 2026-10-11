package com.listingplatform.channel;

import com.listingplatform.order.InventoryChangedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class InventorySyncListener {

    private static final Logger log = LoggerFactory.getLogger(InventorySyncListener.class);

    private final ListingStatusRepository listingStatusRepository;
    private final Map<String, ChannelStockAdapter> channelAdapters;

    public InventorySyncListener(
            ListingStatusRepository listingStatusRepository,
            List<ChannelStockAdapter> adapters) {
        this.listingStatusRepository = listingStatusRepository;
        this.channelAdapters = adapters.stream()
                .collect(Collectors.toMap(
                        a -> a.getChannelName().toUpperCase(),
                        Function.identity(),
                        (existing, replacement) -> existing
                ));
    }

    /**
     * Listens asynchronously for inventory changes and propagates new available stock
     * to all OTHER marketplace channels where the product has an active PUBLISHED listing.
     * The originating channel of the order is excluded.
     */
    @Async
    @EventListener
    @Transactional
    public void onInventoryChanged(InventoryChangedEvent event) {
        log.info("[INVENTORY-SYNC] Received InventoryChangedEvent: productId={}, sku={}, newStock={}, originatingChannel={}",
                event.productId(), event.sku(), event.newStock(), event.originatingChannel());

        List<ListingStatus> publishedListings = listingStatusRepository
                .findByProductIdAndStatus(event.productId(), Status.PUBLISHED);

        if (publishedListings.isEmpty()) {
            log.info("[INVENTORY-SYNC] No PUBLISHED listings found for product ID {}. No external channels to sync.",
                    event.productId());
            return;
        }

        for (ListingStatus listing : publishedListings) {
            String channel = listing.getChannel().toUpperCase();

            // Skip the channel the order originated from — it is already updated there
            if (event.originatingChannel() != null && event.originatingChannel().equalsIgnoreCase(channel)) {
                log.info("[INVENTORY-SYNC] Skipping inventory sync to originating channel: {}", channel);
                continue;
            }

            ChannelStockAdapter adapter = channelAdapters.get(channel);
            if (adapter == null) {
                log.warn("[INVENTORY-SYNC] No registered ChannelStockAdapter for channel '{}'. Skipping.", channel);
                continue;
            }

            try {
                log.info("[INVENTORY-SYNC] Propagating stock update to {}: sku={}, newStock={}",
                        channel, event.sku(), event.newStock());
                adapter.updateStock(event.sku(), event.newStock());

                listing.setLastSyncedAt(LocalDateTime.now());
                listingStatusRepository.save(listing);
                log.info("[INVENTORY-SYNC] Successfully synced stock to {} for SKU {}. Updated lastSyncedAt={}",
                        channel, event.sku(), listing.getLastSyncedAt());
            } catch (Exception e) {
                log.error("[INVENTORY-SYNC] FAILED to sync stock to {} for SKU {}: {}. Leaving last_synced_at stale for reconciliation.",
                        channel, event.sku(), e.getMessage());
                // Stale timestamp preserved intentionally for reconciliation
            }
        }
    }
}
