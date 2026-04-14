# Data Model: Mehdi AI Portfolio Website

**Date**: 2026-04-10
**Feature**: master
**Phase**: 1 (Design & Contracts)
**Database**: Supabase PostgreSQL with pgvector extension

---

## Entity Relationship Diagram

```
┌─────────────┐
│  profiles   │ (1 row - Mehdi's bio)
└─────────────┘

┌─────────────┐       ┌──────────────────┐
│  projects   │───────│  project_skills  │ (junction table)
└─────────────┘       └──────────────────┘
                              │
                              │
                       ┌─────────────┐
                       │   skills    │
                       └─────────────┘

┌────────────────┐
│ testimonials   │
└────────────────┘

┌────────────────────┐
│ knowledge_base     │ (RAG embeddings)
└────────────────────┘
```

---

## Table Definitions

### 1. `profiles` Table

**Purpose**: Stores Mehdi's biographical data, contact information, and social links. Single-row table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `full_name` | VARCHAR(100) | NOT NULL | Full name (e.g., "Mehdi Nathani") |
| `headline` | VARCHAR(200) | NOT NULL | Professional headline (e.g., "Software Engineer | Finance-to-Tech Transition") |
| `bio` | TEXT | NOT NULL | Detailed biography/career narrative |
| `email` | VARCHAR(100) | NOT NULL | Contact email |
| `phone` | VARCHAR(20) | NULL | Contact phone (optional) |
| `location` | VARCHAR(100) | NULL | City, Country |
| `linkedin_url` | TEXT | NULL | LinkedIn profile URL |
| `github_url` | TEXT | NULL | GitHub profile URL |
| `twitter_url` | TEXT | NULL | Twitter/X profile URL |
| `resume_url` | TEXT | NULL | PDF resume URL |
| `profile_image_url` | TEXT | NULL | Profile photo URL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- URLs must be valid HTTP/HTTPS URLs
- Email must be valid format
- Only ONE row allowed (enforce via application logic or trigger)

**Indexes**:
- None needed (single-row table)

---

### 2. `projects` Table

**Purpose**: Portfolio projects showcasing Mehdi's work.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `title` | VARCHAR(200) | NOT NULL | Project title |
| `description` | TEXT | NOT NULL | Detailed project description |
| `short_description` | VARCHAR(300) | NOT NULL | Brief description for listing views |
| `project_url` | TEXT | NULL | Live project URL (if deployed) |
| `github_url` | TEXT | NULL | GitHub repository URL |
| `image_url` | TEXT | NULL | Project thumbnail/hero image URL |
| `featured` | BOOLEAN | NOT NULL, DEFAULT false | Whether to highlight on homepage |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0 | Display order (lower = first) |
| `start_date` | DATE | NULL | Project start date |
| `end_date` | DATE | NULL | Project completion date |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- URLs must be valid HTTP/HTTPS URLs
- `order_index` must be non-negative
- `end_date` must be >= `start_date` (if both provided)

**Indexes**:
- `idx_projects_featured` ON `projects(featured)` - Filter featured projects
- `idx_projects_order` ON `projects(order_index)` - Sort by display order
- `idx_projects_created` ON `projects(created_at DESC)` - Recent projects

---

### 3. `skills` Table

**Purpose**: Technical skills with categorization and proficiency levels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL | Skill name (e.g., "Python", "React", "PostgreSQL") |
| `category` | VARCHAR(50) | NOT NULL | Category (e.g., "Languages", "Frameworks", "Databases", "Tools", "Cloud") |
| `proficiency` | INTEGER | NOT NULL, CHECK (proficiency BETWEEN 1 AND 5) | Proficiency level (1=Beginner, 5=Expert) |
| `icon_url` | TEXT | NULL | Skill icon image URL (optional) |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0 | Display order within category |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Validation Rules**:
- `proficiency` must be 1-5
- `category` must be from predefined list: ["Languages", "Frameworks", "Libraries", "Databases", "Tools", "Cloud", "AI/ML"]
- `name` must be unique (case-insensitive)

**Indexes**:
- `idx_skills_category` ON `skills(category, order_index)` - Group by category
- `idx_skills_proficiency` ON `skills(proficiency DESC)` - Sort by proficiency
- `idx_skills_name` ON `skills(LOWER(name))` - Case-insensitive unique lookup

---

### 4. `project_skills` Table (Junction)

**Purpose**: Links projects to skills used (many-to-many relationship).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `project_id` | UUID | NOT NULL, FK → projects(id) ON DELETE CASCADE | Project reference |
| `skill_id` | UUID | NOT NULL, FK → skills(id) ON DELETE CASCADE | Skill reference |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Primary Key**: `(project_id, skill_id)` (composite key)

**Validation Rules**:
- Composite uniqueness (no duplicate project-skill links)

**Indexes**:
- `idx_project_skills_project` ON `project_skills(project_id)` - Fetch skills for project
- `idx_project_skills_skill` ON `project_skills(skill_id)` - Fetch projects using skill

---

### 5. `testimonials` Table

**Purpose**: Professional recommendations and testimonials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `author_name` | VARCHAR(100) | NOT NULL | Testimonial author |
| `author_role` | VARCHAR(100) | NOT NULL | Author's role/title |
| `author_company` | VARCHAR(100) | NULL | Author's company |
| `quote` | TEXT | NOT NULL | Testimonial quote |
| `date` | DATE | NOT NULL | Date of testimonial |
| `linkedin_url` | TEXT | NULL | Author's LinkedIn (for verification) |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Validation Rules**:
- `quote` must not be empty
- `date` must be in the past
- URLs must be valid HTTP/HTTPS URLs

**Indexes**:
- `idx_testimonials_date` ON `testimonials(date DESC)` - Sort by date
- `idx_testimonials_order` ON `testimonials(order_index)` - Display order

---

### 6. `knowledge_base` Table (RAG Embeddings)

**Purpose**: Stores Mehdi's knowledge content + vector embeddings for RAG chatbot.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `content` | TEXT | NOT NULL | Knowledge chunk (resume section, project detail, narrative) |
| `source` | VARCHAR(50) | NOT NULL | Source type (e.g., "resume", "project", "bio", "skills", "career_narrative") |
| `source_id` | UUID | NULL | Reference to source record (project_id, etc.) |
| `metadata` | JSONB | NOT NULL, DEFAULT '{}'::jsonb | Additional metadata (tags, context, priority) |
| `embedding` | vector(768) | NOT NULL | Gemini text embedding (768 dimensions) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `content` must be 50-2000 characters (chunk size for RAG)
- `source` must be from predefined list: ["resume", "project", "bio", "skills", "career_narrative", "testimonial"]
- `embedding` dimension must be 768 (Gemini embedding model)

**Indexes**:
- `idx_knowledge_base_embedding` ON `knowledge_base USING hnsw (embedding vector_cosine_ops)` - HNSW index for similarity search
- `idx_knowledge_base_source` ON `knowledge_base(source)` - Filter by source type
- `idx_knowledge_base_metadata` ON `knowledge_base USING GIN (metadata)` - JSONB queries

**Similarity Search Query**:
```sql
SELECT content, metadata, 1 - (embedding <=> $1) AS similarity
FROM knowledge_base
ORDER BY embedding <=> $1
LIMIT 5;
```

---

## State Transitions

### Content Lifecycle

```
DRAFT → PUBLISHED → ARCHIVED
```

- **DRAFT**: Content created, not yet visible on site
- **PUBLISHED**: Content visible on site (default state)
- **ARCHIVED**: Content hidden but retained in database

**Implementation**: Add `status` column to `projects`, `testimonials` tables (VARCHAR, NOT NULL, DEFAULT 'published')

**Status values**: CHECK (status IN ('draft', 'published', 'archived'))

---

## Validation Rules Summary

### Global Constraints
1. All URLs: Valid HTTP/HTTPS format (use PostgreSQL CHECK with regex)
2. All timestamps: Auto-managed (created_at, updated_at)
3. All `order_index` fields: Non-negative integers

### Business Rules
1. **Zero Hardcoded Data (Principle VIII)**: All content MUST be in Supabase, no static files
2. **RAG Grounding (Principle X)**: Chatbot responses MUST cite `knowledge_base.content` records
3. **Profile Uniqueness**: Only ONE row in `profiles` table

---

## Migration Strategy

### Migration 001: Initial Schema
- Create `profiles` table
- Create constraint for single-row profile

### Migration 002: Projects Table
- Create `projects` table with indexes
- Add featured/order_index columns

### Migration 003: Skills Table
- Create `skills` table with category/proficiency constraints
- Create `project_skills` junction table

### Migration 004: Testimonials Table
- Create `testimonials` table with indexes

### Migration 005: Knowledge Base (pgvector)
- Enable `vector` extension
- Create `knowledge_base` table with HNSW index
- Add metadata JSONB constraints

### Seed Data Script
- Populate `profiles` with Mehdi's bio
- Populate `projects` with 5-10 portfolio projects
- Populate `skills` with 20-30 technical skills
- Populate `testimonials` with 3-5 recommendations
- Populate `knowledge_base` with embedded content (via Gemini API)

---

**Status**: ✅ COMPLETE - All entities, relationships, and constraints defined
