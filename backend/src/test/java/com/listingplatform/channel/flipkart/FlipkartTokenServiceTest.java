package com.listingplatform.channel.flipkart;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class FlipkartTokenServiceTest {

    private FlipkartConfig config;
    private FlipkartTokenService tokenService;

    @BeforeEach
    void setUp() {
        config = new FlipkartConfig();
        config.setMode("SANDBOX");
        config.setEnvironment("sandbox");
        config.setClientId("test-client-id");
        config.setClientSecret("test-client-secret");
        config.setSellerId("test-seller-id");
        config.setTokenUrl("https://sandbox-api.flipkart.net/oauth-service/oauth/token");

        tokenService = new FlipkartTokenService(config);
    }

    @Test
    @DisplayName("Throws IllegalStateException when client ID or secret is missing")
    void testGetAccessToken_missingCredentials_throwsException() {
        config.setClientId(null);
        config.setClientSecret(null);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> tokenService.getAccessToken());
        assertTrue(ex.getMessage().contains("FLIPKART_CLIENT_ID"));
    }

    @Test
    @DisplayName("testConnection returns safe status in MOCK mode without making HTTP calls")
    void testTestConnection_mockMode() {
        config.setMode("MOCK");
        Map<String, Object> status = tokenService.testConnection();

        assertNotNull(status);
        assertEquals("MOCK", status.get("mode"));
        assertEquals(true, status.get("connected"));
        assertTrue(String.valueOf(status.get("message")).contains("MOCK mode"));
    }

    @Test
    @DisplayName("testConnection returns safe failure when credentials are missing in SANDBOX mode")
    void testTestConnection_unconfiguredSandbox() {
        config.setClientId(null);
        config.setClientSecret(null);

        Map<String, Object> status = tokenService.testConnection();

        assertNotNull(status);
        assertEquals(false, status.get("connected"));
        assertEquals(false, status.get("configured"));
        assertTrue(String.valueOf(status.get("message")).contains("Missing FLIPKART_CLIENT_ID"));
    }
}
