-- Migration 009: Create leads table
-- Purpose: Contact form submissions and chatbot-captured leads
-- Date: 2026-04-12

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    message TEXT NOT NULL CHECK (LENGTH(message) > 0),
    category VARCHAR(30) NOT NULL DEFAULT 'other'
        CHECK (category IN ('job_offer', 'freelance', 'collaboration', 'chatbot_capture', 'other')),
    status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'reviewed', 'replied', 'archived')),
    source VARCHAR(20) NOT NULL DEFAULT 'contact_form'
        CHECK (source IN ('contact_form', 'chatbot')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Email format validation (basic)
ALTER TABLE leads ADD CONSTRAINT leads_email_format_check
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_category ON leads(category);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

COMMENT ON TABLE leads IS 'Contact form submissions and chatbot-captured leads';
