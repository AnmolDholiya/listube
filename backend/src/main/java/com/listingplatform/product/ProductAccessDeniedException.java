package com.listingplatform.product;

public class ProductAccessDeniedException extends RuntimeException {

    public ProductAccessDeniedException(String message) {
        super(message);
    }
}
