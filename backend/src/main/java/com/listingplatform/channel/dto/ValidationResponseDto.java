package com.listingplatform.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationResponseDto {

    private boolean valid;
    private boolean categoryConfigured;
    private List<String> missingFields;
    private List<ImageIssueDto> imageIssues;
}
