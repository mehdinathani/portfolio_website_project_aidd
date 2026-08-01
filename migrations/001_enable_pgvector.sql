-- Migration 001: Enable pgvector extension
-- Purpose: Enable the pgvector extension for RAG embedding storage
-- Date: 2026-04-12

CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension is available
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
