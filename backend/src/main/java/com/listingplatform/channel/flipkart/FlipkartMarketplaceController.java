package com.listingplatform.channel.flipkart;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@Tag(name = "Marketplaces", description = "Flipkart Self-Access Sandbox connection and status endpoints")
@RestController
@RequestMapping("/api/marketplaces/flipkart")
@RequiredArgsConstructor
public class FlipkartMarketplaceController {

    private final FlipkartTokenService tokenService;

    @Operation(summary = "Get Flipkart Sandbox connection and configuration status")
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(tokenService.testConnection());
    }

    @Operation(summary = "Test authentication and reachability with Flipkart Sandbox API")
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testConnection() {
        return ResponseEntity.ok(tokenService.testConnection());
    }
}
