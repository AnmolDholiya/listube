package com.listingplatform.channel;

import com.listingplatform.category.Category;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "channel_required_fields",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_channel_category_field", columnNames = {"channel", "category_id", "required_field"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChannelRequiredField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "channel", nullable = false, length = 50)
    private String channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "required_field", nullable = false, length = 100)
    private String requiredField;

    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }

    public static class ChannelRequiredFieldBuilder {
        public ChannelRequiredFieldBuilder category(String categoryName) {
            if (categoryName != null) {
                this.category = Category.builder().name(categoryName).build();
            }
            return this;
        }

        public ChannelRequiredFieldBuilder category(Category category) {
            this.category = category;
            return this;
        }
    }
}
