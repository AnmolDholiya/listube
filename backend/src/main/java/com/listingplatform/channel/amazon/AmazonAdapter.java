package com.listingplatform.channel.amazon;

import com.listingplatform.channel.ChannelStockAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class AmazonAdapter implements ChannelStockAdapter {

    private static final Logger log = LoggerFactory.getLogger(AmazonAdapter.class);

    private final RestClient restClient;
    private final String amazonServiceUrl;

    public AmazonAdapter(@Value("${amazon.service.url:http://localhost:8082}") String amazonServiceUrl) {
        this.amazonServiceUrl = amazonServiceUrl;
        this.restClient = RestClient.builder()
                .baseUrl(amazonServiceUrl)
                .build();
    }

    @Override
    public String getChannelName() {
        return "AMAZON";
    }

    @Override
    public void updateStock(String sku, int newStock) {
        log.info("[AMAZON-ADAPTER] Calling Amazon SP-API PUT /amazon/listings/{}/stock with newStock={}", sku, newStock);

        try {
            restClient.put()
                    .uri("/amazon/listings/{sku}/stock", sku)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("newStock", newStock))
                    .retrieve()
                    .toBodilessEntity();

            log.info("[AMAZON-ADAPTER] Successfully confirmed stock update for SKU {} to {}", sku, newStock);
        } catch (Exception e) {
            log.error("[AMAZON-ADAPTER] Failed to update Amazon stock for SKU {}: {}", sku, e.getMessage());
            throw new RuntimeException("Amazon stock sync failed: " + e.getMessage(), e);
        }
    }

    /**
     * Optional helper to fetch live mock Amazon stock for visual UI proof.
     */
    public Integer getRemoteStock(String sku) {
        try {
            Map<?, ?> response = restClient.get()
                    .uri("/amazon/listings/{sku}/stock", sku)
                    .retrieve()
                    .body(Map.class);
            if (response != null && response.containsKey("stock")) {
                return (Integer) response.get("stock");
            }
        } catch (Exception e) {
            log.debug("[AMAZON-ADAPTER] Could not query remote stock for SKU {}: {}", sku, e.getMessage());
        }
        return null;
    }
}
