package com.listingplatform.channel.flipkart;

import com.listingplatform.image.ProductImage;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductChannelExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class FlipkartMapperTest {

    private FlipkartMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new FlipkartMapper();
    }

    @Test
    @DisplayName("Assert output payload structure matches Flipkart v3 contract field-for-field with Package, Price, Fulfillment, Tax, Images nesting")
    @SuppressWarnings("unchecked")
    void testMapToFlipkartPayload_matchesV3ContractFieldForField_withExplicitExtensions() {
        // Arrange: Known canonical Product
        Product product = Product.builder()
                .id(42L)
                .sku("CANONICAL-POLO-001")
                .title("Premium Cotton Polo")
                .category("Apparel > Polo Shirts")
                .brand("AestheticApparel")
                .lengthCm(new BigDecimal("28.50"))
                .breadthCm(new BigDecimal("20.00"))
                .heightCm(new BigDecimal("4.20"))
                .weightKg(new BigDecimal("0.450"))
                .mrp(new BigDecimal("1299.00"))
                .sellingPrice(new BigDecimal("799.00"))
                .stock(50)
                .build();

        // Arrange: Ordered Product Images
        ProductImage image1 = ProductImage.builder()
                .id(101L)
                .product(product)
                .imageUrl("https://cdn.example.com/products/polo-front.jpg")
                .displayOrder(1)
                .build();
        ProductImage image2 = ProductImage.builder()
                .id(102L)
                .product(product)
                .imageUrl("https://cdn.example.com/products/polo-back.jpg")
                .displayOrder(2)
                .build();
        List<ProductImage> images = List.of(image1, image2);

        // Arrange: Channel Extensions for Flipkart
        ProductChannelExtension extProcurement = ProductChannelExtension.builder()
                .product(product)
                .channel("FLIPKART")
                .fieldKey("procurement_type")
                .fieldValue("EXPRESS")
                .build();
        ProductChannelExtension extShipping = ProductChannelExtension.builder()
                .product(product)
                .channel("FLIPKART")
                .fieldKey("shipping_provider")
                .fieldValue("SELLER")
                .build();
        ProductChannelExtension extHsn = ProductChannelExtension.builder()
                .product(product)
                .channel("FLIPKART")
                .fieldKey("hsn")
                .fieldValue("61051000")
                .build();
        List<ProductChannelExtension> extensions = List.of(extProcurement, extShipping, extHsn);

        // Act: Map canonical product to Flipkart v3 payload
        Map<String, Object> rootPayload = mapper.mapToFlipkartPayload(product, images, extensions);

        // Assert: Root wrapper structure
        assertNotNull(rootPayload, "Root payload must not be null");
        assertTrue(rootPayload.containsKey("listing"), "Root payload must contain 'listing' wrapper");
        assertEquals(1, rootPayload.size(), "Root payload must only contain the 'listing' top-level object");

        Map<String, Object> listing = (Map<String, Object>) rootPayload.get("listing");
        assertNotNull(listing, "'listing' object must not be null");
        assertEquals(5, listing.size(), "'listing' must have exactly 5 sub-sections: package, price, fulfillment, tax, images");
        assertTrue(listing.containsKey("package"), "Missing 'package' section");
        assertTrue(listing.containsKey("price"), "Missing 'price' section");
        assertTrue(listing.containsKey("fulfillment"), "Missing 'fulfillment' section");
        assertTrue(listing.containsKey("tax"), "Missing 'tax' section");
        assertTrue(listing.containsKey("images"), "Missing 'images' section");

        // Assert: 1. Package section field-for-field
        Map<String, Object> pkg = (Map<String, Object>) listing.get("package");
        assertNotNull(pkg, "'package' sub-map must not be null");
        assertEquals(4, pkg.size(), "'package' must contain exactly 4 dimension fields");
        assertEquals(new BigDecimal("28.50"), pkg.get("lengthCm"), "Package lengthCm mismatch");
        assertEquals(new BigDecimal("20.00"), pkg.get("breadthCm"), "Package breadthCm mismatch");
        assertEquals(new BigDecimal("4.20"), pkg.get("heightCm"), "Package heightCm mismatch");
        assertEquals(new BigDecimal("0.450"), pkg.get("weightKg"), "Package weightKg mismatch");

        // Assert: 2. Price section field-for-field
        Map<String, Object> price = (Map<String, Object>) listing.get("price");
        assertNotNull(price, "'price' sub-map must not be null");
        assertEquals(2, price.size(), "'price' must contain exactly 2 price fields");
        assertEquals(new BigDecimal("1299.00"), price.get("mrp"), "MRP mismatch");
        assertEquals(new BigDecimal("799.00"), price.get("sellingPrice"), "Selling price mismatch");

        // Assert: 3. Fulfillment section field-for-field
        Map<String, Object> fulfillment = (Map<String, Object>) listing.get("fulfillment");
        assertNotNull(fulfillment, "'fulfillment' sub-map must not be null");
        assertEquals(2, fulfillment.size(), "'fulfillment' must contain exactly 2 fields");
        assertEquals("EXPRESS", fulfillment.get("procurementType"), "Procurement type mismatch");
        assertEquals("SELLER", fulfillment.get("shippingProvider"), "Shipping provider mismatch");

        // Assert: 4. Tax section field-for-field
        Map<String, Object> tax = (Map<String, Object>) listing.get("tax");
        assertNotNull(tax, "'tax' sub-map must not be null");
        assertEquals(1, tax.size(), "'tax' must contain exactly 1 field: hsn");
        assertEquals("61051000", tax.get("hsn"), "HSN mismatch");

        // Assert: 5. Images section
        List<String> imageUrls = (List<String>) listing.get("images");
        assertNotNull(imageUrls, "'images' list must not be null");
        assertEquals(2, imageUrls.size(), "Image URLs count mismatch");
        assertEquals("https://cdn.example.com/products/polo-front.jpg", imageUrls.get(0));
        assertEquals("https://cdn.example.com/products/polo-back.jpg", imageUrls.get(1));
    }

    @Test
    @DisplayName("Assert FlipkartMapper applies default fallback values when extensions are omitted")
    @SuppressWarnings("unchecked")
    void testMapToFlipkartPayload_usesDefaultsWhenExtensionsMissing() {
        Product product = Product.builder()
                .sku("DEFAULT-SKU-002")
                .lengthCm(new BigDecimal("10.00"))
                .breadthCm(new BigDecimal("10.00"))
                .heightCm(new BigDecimal("10.00"))
                .weightKg(new BigDecimal("0.500"))
                .mrp(new BigDecimal("500.00"))
                .sellingPrice(new BigDecimal("400.00"))
                .build();

        Map<String, Object> rootPayload = mapper.mapToFlipkartPayload(product, List.of(), List.of());

        Map<String, Object> listing = (Map<String, Object>) rootPayload.get("listing");
        assertNotNull(listing);

        // Verify default fulfillment
        Map<String, Object> fulfillment = (Map<String, Object>) listing.get("fulfillment");
        assertEquals("REGULAR", fulfillment.get("procurementType"), "Default procurement type must be 'REGULAR'");
        assertEquals("FLIPKART", fulfillment.get("shippingProvider"), "Default shipping provider must be 'FLIPKART'");

        // Verify default tax
        Map<String, Object> tax = (Map<String, Object>) listing.get("tax");
        assertEquals("", tax.get("hsn"), "Default HSN must be empty string");

        // Verify images empty list
        List<String> images = (List<String>) listing.get("images");
        assertTrue(images.isEmpty(), "Images list should be empty when no images supplied");
    }
}
