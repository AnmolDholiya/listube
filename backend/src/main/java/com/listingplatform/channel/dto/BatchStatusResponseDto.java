package com.listingplatform.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchStatusResponseDto {

    private UUID batchId;
    private String status;
    private Integer totalCount;
    private Integer completedCount;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private List<BatchListingResultDto> results;
}
