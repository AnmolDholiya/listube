package com.listingplatform.channel.flipkart;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
public class FlipkartTokenService {

    private final FlipkartConfig config;
    private final WebClient webClient;
    private final ReentrantLock lock = new ReentrantLock();

    private volatile String cachedAccessToken;
    private volatile Instant tokenExpiryTime;

    public FlipkartTokenService(FlipkartConfig config) {
        this.config = config;
        this.webClient = WebClient.builder()
                .build();
    }

    /**
     * Retrieves a valid Flipkart Self-Access access token.
     * Reuses cached token if valid; automatically requests a fresh token if expired or absent.
     *
     * @return valid access token string
     */
    public String getAccessToken() {
        if (!config.isConfigured()) {
            throw new IllegalStateException("Flipkart Client ID and Client Secret must be configured in environment variables (FLIPKART_CLIENT_ID, FLIPKART_CLIENT_SECRET).");
        }

        // Fast path: check if cached token is still valid (with 60-second buffer)
        if (cachedAccessToken != null && tokenExpiryTime != null && Instant.now().isBefore(tokenExpiryTime.minusSeconds(60))) {
            return cachedAccessToken;
        }

        lock.lock();
        try {
            // Double-checked locking
            if (cachedAccessToken != null && tokenExpiryTime != null && Instant.now().isBefore(tokenExpiryTime.minusSeconds(60))) {
                return cachedAccessToken;
            }

            return fetchFreshAccessToken();
        } finally {
            lock.unlock();
        }
    }

    /**
     * Forces invalidation of the cached token, e.g., upon encountering an unexpected 401 Unauthorized.
     */
    public void invalidateToken() {
        lock.lock();
        try {
            log.info("[FLIPKART-AUTH] Invalidation requested for cached access token.");
            this.cachedAccessToken = null;
            this.tokenExpiryTime = null;
        } finally {
            lock.unlock();
        }
    }

    /**
     * Safely tests connection against Flipkart Sandbox OAuth service without exposing credentials.
     */
    public Map<String, Object> testConnection() {
        Map<String, Object> status = new HashMap<>();
        status.put("mode", config.getMode());
        status.put("environment", config.getEnvironment().toUpperCase());
        status.put("sellerId", StringUtils.hasText(config.getSellerId()) ? config.getSellerId() : "NOT_CONFIGURED");
        status.put("configured", config.isConfigured());

        if (config.isMockMode()) {
            status.put("connected", true);
            status.put("message", "Flipkart integration running in MOCK mode (pointing to " + config.getServiceUrl() + ")");
            return status;
        }

        if (!config.isConfigured()) {
            status.put("connected", false);
            status.put("message", "Missing FLIPKART_CLIENT_ID or FLIPKART_CLIENT_SECRET environment variables.");
            return status;
        }

        try {
            String token = getAccessToken();
            boolean hasToken = StringUtils.hasText(token);
            status.put("connected", hasToken);
            status.put("message", hasToken ? "Successfully authenticated with Flipkart Sandbox OAuth service." : "Authentication failed to return a valid token.");
        } catch (Exception e) {
            log.error("[FLIPKART-AUTH] Sandbox connection test failed: {}", e.getMessage());
            status.put("connected", false);
            status.put("message", "Sandbox authentication error: " + e.getMessage());
        }

        return status;
    }

    private String fetchFreshAccessToken() {
        String clientId = config.getClientId();
        String clientSecret = config.getClientSecret();
        String tokenUrl = config.getTokenUrl();
        String scope = StringUtils.hasText(config.getScope()) ? config.getScope() : "Seller_Api";

        log.info("[FLIPKART-AUTH] Requesting Sandbox access token from OAuth service (scope: {})", scope);

        String basicAuthHeader = "Basic " + Base64.getEncoder().encodeToString(
                (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)
        );

        try {
            FlipkartOAuthResponse response = webClient.get()
                    .uri(tokenUrl + "?grant_type=client_credentials&scope=" + scope)
                    .header(HttpHeaders.AUTHORIZATION, basicAuthHeader)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .retrieve()
                    .bodyToMono(FlipkartOAuthResponse.class)
                    .block(Duration.ofSeconds(10));

            if (response == null || !StringUtils.hasText(response.getAccessToken())) {
                String errorDesc = (response != null && response.getErrorDescription() != null)
                        ? response.getErrorDescription() : "Empty response from token service";
                log.error("[FLIPKART-AUTH] Token request failed: {}", errorDesc);
                throw new IllegalStateException("Flipkart Sandbox OAuth failed: " + errorDesc);
            }

            long expiresInSeconds = (response.getExpiresIn() != null && response.getExpiresIn() > 0)
                    ? response.getExpiresIn() : 21600; // Default 6 hours if unspecified

            this.cachedAccessToken = response.getAccessToken();
            this.tokenExpiryTime = Instant.now().plusSeconds(expiresInSeconds);

            log.info("[FLIPKART-AUTH] Access token obtained successfully (expires in {} seconds)", expiresInSeconds);
            return this.cachedAccessToken;

        } catch (WebClientResponseException e) {
            log.error("[FLIPKART-AUTH] Flipkart OAuth HTTP Error {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new IllegalStateException("Flipkart Sandbox authentication failed (HTTP " + e.getStatusCode() + "): " + e.getStatusText(), e);
        } catch (Exception e) {
            log.error("[FLIPKART-AUTH] Flipkart OAuth communication failure: {}", e.getMessage());
            throw new IllegalStateException("Flipkart Sandbox authentication failed: " + e.getMessage(), e);
        }
    }

    @Data
    public static class FlipkartOAuthResponse {
        @JsonProperty("access_token")
        private String accessToken;

        @JsonProperty("token_type")
        private String tokenType;

        @JsonProperty("expires_in")
        private Long expiresIn;

        @JsonProperty("scope")
        private String scope;

        @JsonProperty("error")
        private String error;

        @JsonProperty("error_description")
        private String errorDescription;
    }
}
