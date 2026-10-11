package com.listingplatform.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductChannelExtensionRepository extends JpaRepository<ProductChannelExtension, Long> {

    List<ProductChannelExtension> findByProductIdAndChannel(Long productId, String channel);

    Optional<ProductChannelExtension> findByProductIdAndChannelAndFieldKey(Long productId, String channel, String fieldKey);
}
