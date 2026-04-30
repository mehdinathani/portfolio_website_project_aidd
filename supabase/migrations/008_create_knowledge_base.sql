-- Migration 008: Create knowledge_base table (RAG embeddings)
-- Purpose: Content chunks + vector embeddings for RAG chatbot retrieval
-- Date: 2026-04-12

CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL CHECK (LENGTH(content) BETWEEN 50 AND 2000),
    source VARCHAR(50) NOT NULL CHECK (source IN ('resume', 'project', 'bio', 'skills', 'career_narrative', 'testimonial', 'certification')),
    source_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}',
    embedding vector(768) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER knowledge_base_updated_at
    BEFORE UPDATE ON knowledge_base
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- HNSW index for fast cosine similarity search
CREATE INDEX idx_kb_embedding ON knowledge_base
    USING hnsw (embedding vector_cosine_ops);

-- Index for source type filtering
CREATE INDEX idx_kb_source ON knowledge_base(source);

-- GIN index for JSONB metadata queries
CREATE INDEX idx_kb_metadata ON knowledge_base USING GIN (metadata);

COMMENT ON TABLE knowledge_base IS 'RAG knowledge base with Gemini text-embedding-004 vectors (768 dimensions)';
COMMENT ON COLUMN knowledge_base.embedding IS 'Gemini text-embedding-004 vector, 768 dimensions';

-- RAG similarity query template (for reference):
-- SELECT content, metadata, source, source_id,
--        1 - (embedding <=> $1) AS similarity
-- FROM knowledge_base
-- WHERE 1 - (embedding <=> $1) > 0.7
-- ORDER BY embedding <=> $1
-- LIMIT 5;
