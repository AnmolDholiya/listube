package com.listingplatform.order;

import com.listingplatform.product.Product;
import com.listingplatform.product.ProductNotFoundException;
import com.listingplatform.product.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final ProductRepository productRepository;
    private final ApplicationEventPublisher eventPublisher;

    public OrderService(ProductRepository productRepository, ApplicationEventPublisher eventPublisher) {
        this.productRepository = productRepository;
        this.eventPublisher = eventPublisher;
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 10,
            backoff = @Backoff(delay = 50, multiplier = 2, random = true)
    )
    @Transactional
    public void processOrder(String sku, Long sellerId, int quantity) {
        processOrderInternal(sku, sellerId, quantity, null);
    }

    @Retryable(
            retryFor = ObjectOptimisticLockingFailureException.class,
            maxAttempts = 10,
            backoff = @Backoff(delay = 50, multiplier = 2, random = true)
    )
    @Transactional
    public void processOrder(String sku, Long sellerId, int quantity, String originatingChannel) {
        processOrderInternal(sku, sellerId, quantity, originatingChannel);
    }

    private void processOrderInternal(String sku, Long sellerId, int quantity, String originatingChannel) {
        log.info("Processing order decrement: sku={}, sellerId={}, quantity={}, originatingChannel={}",
                sku, sellerId, quantity, originatingChannel);

        Product product = productRepository.findBySellerIdAndSku(sellerId, sku)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found with SKU '" + sku + "' for seller ID " + sellerId));

        int previousStock = product.getStock();
        if (quantity > previousStock) {
            log.warn("Insufficient stock for SKU '{}' (sellerId: {}): requested {}, available {}",
                    sku, sellerId, quantity, previousStock);
            throw new InsufficientStockException(
                    "Insufficient stock for SKU '" + sku + "': requested " + quantity + ", available " + previousStock);
        }

        int newStock = previousStock - quantity;
        product.setStock(newStock);
        productRepository.saveAndFlush(product);

        eventPublisher.publishEvent(new InventoryChangedEvent(
                product.getId(),
                sku,
                sellerId,
                newStock,
                previousStock,
                originatingChannel
        ));

        log.info("Successfully decremented stock for SKU '{}' (sellerId: {}): {} -> {} (new version: {})",
                sku, sellerId, previousStock, newStock, product.getVersion());
    }
}
