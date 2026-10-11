package com.listingplatform.channel.flipkart;

import com.listingplatform.image.ProductImage;
import com.listingplatform.product.Product;
import com.listingplatform.product.ProductChannelExtension;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class FlipkartMapper {

    public Map<String, Object> mapToFlipkartPayload(
            Product product,
            List<ProductImage> images,
            List<ProductChannelExtension> extensions) {

        Map<String, String> extensionMap = extensions.stream()
                .collect(Collectors.toMap(
                        ProductChannelExtension::getFieldKey,
                        ProductChannelExtension::getFieldValue,
                        (v1, v2) -> v2
                ));

        Map<String, Object> listing = new HashMap<>();

        // Package dimensions & weight
        Map<String, Object> pkg = new HashMap<>();
        pkg.put("lengthCm", product.getLengthCm());
        pkg.put("breadthCm", product.getBreadthCm());
        pkg.put("heightCm", product.getHeightCm());
        pkg.put("weightKg", product.getWeightKg());
        listing.put("package", pkg);

        // Price
        Map<String, Object> price = new HashMap<>();
        price.put("mrp", product.getMrp());
        price.put("sellingPrice", product.getSellingPrice());
        listing.put("price", price);

        // Fulfillment
        Map<String, Object> fulfillment = new HashMap<>();
        fulfillment.put("procurementType", extensionMap.getOrDefault("procurement_type", "REGULAR"));
        fulfillment.put("shippingProvider", extensionMap.getOrDefault("shipping_provider", "FLIPKART"));
        listing.put("fulfillment", fulfillment);

        // Tax
        Map<String, Object> tax = new HashMap<>();
        tax.put("hsn", extensionMap.getOrDefault("hsn", ""));
        listing.put("tax", tax);

        // Images
        List<String> imageUrls = images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
        listing.put("images", imageUrls);

        Map<String, Object> wrapper = new HashMap<>();
        wrapper.put("listing", listing);
        return wrapper;
    }
}
