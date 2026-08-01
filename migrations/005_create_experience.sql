-- Migration 005: Create experience table
-- Purpose: Work history timeline entries
-- Date: 2026-04-12

CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    responsibilities TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0 CHECK (order_index >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Date validation: end_date must be >= start_date if both provided
ALTER TABLE experience ADD CONSTRAINT experience_dates_check
    CHECK (end_date IS NULL OR end_date >= start_date);

-- Indexes
CREATE INDEX idx_experience_dates ON experience(start_date DESC);
CREATE INDEX idx_experience_order ON experience(order_index ASC);

COMMENT ON TABLE experience IS 'Work history timeline entries';
