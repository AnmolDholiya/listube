CREATE TABLE sellers (
    id              BIGSERIAL PRIMARY KEY,
    business_name   VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    seller_id       BIGINT NOT NULL REFERENCES sellers(id),
    sku             VARCHAR(64) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    category        VARCHAR(255) NOT NULL,
    brand           VARCHAR(100),
    mrp             NUMERIC(10,2) NOT NULL,
    selling_price   NUMERIC(10,2) NOT NULL,
    stock           INTEGER NOT NULL DEFAULT 0,
    length_cm       NUMERIC(6,2),
    breadth_cm      NUMERIC(6,2),
    height_cm       NUMERIC(6,2),
    weight_kg       NUMERIC(6,3),
    version         INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_seller_sku UNIQUE (seller_id, sku)
);

CREATE TABLE product_images (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url       TEXT NOT NULL,
    display_order   SMALLINT NOT NULL DEFAULT 0,
    width_px        INTEGER,
    height_px       INTEGER,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE product_channel_extensions (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    channel         VARCHAR(20) NOT NULL,
    field_key       VARCHAR(100) NOT NULL,
    field_value     TEXT NOT NULL,
    UNIQUE (product_id, channel, field_key)
);

CREATE TABLE channel_required_fields (
    id              BIGSERIAL PRIMARY KEY,
    channel         VARCHAR(20) NOT NULL,
    category        VARCHAR(255) NOT NULL,
    required_field  VARCHAR(100) NOT NULL,
    UNIQUE (channel, category, required_field)
);

INSERT INTO channel_required_fields (channel, category, required_field) VALUES
('FLIPKART', 'Apparel > T-Shirts', 'hsn'),
('FLIPKART', 'Apparel > T-Shirts', 'procurement_type'),
('FLIPKART', 'Apparel > T-Shirts', 'shipping_provider');

CREATE TABLE listing_status (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    channel         VARCHAR(20) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    error_message   TEXT,
    last_synced_at  TIMESTAMP,
    UNIQUE (product_id, channel)
);
