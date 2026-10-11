package com.listingplatform.channel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ListingStatusRepository extends JpaRepository<ListingStatus, Long> {

    Optional<ListingStatus> findByProductIdAndChannel(Long productId, String channel);

    List<ListingStatus> findByProductIdInAndChannel(List<Long> productIds, String channel);

    List<ListingStatus> findByProductIdAndStatus(Long productId, Status status);

    default List<ListingStatus> findByBatchId(UUID batchId) {
        return List.of();
    }

    List<ListingStatus> findByProductId(Long productId);
}
