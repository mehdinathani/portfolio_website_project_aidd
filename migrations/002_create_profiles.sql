-- Migration 002: Create profiles table
-- Purpose: Store Mehdi's biographical data, contact info, social links (single-row table)
-- Date: 2026-04-12

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    headline VARCHAR(200) NOT NULL,
    bio TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    resume_url TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce single-row constraint via trigger function
CREATE OR REPLACE FUNCTION profiles_single_row_check()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM profiles) >= 1 THEN
        RAISE EXCEPTION 'profiles table can only contain one row';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_single_row_trigger
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION profiles_single_row_check();

-- Auto-update updated_at on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Validation: URLs should be valid HTTP/HTTPS format (optional fields)
ALTER TABLE profiles ADD CONSTRAINT profiles_linkedin_url_check
    CHECK (linkedin_url IS NULL OR linkedin_url ~ '^https?://');
ALTER TABLE profiles ADD CONSTRAINT profiles_github_url_check
    CHECK (github_url IS NULL OR github_url ~ '^https?://');
ALTER TABLE profiles ADD CONSTRAINT profiles_twitter_url_check
    CHECK (twitter_url IS NULL OR twitter_url ~ '^https?://');
ALTER TABLE profiles ADD CONSTRAINT profiles_resume_url_check
    CHECK (resume_url IS NULL OR resume_url ~ '^https?://');
ALTER TABLE profiles ADD CONSTRAINT profiles_profile_image_url_check
    CHECK (profile_image_url IS NULL OR profile_image_url ~ '^https?://');

COMMENT ON TABLE profiles IS 'Mehdi''s biographical data — single row only';
