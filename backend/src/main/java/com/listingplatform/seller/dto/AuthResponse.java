package com.listingplatform.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Long sellerId;
    private String email;
    private String businessName;

    public AuthResponse(String token) {
        this.token = token;
    }
}
