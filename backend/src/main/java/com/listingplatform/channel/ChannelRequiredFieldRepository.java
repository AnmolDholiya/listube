package com.listingplatform.channel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelRequiredFieldRepository extends JpaRepository<ChannelRequiredField, Long> {

    @Query("SELECT crf FROM ChannelRequiredField crf WHERE crf.channel = :channel AND LOWER(crf.category.name) = LOWER(:category)")
    List<ChannelRequiredField> findByChannelAndCategory(@Param("channel") String channel, @Param("category") String category);

    @Query("SELECT crf FROM ChannelRequiredField crf WHERE crf.channel = :channel AND crf.category.id = :categoryId")
    List<ChannelRequiredField> findByChannelAndCategoryId(@Param("channel") String channel, @Param("categoryId") Long categoryId);
}
