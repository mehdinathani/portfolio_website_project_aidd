-- 002_create_profiles.sql
-- Description: Create the profiles table for user information

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    headline VARCHAR(255),
    bio TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_picture_url TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    CONSTRAINT unique_email UNIQUE (email)
);

-- Add indices for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Function to ensure only one row exists (for a single profile)
CREATE OR REPLACE FUNCTION enforce_single_profile_row()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM profiles) >= 1 AND TG_OP = 'INSERT' THEN
        RAISE EXCEPTION 'Cannot insert more than one profile record.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_profile_trigger
BEFORE INSERT ON profiles
EXECUTE FUNCTION enforce_single_profile_row();
