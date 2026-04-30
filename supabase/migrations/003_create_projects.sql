-- Migration 003: Create projects table
-- Purpose: Portfolio projects with full details and display ordering
-- Date: 2026-04-12

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(300) NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    project_url TEXT,
    github_url TEXT,
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0 CHECK (order_index >= 0),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- URL validation
ALTER TABLE projects ADD CONSTRAINT projects_project_url_check
    CHECK (project_url IS NULL OR project_url ~ '^https?://');
ALTER TABLE projects ADD CONSTRAINT projects_github_url_check
    CHECK (github_url IS NULL OR github_url ~ '^https?://');
ALTER TABLE projects ADD CONSTRAINT projects_image_url_check
    CHECK (image_url IS NULL OR image_url ~ '^https?://');

-- Date validation
ALTER TABLE projects ADD CONSTRAINT projects_dates_check
    CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date);

-- Indexes
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_order ON projects(order_index ASC);
CREATE INDEX idx_projects_created ON projects(created_at DESC);

COMMENT ON TABLE projects IS 'Portfolio projects showcasing Mehdi''s work';
