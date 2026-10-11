package com.listingplatform.image;

import com.listingplatform.image.dto.ImageValidationErrorDto;
import lombok.Getter;

import java.util.List;

@Getter
public class ImageValidationException extends RuntimeException {

    private final List<ImageValidationErrorDto> errors;

    public ImageValidationException(String message, List<ImageValidationErrorDto> errors) {
        super(message);
        this.errors = errors;
    }
}
