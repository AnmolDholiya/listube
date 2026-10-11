package com.listingplatform.order;

import com.listingplatform.product.Product;
import com.listingplatform.product.ProductRepository;
import com.listingplatform.seller.Seller;
import com.listingplatform.seller.SellerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderConcurrencyTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private com.listingplatform.category.CategoryRepository categoryRepository;

    @Test
    void testConcurrentOrderDecrementsSafelyReachZeroWithoutNegativeStockOrEscapedExceptions() throws InterruptedException {
        // 1. Arrange: Ensure a seller exists and insert a product with stock = 10
        Seller seller = sellerRepository.findAll().stream().findFirst().orElseGet(() -> {
            Seller newSeller = Seller.builder()
                    .businessName("Concurrency Test Seller")
                    .email("concurrency-" + UUID.randomUUID() + "@test.com")
                    .passwordHash("dummyhash")
                    .build();
            return sellerRepository.save(newSeller);
        });

        com.listingplatform.category.Category testCat = categoryRepository.findByName("Apparel > T-Shirts")
                .orElseGet(() -> categoryRepository.save(new com.listingplatform.category.Category("Apparel > T-Shirts")));

        String testSku = "STRESS-CONC-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        Product product = Product.builder()
                .seller(seller)
                .sku(testSku)
                .title("Concurrent Stress Test Tee")
                .category(testCat)
                .brand("StressBrand")
                .mrp(new BigDecimal("999.00"))
                .sellingPrice(new BigDecimal("499.00"))
                .stock(10)
                .version(0)
                .build();

        Product savedProduct = productRepository.saveAndFlush(product);
        Long productId = savedProduct.getId();
        Long sellerId = seller.getId();

        // 2. Act: Prepare 10 concurrent threads, each decrementing quantity=1
        int concurrency = 10;
        ExecutorService executor = Executors.newFixedThreadPool(concurrency);
        CountDownLatch readyLatch = new CountDownLatch(concurrency);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(concurrency);

        List<Throwable> uncaughtExceptions = Collections.synchronizedList(new ArrayList<>());
        AtomicInteger successfulDecrements = new AtomicInteger(0);

        for (int i = 0; i < concurrency; i++) {
            executor.submit(() -> {
                readyLatch.countDown();
                try {
                    // Force true simultaneous execution
                    startLatch.await();
                    orderService.processOrder(testSku, sellerId, 1);
                    successfulDecrements.incrementAndGet();
                } catch (Throwable t) {
                    uncaughtExceptions.add(t);
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        // Wait until all 10 worker threads are initialized and waiting at startLatch
        boolean allReady = readyLatch.await(5, TimeUnit.SECONDS);
        assertTrue(allReady, "All 10 worker threads should be initialized and ready");

        // Fire all 10 threads simultaneously
        startLatch.countDown();

        // Wait for all threads to complete including retries
        boolean allDone = doneLatch.await(30, TimeUnit.SECONDS);
        assertTrue(allDone, "All concurrent tasks should complete within 30s timeout");
        executor.shutdown();

        // 3. Assert: No exceptions escaped uncaught after retries
        assertTrue(uncaughtExceptions.isEmpty(),
                "No exceptions should escape uncaught after retries, but encountered: " + uncaughtExceptions);
        assertEquals(concurrency, successfulDecrements.get(),
                "All 10 concurrent order decrements must succeed");

        // 4. Assert: Final stock is exactly 0 and version incremented 10 times
        Product finalProduct = productRepository.findById(productId).orElseThrow();
        assertEquals(0, finalProduct.getStock(), "Final stock must be exactly 0");
        assertTrue(finalProduct.getStock() >= 0, "No negative stock should ever occur");
        assertEquals(10, finalProduct.getVersion(),
                "Optimistic locking version must be incremented by each successful transaction to 10");

        // 5. Assert: 11th order attempting to decrement when stock is 0 throws InsufficientStockException
        assertThrows(InsufficientStockException.class, () ->
                orderService.processOrder(testSku, sellerId, 1));
    }
}
