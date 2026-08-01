-- Migration 007: Create testimonials table
-- Purpose: Professional recommendations
-- Date: 2026-04-12

CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(100) NOT NULL,
    author_company VARCHAR(100),
    quote TEXT NOT NULL CHECK (LENGTH(quote) > 0),
    date DATE NOT NULL CHECK (date <= CURRENT_DATE),
    linkedin_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0 CHECK (order_index >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- URL validation
ALTER TABLE testimonials ADD CONSTRAINT testimonials_linkedin_url_check
    CHECK (linkedin_url IS NULL OR linkedin_url ~ '^https?://');

-- Indexes
CREATE INDEX idx_testimonials_date ON testimonials(date DESC);
CREATE INDEX idx_testimonials_order ON testimonials(order_index ASC);

COMMENT ON TABLE testimonials IS 'Professional recommendations and testimonials';
