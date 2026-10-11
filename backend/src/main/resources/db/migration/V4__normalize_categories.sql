-- V4: Idempotent migration to align schema with Supabase 8-table architecture

DO $$
BEGIN
    -- 1. Ensure categories table exists
    CREATE TABLE IF NOT EXISTS categories (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

    -- 2. Insert fallback category
    INSERT INTO categories (name) VALUES ('Uncategorized') ON CONFLICT (name) DO NOTHING;

    -- 3. Ensure category_id exists on products
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE products ADD COLUMN category_id BIGINT;
        UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Uncategorized' LIMIT 1);
        ALTER TABLE products ALTER COLUMN category_id SET NOT NULL;
        ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id);
    END IF;

    -- 4. Drop legacy category text column if present
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'category'
    ) THEN
        ALTER TABLE products DROP COLUMN category;
    END IF;

    -- 5. Ensure category_id exists on channel_required_fields
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'channel_required_fields' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE channel_required_fields ADD COLUMN category_id BIGINT;
        UPDATE channel_required_fields SET category_id = (SELECT id FROM categories WHERE name = 'Uncategorized' LIMIT 1);
        ALTER TABLE channel_required_fields ALTER COLUMN category_id SET NOT NULL;
        ALTER TABLE channel_required_fields ADD CONSTRAINT fk_channel_required_fields_category FOREIGN KEY (category_id) REFERENCES categories(id);
    END IF;

    -- 6. Drop legacy category text column on channel_required_fields if present
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'channel_required_fields' AND column_name = 'category'
    ) THEN
        ALTER TABLE channel_required_fields DROP CONSTRAINT IF EXISTS channel_required_fields_channel_category_required_field_key;
        ALTER TABLE channel_required_fields DROP CONSTRAINT IF EXISTS uq_channel_category_required_field;
        ALTER TABLE channel_required_fields DROP COLUMN category;
        ALTER TABLE channel_required_fields ADD CONSTRAINT uq_channel_category_required_field UNIQUE (channel, category_id, required_field);
    END IF;

    -- 7. Ensure gst_number exists on sellers
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'sellers' AND column_name = 'gst_number'
    ) THEN
        ALTER TABLE sellers ADD COLUMN gst_number VARCHAR(20);
    END IF;

    ALTER TABLE sellers ALTER COLUMN password_hash DROP NOT NULL;
END $$;
