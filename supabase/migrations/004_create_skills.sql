-- Migration 004: Create skills table + project_skills junction
-- Purpose: Technical skills with category grouping and many-to-many relationship with projects
-- Date: 2026-04-12

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Languages', 'Frameworks', 'Libraries', 'Databases', 'Tools', 'Cloud', 'AI/ML')),
    proficiency INTEGER NOT NULL CHECK (proficiency BETWEEN 1 AND 5),
    icon_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0 CHECK (order_index >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case-insensitive unique constraint on skill name
CREATE UNIQUE INDEX idx_skills_name_unique ON skills(LOWER(name));

-- Icon URL validation
ALTER TABLE skills ADD CONSTRAINT skills_icon_url_check
    CHECK (icon_url IS NULL OR icon_url ~ '^https?://');

-- Indexes
CREATE INDEX idx_skills_category ON skills(category, order_index ASC);
CREATE INDEX idx_skills_proficiency ON skills(proficiency DESC);

-- Junction table: projects <-> skills (many-to-many)
CREATE TABLE project_skills (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, skill_id)
);

-- Indexes for efficient lookups
CREATE INDEX idx_project_skills_project ON project_skills(project_id);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);

COMMENT ON TABLE skills IS 'Technical skills with category and proficiency';
COMMENT ON TABLE project_skills IS 'Junction table linking projects to skills used';
