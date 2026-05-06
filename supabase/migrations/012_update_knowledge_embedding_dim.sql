-- Migration 012: Update knowledge_base embedding dimension to 3072 for gemini-embedding-001
-- Date: 2026-05-06
-- Apply via Supabase SQL Editor: https://icaepuzqrobdvvlyquat.supabase.com/project/sql

-- Drop the existing HNSW index first (depends on the embedding column)
DROP INDEX IF EXISTS idx_kb_embedding;
DROP INDEX IF EXISTS idx_knowledge_base_embedding_hnsw;
DROP INDEX IF EXISTS idx_kb_embedding_hnsw;

-- Alter the embedding column to use 3072 dimensions
ALTER TABLE knowledge_base ALTER COLUMN embedding TYPE vector(3072) USING NULL;

-- Recreate the HNSW index for fast cosine similarity search
CREATE INDEX idx_kb_embedding ON knowledge_base
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Update the match_knowledge RPC to accept 3072-dimension embeddings
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(3072),
  match_count int DEFAULT 5,
  similarity_threshold float DEFAULT 0.7
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  source text,
  source_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    kb.source,
    kb.source_id,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > similarity_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION match_knowledge IS 'RAG vector similarity search function for knowledge base retrieval. Accepts a 3072-dimension query embedding, returns top matching content with cosine similarity scores.';
