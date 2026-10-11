package com.listingplatform.channel.flipkart;

public class FlipkartServiceUnavailableException extends RuntimeException {

    public FlipkartServiceUnavailableException(String message) {
        super(message);
    }

    public FlipkartServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
