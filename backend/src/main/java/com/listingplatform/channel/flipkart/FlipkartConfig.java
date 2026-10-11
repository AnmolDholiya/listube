package com.listingplatform.channel.flipkart;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Slf4j
@Data
@Configuration
@ConfigurationProperties(prefix = "flipkart")
public class FlipkartConfig {

    /**
     * Operational mode: SANDBOX or MOCK. Defaults to SANDBOX.
     */
    private String mode = "SANDBOX";

    /**
     * Environment: sandbox or production. Defaults to sandbox.
     */
    private String environment = "sandbox";

    /**
     * Flipkart Self-Access OAuth Client ID (from Developer Portal).
     */
    private String clientId;

    /**
     * Flipkart Self-Access OAuth Client Secret (from Developer Portal).
     */
    private String clientSecret;

    /**
     * Flipkart Seller ID (Self-Access seller account ID).
     */
    private String sellerId;

    /**
     * Base URL for Flipkart Sandbox API (e.g. https://sandbox-api.flipkart.net).
     */
    private String baseUrl = "https://sandbox-api.flipkart.net";

    /**
     * OAuth Token endpoint for Flipkart Self-Access authentication.
     */
    private String tokenUrl = "https://sandbox-api.flipkart.net/oauth-service/oauth/token";

    /**
     * OAuth Scope for Seller API (standard default: Seller_Api).
     */
    private String scope = "Seller_Api";

    /**
     * Fallback URL for local mock service (when mode=MOCK).
     */
    private String serviceUrl = "http://localhost:8081";

    /**
     * Shared secret for inbound order webhooks.
     */
    private String webhookSecret = "flipkart-secret-webhook-key-2026";

    @PostConstruct
    public void validateConfiguration() {
        log.info("[FLIPKART-CONFIG] Initialized Flipkart Configuration: mode={}, environment={}, baseUrl={}, tokenUrl={}",
                mode, environment, baseUrl, tokenUrl);

        if (!"sandbox".equalsIgnoreCase(environment)) {
            log.warn("[FLIPKART-CONFIG] WARNING: Flipkart environment is configured as '{}'. Default sandbox safety guards active.", environment);
        }

        if ("SANDBOX".equalsIgnoreCase(mode)) {
            if (!StringUtils.hasText(clientId) || !StringUtils.hasText(clientSecret)) {
                log.warn("[FLIPKART-CONFIG] NOTICE: Flipkart Sandbox Client ID or Client Secret is not set in environment variables (FLIPKART_CLIENT_ID, FLIPKART_CLIENT_SECRET).");
            } else {
                log.info("[FLIPKART-CONFIG] Flipkart Client Credentials configured for sellerId: {}", 
                        StringUtils.hasText(sellerId) ? sellerId : "(not specified)");
            }
        }
    }

    public boolean isConfigured() {
        return StringUtils.hasText(clientId) && StringUtils.hasText(clientSecret);
    }

    public boolean isSandboxMode() {
        return "SANDBOX".equalsIgnoreCase(mode);
    }

    public boolean isMockMode() {
        return "MOCK".equalsIgnoreCase(mode);
    }
}
