package com.listingplatform.product;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductAccessService {

    private final ProductRepository productRepository;

    public Product verifyOwnership(Long productId, Long sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));

        if (!product.getSeller().getId().equals(sellerId)) {
            throw new ProductAccessDeniedException("Access denied: You do not own product ID " + productId);
        }

        return product;
    }
}
