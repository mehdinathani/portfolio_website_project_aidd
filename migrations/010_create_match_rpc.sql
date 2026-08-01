-- Migration 010: Create match_knowledge RPC function for RAG vector similarity search
-- This function accepts a query embedding and match count, performs cosine distance search
-- against the knowledge_base table, returning the top matching content.

CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(768),
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

-- Create an index to optimize the vector similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding_hnsw
ON knowledge_base
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

COMMENT ON FUNCTION match_knowledge IS 'RAG vector similarity search function for knowledge base retrieval. Accepts a 768-dimension query embedding, returns top matching content with cosine similarity scores.';
