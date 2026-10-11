package com.listingplatform.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublishProductResultDto {

    private Long productId;
    private String sku;
    private String status;
    private String errorMessage;
}
