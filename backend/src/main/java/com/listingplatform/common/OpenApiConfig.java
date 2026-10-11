package com.listingplatform.common;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Listing Platform API",
        version = "1.0.0",
        description = "Multi-channel e-commerce product catalog ingestion, channel attribute validation, and asynchronous Flipkart listing publish engine (Flipkart-first prototype)."
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Local Server")
    }
)
public class OpenApiConfig {
}
