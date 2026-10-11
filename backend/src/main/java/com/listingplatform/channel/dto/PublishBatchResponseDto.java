package com.listingplatform.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublishBatchResponseDto {

    private UUID batchId;
    private String status;
    private Integer totalCount;
    private List<SkippedProductDto> skipped;
}
