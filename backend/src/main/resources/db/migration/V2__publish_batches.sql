CREATE TABLE publish_batches (
    id               BIGSERIAL PRIMARY KEY,
    batch_id         UUID NOT NULL UNIQUE,
    seller_id        BIGINT NOT NULL REFERENCES sellers(id),
    channel          VARCHAR(20) NOT NULL,
    total_count      INTEGER NOT NULL,
    completed_count  INTEGER NOT NULL DEFAULT 0,
    status           VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message    TEXT,
    created_at       TIMESTAMP NOT NULL DEFAULT now(),
    completed_at     TIMESTAMP
);

ALTER TABLE listing_status ADD COLUMN batch_id UUID NULL;
