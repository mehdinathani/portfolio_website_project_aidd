-- Migration 006: Create certifications table
-- Purpose: Professional certifications and courses completed
-- Date: 2026-04-12

CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(200) NOT NULL,
    date_earned DATE NOT NULL,
    credential_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0 CHECK (order_index >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- URL validation
ALTER TABLE certifications ADD CONSTRAINT certifications_credential_url_check
    CHECK (credential_url IS NULL OR credential_url ~ '^https?://');

-- Indexes
CREATE INDEX idx_certifications_date ON certifications(date_earned DESC);

COMMENT ON TABLE certifications IS 'Professional certifications and courses';
