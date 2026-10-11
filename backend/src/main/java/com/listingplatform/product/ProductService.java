package com.listingplatform.product;

import com.listingplatform.product.dto.BulkUploadResponseDto;
import com.listingplatform.product.dto.ProductResponseDto;
import com.listingplatform.product.dto.RowErrorDto;
import com.listingplatform.seller.Seller;
import com.listingplatform.seller.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import com.listingplatform.category.Category;
import com.listingplatform.category.CategoryRepository;
import com.listingplatform.channel.ListingStatus;
import com.listingplatform.channel.ListingStatusRepository;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final ProductAccessService productAccessService;
    private final ListingStatusRepository listingStatusRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public BulkUploadResponseDto processBulkUpload(MultipartFile file, Long sellerId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file is required and cannot be empty");
        }

        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found with ID: " + sellerId));

        List<Product> productsToSave = new ArrayList<>();
        List<RowErrorDto> failedRows = new ArrayList<>();
        Set<String> batchSkus = new HashSet<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            // Strip leading BOM if present
            reader.mark(1);
            if (reader.read() != 0xFEFF) {
                reader.reset();
            }

            CSVFormat format = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreHeaderCase(true)
                    .setTrim(true)
                    .build();

            try (CSVParser csvParser = new CSVParser(reader, format)) {
                Map<String, Integer> headerMap = csvParser.getHeaderMap();
                if (headerMap == null || headerMap.isEmpty()) {
                    throw new IllegalArgumentException("CSV file missing header row");
                }

                long recordIndex = 1; // Row 1 is header
                for (CSVRecord record : csvParser) {
                    recordIndex++;
                    int rowNum = (int) recordIndex;
                    String sku = getFieldValue(record, "sku");

                    try {
                        // Validate SKU
                        if (!StringUtils.hasText(sku)) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "SKU is required"));
                            continue;
                        }
                        sku = sku.trim();

                        if (batchSkus.contains(sku.toLowerCase())) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "Duplicate SKU '" + sku + "' in CSV upload"));
                            continue;
                        }

                        if (productRepository.existsBySellerIdAndSku(sellerId, sku)) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "SKU '" + sku + "' already exists for this seller"));
                            continue;
                        }

                        // Validate Title
                        String title = getFieldValue(record, "title");
                        if (!StringUtils.hasText(title)) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "Title is required"));
                            continue;
                        }

                        // Validate Category
                        String category = getFieldValue(record, "category");
                        if (!StringUtils.hasText(category)) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "Category is required"));
                            continue;
                        }

                        // Validate MRP
                        String mrpStr = getFieldValue(record, "mrp");
                        if (!StringUtils.hasText(mrpStr)) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "MRP is required"));
                            continue;
                        }
                        BigDecimal mrp;
                        try {
                            mrp = new BigDecimal(mrpStr.trim());
                            if (mrp.compareTo(BigDecimal.ZERO) < 0) {
                                failedRows.add(new RowErrorDto(rowNum, sku, "MRP must be non-negative"));
                                continue;
                            }
                        } catch (NumberFormatException ex) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "Invalid decimal format for MRP: " + mrpStr));
                            continue;
                        }

                        // Validate Selling Price
                        String sellingPriceStr = getFieldValue(record, "sellingPrice");
                        if (!StringUtils.hasText(sellingPriceStr)) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "Selling price is required"));
                            continue;
                        }
                        BigDecimal sellingPrice;
                        try {
                            sellingPrice = new BigDecimal(sellingPriceStr.trim());
                            if (sellingPrice.compareTo(BigDecimal.ZERO) < 0) {
                                failedRows.add(new RowErrorDto(rowNum, sku, "Selling price must be non-negative"));
                                continue;
                            }
                        } catch (NumberFormatException ex) {
                            failedRows.add(new RowErrorDto(rowNum, sku, "Invalid decimal format for selling price: " + sellingPriceStr));
                            continue;
                        }

                        // Validate Stock (default 0)
                        String stockStr = getFieldValue(record, "stock");
                        int stock = 0;
                        if (StringUtils.hasText(stockStr)) {
                            try {
                                stock = Integer.parseInt(stockStr.trim());
                                if (stock < 0) {
                                    failedRows.add(new RowErrorDto(rowNum, sku, "Stock must be a non-negative integer"));
                                    continue;
                                }
                            } catch (NumberFormatException ex) {
                                failedRows.add(new RowErrorDto(rowNum, sku, "Invalid integer format for stock: " + stockStr));
                                continue;
                            }
                        }

                        // Optional Fields
                        String description = getFieldValue(record, "description");
                        String brand = getFieldValue(record, "brand");
                        BigDecimal lengthCm = parseOptionalDecimal(record, "lengthCm", rowNum, sku, failedRows);
                        BigDecimal breadthCm = parseOptionalDecimal(record, "breadthCm", rowNum, sku, failedRows);
                        BigDecimal heightCm = parseOptionalDecimal(record, "heightCm", rowNum, sku, failedRows);
                        BigDecimal weightKg = parseOptionalDecimal(record, "weightKg", rowNum, sku, failedRows);

                        if (failedRows.size() > 0 && failedRows.get(failedRows.size() - 1).getRow() == rowNum) {
                            // Failure added by optional decimal parser
                            continue;
                        }

                        Category cat = categoryRepository.findByName(category.trim())
                                .orElseGet(() -> categoryRepository.save(new Category(category.trim())));

                        Product product = Product.builder()
                                .seller(seller)
                                .sku(sku)
                                .title(title.trim())
                                .description(StringUtils.hasText(description) ? description.trim() : null)
                                .category(cat)
                                .brand(StringUtils.hasText(brand) ? brand.trim() : null)
                                .mrp(mrp)
                                .sellingPrice(sellingPrice)
                                .stock(stock)
                                .lengthCm(lengthCm)
                                .breadthCm(breadthCm)
                                .heightCm(heightCm)
                                .weightKg(weightKg)
                                .build();

                        productsToSave.add(product);
                        batchSkus.add(sku.toLowerCase());

                    } catch (Exception ex) {
                        failedRows.add(new RowErrorDto(rowNum, sku, "Unexpected error processing row: " + ex.getMessage()));
                    }
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse CSV file: " + e.getMessage(), e);
        }

        if (!productsToSave.isEmpty()) {
            productRepository.saveAll(productsToSave);
        }

        return new BulkUploadResponseDto(productsToSave.size(), failedRows);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getProducts(Long sellerId, String category, String search, Pageable pageable) {
        String cleanCategory = StringUtils.hasText(category) ? category.trim().toLowerCase() : null;
        String cleanSearch = StringUtils.hasText(search) ? search.trim().toLowerCase() : null;

        org.springframework.data.jpa.domain.Specification<Product> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("seller").get("id"), sellerId));

            if (cleanCategory != null) {
                predicates.add(cb.equal(cb.lower(root.join("category").get("name")), cleanCategory));
            }

            if (cleanSearch != null) {
                String pattern = "%" + cleanSearch + "%";
                jakarta.persistence.criteria.Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                jakarta.persistence.criteria.Predicate skuMatch = cb.like(cb.lower(root.get("sku")), pattern);
                predicates.add(cb.or(titleMatch, skuMatch));
            }

            query.orderBy(cb.desc(root.get("id")));
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<Product> products = productRepository.findAll(spec, pageable);
        List<Long> productIds = products.getContent().stream().map(Product::getId).toList();

        Map<Long, String> statusMap = Map.of();
        Map<Long, String> errorMap = Map.of();
        if (!productIds.isEmpty()) {
            List<ListingStatus> statuses = listingStatusRepository.findByProductIdInAndChannel(productIds, "FLIPKART");
            statusMap = statuses.stream()
                    .collect(Collectors.toMap(
                            ls -> ls.getProduct().getId(),
                            ls -> ls.getStatus() != null ? ls.getStatus().name() : "DRAFT",
                            (a, b) -> a
                    ));
            errorMap = statuses.stream()
                    .filter(ls -> ls.getErrorMessage() != null)
                    .collect(Collectors.toMap(
                            ls -> ls.getProduct().getId(),
                            ListingStatus::getErrorMessage,
                            (a, b) -> a
                    ));
        }

        final Map<Long, String> finalStatusMap = statusMap;
        final Map<Long, String> finalErrorMap = errorMap;
        return products.map(p -> ProductResponseDto.fromEntity(
                p,
                finalStatusMap.getOrDefault(p.getId(), "DRAFT"),
                finalErrorMap.get(p.getId())
        ));
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long productId, Long sellerId) {
        Product product = productAccessService.verifyOwnership(productId, sellerId);
        Optional<ListingStatus> listingStatusOpt = listingStatusRepository.findByProductIdAndChannel(productId, "FLIPKART");
        String status = listingStatusOpt
                .map(ls -> ls.getStatus() != null ? ls.getStatus().name() : "DRAFT")
                .orElse("DRAFT");
        String errorMessage = listingStatusOpt.map(ListingStatus::getErrorMessage).orElse(null);
        return ProductResponseDto.fromEntity(product, status, errorMessage);
    }

    @Transactional
    public void deleteAllProducts(Long sellerId) {
        List<Product> products = productRepository.findBySellerId(sellerId);
        if (!products.isEmpty()) {
            productRepository.deleteAll(products);
        }
    }

    @Transactional
    public void deleteProduct(Long productId, Long sellerId) {
        Product product = productAccessService.verifyOwnership(productId, sellerId);
        productRepository.delete(product);
    }

    private String getFieldValue(CSVRecord record, String fieldName) {
        if (record.isMapped(fieldName)) {
            return record.get(fieldName);
        }
        // Normalize search: strip underscores, spaces, hyphens, and lowercase
        String targetNorm = fieldName.replaceAll("[_\\-\\s]", "").toLowerCase();
        for (String header : record.getParser().getHeaderNames()) {
            String headerNorm = header.replaceAll("[_\\-\\s]", "").toLowerCase();
            if (headerNorm.equals(targetNorm)) {
                return record.get(header);
            }
        }
        return null;
    }

    private BigDecimal parseOptionalDecimal(CSVRecord record, String fieldName, int rowNum, String sku, List<RowErrorDto> failedRows) {
        String val = getFieldValue(record, fieldName);
        if (!StringUtils.hasText(val)) {
            return null;
        }
        try {
            BigDecimal dec = new BigDecimal(val.trim());
            if (dec.compareTo(BigDecimal.ZERO) < 0) {
                failedRows.add(new RowErrorDto(rowNum, sku, fieldName + " must be non-negative"));
                return null;
            }
            return dec;
        } catch (NumberFormatException ex) {
            failedRows.add(new RowErrorDto(rowNum, sku, "Invalid decimal format for " + fieldName + ": " + val));
            return null;
        }
    }
}
