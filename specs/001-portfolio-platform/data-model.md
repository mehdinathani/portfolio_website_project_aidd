# Data Model: Portfolio & Lead Generation Platform

**Date**: 2026-04-12
**Feature**: 001-portfolio-platform
**Phase**: 1 (Design & Contracts)
**Database**: Supabase PostgreSQL with pgvector extension

---

## Entity Relationship Diagram

```
┌─────────────┐
│  profiles   │  (1 row — Mehdi's bio)
└─────────────┘

┌─────────────┐       ┌──────────────────┐
│  projects   │───────│  project_skills  │  (junction)
└─────────────┘       └────────┬─────────┘
                               │
                        ┌──────┴────────┐
                        │    skills     │
                        └───────────────┘

┌────────────────┐
│  experience    │
└────────────────┘

┌────────────────┐
│ certifications │
└────────────────┘

┌────────────────┐
│ testimonials   │
└────────────────┘

┌────────────────────┐
│  knowledge_base    │  (RAG embeddings — pgvector)
└────────────────────┘

┌────────────────────┐
│  leads             │  (contact form submissions)
└────────────────────┘
```

---

## Table Definitions

### 1. `profiles` Table

**Purpose**: Mehdi's biographical data, contact info, social links. Single-row table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `full_name` | VARCHAR(100) | NOT NULL | "Mehdi Abbas Nathani" |
| `headline` | VARCHAR(200) | NOT NULL | "Agentic AI & Software Engineer" |
| `bio` | TEXT | NOT NULL | Detailed biography with finance-to-tech narrative |
| `email` | VARCHAR(100) | NOT NULL | Contact email |
| `phone` | VARCHAR(20) | NULL | Contact phone |
| `location` | VARCHAR(100) | NULL | City, Country |
| `linkedin_url` | TEXT | NULL | LinkedIn profile URL |
| `github_url` | TEXT | NULL | GitHub profile URL |
| `twitter_url` | TEXT | NULL | Twitter/X profile URL |
| `resume_url` | TEXT | NULL | PDF resume URL |
| `profile_image_url` | TEXT | NULL | Profile photo URL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Constraints**:
- Single-row enforcement: application logic ensures only one record exists

**Indexes**: None needed (single-row table)

---

### 2. `projects` Table

**Purpose**: Portfolio projects with full details and display ordering.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `title` | VARCHAR(200) | NOT NULL | Project title (e.g., "BIDLY", "Hospital Reception System") |
| `description` | TEXT | NOT NULL | Full project description |
| `short_description` | VARCHAR(300) | NOT NULL | Brief description for listing views |
| `tech_stack` | TEXT[] | NOT NULL, DEFAULT '{}' | Array of technologies used |
| `project_url` | TEXT | NULL | Live project/demo URL |
| `github_url` | TEXT | NULL | GitHub repository URL |
| `image_url` | TEXT | NULL | Project hero/thumbnail image URL |
| `featured` | BOOLEAN | NOT NULL, DEFAULT false | Highlight on homepage |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 | Display order |
| `start_date` | DATE | NULL | Project start date |
| `end_date` | DATE | NULL | Project completion date |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_projects_featured` ON `projects(featured)` — filter featured projects
- `idx_projects_order` ON `projects(order_index ASC)` — display ordering
- `idx_projects_created` ON `projects(created_at DESC)` — recent projects

---

### 3. `skills` Table

**Purpose**: Technical skills with category grouping and proficiency levels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE (case-insensitive) | Skill name |
| `category` | VARCHAR(50) | NOT NULL, CHECK IN ('Languages', 'Frameworks', 'Libraries', 'Databases', 'Tools', 'Cloud', 'AI/ML') | Category |
| `proficiency` | INTEGER | NOT NULL, CHECK BETWEEN 1 AND 5 | Proficiency (1=Beginner, 5=Expert) |
| `icon_url` | TEXT | NULL | Skill icon image URL |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 | Display order within category |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes**:
- `idx_skills_category` ON `skills(category, order_index ASC)` — grouped display
- `idx_skills_proficiency` ON `skills(proficiency DESC)` — sort by proficiency
- `idx_skills_name_lower` ON `skills(LOWER(name))` — case-insensitive unique lookup

---

### 4. `project_skills` Table (Junction)

**Purpose**: Many-to-many relationship between projects and skills.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `project_id` | UUID | NOT NULL, FK → projects(id) ON DELETE CASCADE | Project reference |
| `skill_id` | UUID | NOT NULL, FK → skills(id) ON DELETE CASCADE | Skill reference |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Primary Key**: `(project_id, skill_id)` (composite)

**Indexes**:
- `idx_project_skills_project` ON `project_skills(project_id)` — fetch skills for project
- `idx_project_skills_skill` ON `project_skills(skill_id)` — fetch projects using skill

---

### 5. `experience` Table

**Purpose**: Work history timeline entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `company` | VARCHAR(200) | NOT NULL | Company/organization name |
| `role` | VARCHAR(200) | NOT NULL | Job title |
| `start_date` | DATE | NOT NULL | Employment start date |
| `end_date` | DATE | NULL | Employment end date (NULL = current role) |
| `responsibilities` | TEXT | NOT NULL | Role description and achievements |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 | Display order (reverse chronological) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes**:
- `idx_experience_dates` ON `experience(start_date DESC)` — chronological ordering
- `idx_experience_order` ON `experience(order_index ASC)` — display ordering

---

### 6. `certifications` Table

**Purpose**: Professional certifications and courses completed.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(200) | NOT NULL | Certification name (e.g., "Next.js — SMIT — 2025") |
| `issuer` | VARCHAR(200) | NOT NULL | Issuing organization |
| `date_earned` | DATE | NOT NULL | Date certification was earned |
| `credential_url` | TEXT | NULL | Verification/credential URL |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 | Display order |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes**:
- `idx_certifications_date` ON `certifications(date_earned DESC)` — chronological display

---

### 7. `testimonials` Table

**Purpose**: Professional recommendations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `author_name` | VARCHAR(100) | NOT NULL | Testimonial author |
| `author_role` | VARCHAR(100) | NOT NULL | Author's role/title |
| `author_company` | VARCHAR(100) | NULL | Author's company |
| `quote` | TEXT | NOT NULL, CHECK length > 0 | Testimonial quote |
| `date` | DATE | NOT NULL, CHECK <= CURRENT_DATE | Date of testimonial |
| `linkedin_url` | TEXT | NULL | Author's LinkedIn for verification |
| `order_index` | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 | Display order |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes**:
- `idx_testimonials_date` ON `testimonials(date DESC)` — sort by date
- `idx_testimonials_order` ON `testimonials(order_index ASC)` — display order

---

### 8. `knowledge_base` Table (RAG Embeddings)

**Purpose**: Content chunks + vector embeddings for RAG chatbot retrieval.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `content` | TEXT | NOT NULL, CHECK length BETWEEN 50 AND 2000 | Knowledge chunk text |
| `source` | VARCHAR(50) | NOT NULL, CHECK IN ('resume', 'project', 'bio', 'skills', 'career_narrative', 'testimonial', 'certification') | Source type |
| `source_id` | UUID | NULL | Reference to source record |
| `metadata` | JSONB | NOT NULL, DEFAULT '{}' | Additional metadata (tags, priority) |
| `embedding` | vector(768) | NOT NULL | Gemini text-embedding-004 vector |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_kb_embedding` ON `knowledge_base USING hnsw (embedding vector_cosine_ops)` — HNSW similarity search
- `idx_kb_source` ON `knowledge_base(source)` — filter by source type
- `idx_kb_metadata` ON `knowledge_base USING GIN (metadata)` — JSONB queries

**RAG Similarity Query**:
```sql
SELECT content, metadata, source, source_id,
       1 - (embedding <=> $1) AS similarity
FROM knowledge_base
WHERE 1 - (embedding <=> $1) > 0.7
ORDER BY embedding <=> $1
LIMIT 5;
```

---

### 9. `leads` Table

**Purpose**: Contact form submissions and chatbot-captured leads.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(200) | NOT NULL | Visitor's name |
| `email` | VARCHAR(200) | NOT NULL | Visitor's email |
| `message` | TEXT | NOT NULL, CHECK length > 0 | Inquiry message |
| `category` | VARCHAR(30) | NOT NULL, DEFAULT 'other', CHECK IN ('job_offer', 'freelance', 'collaboration', 'chatbot_capture', 'other') | Lead category |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'new', CHECK IN ('new', 'reviewed', 'replied', 'archived') | Lead status |
| `source` | VARCHAR(20) | NOT NULL, DEFAULT 'contact_form', CHECK IN ('contact_form', 'chatbot') | How the lead was captured |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Submission timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last status update timestamp |

**Indexes**:
- `idx_leads_status` ON `leads(status)` — filter by status
- `idx_leads_category` ON `leads(category)` — filter by category
- `idx_leads_created` ON `leads(created_at DESC)` — newest first

---

## State Transitions

### Lead Lifecycle

```
new → reviewed → replied → archived
  │                │
  └────────────────┘ (can skip reviewed → replied directly)
```

- **new**: Lead just submitted, not yet viewed by Mehdi
- **reviewed**: Mehdi has reviewed the lead
- **replied**: Mehdi has responded to the lead
- **archived**: Lead is no longer active (closed, not interested, spam)

---

## Migration Order

| # | File | Purpose |
|---|------|---------|
| 1 | `001_enable_pgvector.sql` | Enable `vector` extension |
| 2 | `002_create_profiles.sql` | Profiles table |
| 3 | `003_create_projects.sql` | Projects table + indexes |
| 4 | `004_create_skills.sql` | Skills table + project_skills junction |
| 5 | `005_create_experience.sql` | Experience table |
| 6 | `006_create_certifications.sql` | Certifications table |
| 7 | `007_create_testimonials.sql` | Testimonials table |
| 8 | `008_create_knowledge_base.sql` | Knowledge base + HNSW index |
| 9 | `009_create_leads.sql` | Leads table + indexes |
| 10 | `seed_data.sql` | Initial content population |

---

**Status**: ✅ COMPLETE — All 9 tables defined with constraints, indexes, and relationships
