package com.listingplatform.product;

import com.listingplatform.common.SecurityUtils;
import com.listingplatform.product.dto.BulkUploadResponseDto;
import com.listingplatform.product.dto.ProductResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Products", description = "Canonical product catalog ingestion, pagination, and details")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Ingest multiple products from a CSV manifest file with row-level error reporting")
    @PostMapping(value = "/bulk-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BulkUploadResponseDto> bulkUpload(
            @RequestParam("file") MultipartFile file) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        BulkUploadResponseDto response = productService.processBulkUpload(file, sellerId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Retrieve paginated products for the authenticated seller with optional category and search filters")
    @GetMapping
    public ResponseEntity<Page<ProductResponseDto>> getProducts(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        Page<ProductResponseDto> products = productService.getProducts(sellerId, category, search, pageable);
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "Fetch full product canonical details and listing status by product ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable("id") Long id) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        ProductResponseDto product = productService.getProductById(id, sellerId);
        return ResponseEntity.ok(product);
    }

    @Operation(summary = "Delete all products in the catalog for the authenticated seller")
    @org.springframework.web.bind.annotation.DeleteMapping
    public ResponseEntity<java.util.Map<String, String>> deleteAllProducts() {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        productService.deleteAllProducts(sellerId);
        return ResponseEntity.ok(java.util.Map.of("message", "All catalog products successfully deleted"));
    }

    @Operation(summary = "Delete a specific product by ID")
    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, String>> deleteProduct(@PathVariable("id") Long id) {
        Long sellerId = SecurityUtils.getCurrentSellerId();
        productService.deleteProduct(id, sellerId);
        return ResponseEntity.ok(java.util.Map.of("message", "Product successfully deleted"));
    }
}
