package com.listingplatform.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    boolean existsBySellerIdAndSku(Long sellerId, String sku);

    Optional<Product> findBySellerIdAndSku(Long sellerId, String sku);

    Optional<Product> findFirstBySku(String sku);

    java.util.List<Product> findBySellerId(Long sellerId);
}
