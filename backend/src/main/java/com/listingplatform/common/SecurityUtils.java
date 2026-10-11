package com.listingplatform.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Long getCurrentSellerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getCredentials() instanceof Long sellerId) {
            return sellerId;
        }
        throw new IllegalStateException("Unauthorized: No authenticated seller context found");
    }
}
