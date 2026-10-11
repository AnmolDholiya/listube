package com.listingplatform.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageIssueDto {

    private Long imageId;
    private String imageUrl;
    private String reason;
}
