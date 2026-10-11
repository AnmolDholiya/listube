package com.listingplatform.channel.flipkart;

import com.listingplatform.channel.ChannelStockAdapter;
import com.listingplatform.image.ProductImage;
import com.listingplatform.image.ProductImageRepository;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductChannelExtension;
import com.listingplatform.product.ProductChannelExtensionRepository;
import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class FlipkartAdapter implements ChannelStockAdapter {

    private final FlipkartConfig config;
    private final FlipkartTokenService tokenService;
    private final FlipkartMapper flipkartMapper;
    private final ProductImageRepository productImageRepository;
    private final ProductChannelExtensionRepository extensionRepository;

    private final WebClient sandboxWebClient;
    private final WebClient mockWebClient;

    public FlipkartAdapter(
            FlipkartConfig config,
            FlipkartTokenService tokenService,
            FlipkartMapper flipkartMapper,
            ProductImageRepository productImageRepository,
            ProductChannelExtensionRepository extensionRepository) {
        this.config = config;
        this.tokenService = tokenService;
        this.flipkartMapper = flipkartMapper;
        this.productImageRepository = productImageRepository;
        this.extensionRepository = extensionRepository;

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .responseTimeout(Duration.ofSeconds(10));

        // WebClient for Real Flipkart Sandbox API
        this.sandboxWebClient = WebClient.builder()
                .baseUrl(config.getBaseUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();

        // WebClient for Local Mock Flipkart Service (Fallback)
        this.mockWebClient = WebClient.builder()
                .baseUrl(config.getServiceUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Override
    public String getChannelName() {
        return "FLIPKART";
    }

    @Override
    public void updateStock(String sku, int newStock) {
        if (config.isMockMode()) {
            log.info("[FLIPKART-ADAPTER] (MOCK MODE) Stock update for SKU '{}' with newStock={} acknowledged.", sku, newStock);
            return;
        }

        log.info("[FLIPKART-ADAPTER] Propagating stock update to Flipkart Sandbox for SKU '{}' with newStock={}", sku, newStock);

        try {
            String accessToken = tokenService.getAccessToken();

            Map<String, Object> inventoryPayload = Map.of(
                    "sku", sku,
                    "locations", List.of(Map.of("inventory", newStock))
            );

            sandboxWebClient.post()
                    .uri("/sellers/listings/v3/update/inventory")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(inventoryPayload)
                    .retrieve()
                    .toBodilessEntity()
                    .block(Duration.ofSeconds(8));

            log.info("[FLIPKART-ADAPTER] Successfully confirmed Flipkart Sandbox stock update for SKU '{}' to {}", sku, newStock);

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                log.warn("[FLIPKART-ADAPTER] Received 401 Unauthorized during stock update. Invalidating token cache.");
                tokenService.invalidateToken();
            }
            log.error("[FLIPKART-ADAPTER] Flipkart Sandbox inventory update failed for SKU '{}' (HTTP {}): {}",
                    sku, e.getStatusCode(), e.getStatusText());
            throw new RuntimeException("Flipkart Sandbox inventory update failed: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("[FLIPKART-ADAPTER] Failed to update Flipkart Sandbox stock for SKU '{}': {}", sku, e.getMessage());
            throw new RuntimeException("Flipkart Sandbox inventory update failed: " + e.getMessage(), e);
        }
    }

    /**
     * Publishes products to Flipkart (Sandbox API or Mock depending on flipkart.mode).
     *
     * @param products List of canonical products to publish
     * @return Map of SKU -> PublishResult
     */
    public Map<String, PublishResult> publishListings(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return Map.of();
        }

        // Build batch payload mapping each SKU using canonical product, images, and extensions
        Map<String, Object> batchPayload = new HashMap<>();
        for (Product product : products) {
            List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
            List<ProductChannelExtension> extensions = extensionRepository.findByProductIdAndChannel(product.getId(), "FLIPKART");
            Map<String, Object> productPayload = flipkartMapper.mapToFlipkartPayload(product, images, extensions);
            batchPayload.put(product.getSku(), productPayload);
        }

        if (config.isMockMode()) {
            return publishToMockService(batchPayload);
        } else {
            return publishToSandbox(products, batchPayload);
        }
    }

    private Map<String, PublishResult> publishToMockService(Map<String, Object> batchPayload) {
        log.info("[FLIPKART-ADAPTER] (MOCK MODE) Publishing {} products to Mock Flipkart Service at {}",
                batchPayload.size(), config.getServiceUrl());
        try {
            Map<String, Map<String, Object>> response = mockWebClient.post()
                    .uri("/flipkart/listings")
                    .bodyValue(batchPayload)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Map<String, Object>>>() {})
                    .block(Duration.ofSeconds(5));

            Map<String, PublishResult> results = new HashMap<>();
            if (response != null) {
                for (Map.Entry<String, Map<String, Object>> entry : response.entrySet()) {
                    String sku = entry.getKey();
                    Map<String, Object> resMap = entry.getValue();
                    String status = (String) resMap.get("status");
                    String errorMessage = (String) resMap.get("errorMessage");
                    results.put(sku, new PublishResult(status, errorMessage));
                }
            }
            return results;
        } catch (WebClientRequestException e) {
            throw new FlipkartServiceUnavailableException("mock-flipkart-service unreachable at " + config.getServiceUrl() + " — is it running?", e);
        } catch (Exception e) {
            throw new FlipkartServiceUnavailableException("mock-flipkart-service unreachable at " + config.getServiceUrl() + " — is it running?", e);
        }
    }

    private Map<String, PublishResult> publishToSandbox(List<Product> products, Map<String, Object> batchPayload) {
        log.info("[FLIPKART-ADAPTER] (SANDBOX MODE) Requesting access token and publishing {} products to Flipkart Sandbox API at {}/sellers/listings/v3",
                products.size(), config.getBaseUrl());

        String accessToken = tokenService.getAccessToken();
        Map<String, PublishResult> results = new HashMap<>();

        try {
            Map<String, Object> response = sandboxWebClient.post()
                    .uri("/sellers/listings/v3")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(batchPayload)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block(Duration.ofSeconds(15));

            if (response != null) {
                for (Product product : products) {
                    String sku = product.getSku();
                    Object itemResult = response.get(sku);

                    if (itemResult instanceof Map<?, ?> itemMap) {
                        String status = itemMap.containsKey("status") ? String.valueOf(itemMap.get("status")) : "PUBLISHED";
                        String errorMsg = itemMap.containsKey("errorMessage") ? String.valueOf(itemMap.get("errorMessage")) : null;
                        results.put(sku, new PublishResult(status, errorMsg));
                    } else if (response.containsKey("status") && "SUCCESS".equalsIgnoreCase(String.valueOf(response.get("status")))) {
                        results.put(sku, new PublishResult("PUBLISHED", null));
                    } else {
                        results.put(sku, new PublishResult("PUBLISHED", null));
                    }
                }
            } else {
                for (Product product : products) {
                    results.put(product.getSku(), new PublishResult("PUBLISHED", null));
                }
            }

            return results;

        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                log.warn("[FLIPKART-ADAPTER] Received 401 Unauthorized from Flipkart Sandbox. Invalidating cached access token.");
                tokenService.invalidateToken();
            }

            log.error("[FLIPKART-ADAPTER] Flipkart Sandbox listing API returned error status {}: {}",
                    e.getStatusCode(), e.getResponseBodyAsString());

            String safeErrorMessage = "Flipkart Sandbox HTTP " + e.getStatusCode().value() + ": " + e.getStatusText();
            for (Product product : products) {
                results.put(product.getSku(), new PublishResult("FAILED", safeErrorMessage));
            }
            return results;

        } catch (WebClientRequestException e) {
            log.error("[FLIPKART-ADAPTER] Flipkart Sandbox service unreachable at {}: {}", config.getBaseUrl(), e.getMessage());
            throw new FlipkartServiceUnavailableException("Flipkart Sandbox service unreachable at " + config.getBaseUrl(), e);
        } catch (Exception e) {
            log.error("[FLIPKART-ADAPTER] Unexpected error while publishing to Flipkart Sandbox: {}", e.getMessage());
            throw new FlipkartServiceUnavailableException("Flipkart Sandbox publish failed: " + e.getMessage(), e);
        }
    }
}
