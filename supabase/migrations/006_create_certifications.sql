-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date_earned DATE NOT NULL,
    credential_url TEXT,
    badge_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for certifications
CREATE INDEX IF NOT EXISTS idx_certifications_date ON certifications(date_earned DESC);
