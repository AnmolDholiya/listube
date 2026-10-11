package com.listingplatform.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchListingResultDto {

    private Long productId;
    private String sku;
    private String channel;
    private String status;
    private String errorMessage;
    private LocalDateTime lastSyncedAt;
}
