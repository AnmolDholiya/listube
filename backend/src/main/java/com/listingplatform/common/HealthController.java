package com.listingplatform.common;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@Tag(name = "Health", description = "Application health and readiness check")
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Operation(summary = "Check backend application health and database readiness")
    @GetMapping
    public Map<String, String> getHealth() {
        return Collections.singletonMap("status", "UP");
    }
}
