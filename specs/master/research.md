# Research: Mehdi AI Portfolio Website

**Date**: 2026-04-10
**Feature**: master
**Phase**: 0 (Outline & Research)

## Purpose

This document resolves all NEEDS CLARIFICATION items from the Technical Context and provides research-backed decisions for the 4-week MVP plan.

---

## Decision 1: Next.js App Router vs Pages Router

**Decision**: Use Next.js 14+ App Router with React Server Components

**Rationale**:
- App Router provides better performance via server-side rendering and streaming
- Aligns with Next.js recommended approach for new projects
- Better data fetching patterns (no client-side waterfalls)
- Built-in support for layouts, loading states, and error boundaries
- Constitution Principle VII requires clean UI/logic separation - RSC enforces this

**Alternatives considered**:
- Pages Router: Simpler but deprecated for new projects, no streaming support
- Pure React SPA: Would require separate SSR setup, more complexity

---

## Decision 2: FastAPI vs Node.js Backend

**Decision**: Use FastAPI (Python 3.11+) for backend API

**Rationale**:
- Python is the native language for AI/ML (Gemini API, LangChain, RAG)
- FastAPI provides async support, automatic OpenAPI docs, Pydantic validation
- RAG pipeline implementation is simpler in Python (mature ecosystem)
- Constitution Principle VII: Separation of concerns (Python backend, TypeScript frontend)

**Alternatives considered**:
- Node.js/Express: Would require Python subprocess for AI logic (added complexity)
- Next.js API Routes: Violates Constitution Principle VII (no business logic in Next.js)

---

## Decision 3: Supabase vs PostgreSQL + Manual pgvector

**Decision**: Use Supabase (managed PostgreSQL with pgvector)

**Rationale**:
- Free tier includes 500 MB storage, sufficient for portfolio data + embeddings
- Built-in Row Level Security (RLS) for data access control
- Managed migrations, backups, and connection pooling
- pgvector extension pre-installed (no manual setup required)
- Aligns with Constitution Principle IX (zero-cost deployment)

**Alternatives considered**:
- Self-hosted PostgreSQL on free-tier VM: Requires manual pgvector install, more ops overhead
- MongoDB/NoSQL: No native vector search, poor relational data modeling

---

## Decision 4: Gemini API vs OpenAI/Claude for RAG

**Decision**: Use Google Gemini API (Free Tier)

**Rationale**:
- Free tier: 15 RPM, 1M tokens/min context (sufficient for portfolio traffic)
- Supports both chat completions and text embeddings (single provider)
- Constitution Principle IX: Zero-cost deployment requirement
- Gemini's grounding capabilities align with Principle X (no hallucination)

**Alternatives considered**:
- OpenAI GPT-4: Superior performance but costs $0.03-0.06 per 1K tokens (violates Principle IX)
- Claude: Excellent but no free tier
- Open-source LLMs (Llama, Mistral): Require GPU hosting (not free tier compatible)

**Mitigation for 15 RPM limit**:
- Implement in-memory caching with TTL for frequent queries
- Request queuing with rate limit middleware
- Pre-compute embeddings for knowledge base (no real-time embedding generation)

---

## Decision 5: RAG Framework (LangChain vs LlamaIndex vs Custom)

**Decision**: Use custom RAG implementation with minimal dependencies

**Rationale**:
- Constitution Principle VI: Simplicity (start with simplest viable solution)
- RAG pipeline for portfolio is straightforward: retrieve from pgvector → construct prompt → call Gemini
- LangChain/LlamaIndex add abstraction layers that obscure debugging
- Custom implementation allows fine-tuned control over grounding and rate limits

**Alternatives considered**:
- LangChain: Powerful but overkill for single-purpose RAG, adds dependency complexity
- LlamaIndex: Excellent for document retrieval but portfolio data is structured (not documents)

**Custom RAG implementation components**:
- `embedding_service.py`: Gemini text embeddings wrapper with caching
- `rag_service.py`: Retrieval logic (pgvector similarity search) + prompt construction
- `gemini_client.py`: API client with rate limit handling and streaming support
- `cache_service.py`: In-memory cache (TTL-based) + request queue

---

## Decision 6: Frontend Styling (Tailwind + shadcn/ui vs Material-UI vs Chakra)

**Decision**: Use Tailwind CSS + shadcn/ui component library

**Rationale**:
- Tailwind provides utility-first styling with minimal CSS overhead
- shadcn/ui provides accessible, customizable components (built on Radix UI)
- Aligns with Constitution Principle XI (modern, accessible UI)
- Small bundle size compared to Material-UI/Chakra
- Easy to customize design system (Tailwind config + CSS variables)

**Alternatives considered**:
- Material-UI: Larger bundle size, opinionated design (harder to customize)
- Chakra UI: Good accessibility but larger bundle, less flexible than shadcn/ui
- Custom CSS: Violates Principle VI (unnecessary complexity, reinventing components)

---

## Decision 7: Deployment Platforms (Vercel + Render vs Alternatives)

**Decision**: Deploy frontend to Vercel (Hobby tier), backend to Render (Free tier)

**Rationale**:
- Vercel: Native Next.js support, automatic preview deployments, 100GB bandwidth (Hobby tier)
- Render: Free tier includes 512 MB RAM, 100GB bandwidth, auto-deploy from Git
- Both platforms support environment variables, custom domains, HTTPS
- Aligns with Constitution Principle IX (zero-cost deployment)

**Alternatives considered**:
- Railway: Similar to Render but free tier has shorter idle timeout
- Fly.io: Requires credit card, free tier is limited (3 VMs, 3GB total)
- AWS/GCP free tiers: Complex setup, easy to exceed free tier limits accidentally

---

## Decision 8: Testing Strategy

**Decision**: Multi-layer testing approach

**Frontend**:
- Jest + React Testing Library for component unit tests
- Playwright for E2E tests (cross-browser, critical user journeys)

**Backend**:
- pytest for unit tests (services, models)
- httpx for API integration tests (endpoint validation)

**RAG Pipeline**:
- Custom accuracy tests (grounding verification, hallucination prevention)
- Query-response similarity scoring (ensure relevant retrieval)

**Rationale**:
- Constitution Principle II: Test-Driven (NON-NEGOTIABLE)
- Different layers require different testing strategies
- RAG accuracy tests are unique to AI-powered features (traditional unit tests insufficient)

**Alternatives considered**:
- Cypress instead of Playwright: Playwright has better cross-browser support and faster execution
- unittest instead of pytest: pytest has better fixtures, parametrization, and ecosystem

---

## Decision 9: Database Schema Design

**Decision**: Normalized PostgreSQL schema with separate tables for each content type

**Core tables**:
- `profiles`: Mehdi's bio, contact info, social links (single row)
- `projects`: Portfolio projects (title, description, tech stack, links, images)
- `skills`: Technical skills (name, category, proficiency level)
- `testimonials`: Recommendations (author, role, quote, date)
- `knowledge_base`: RAG knowledge (content, metadata, embedding vector)

**Rationale**:
- Constitution Principle VIII: Zero hardcoded data (all content from Supabase)
- Normalized schema enables content updates without code deploys
- Separate tables allow independent CRUD operations per content type
- pgvector in `knowledge_base` table enables RAG retrieval

**Alternatives considered**:
- Single JSONB column for all content: Violates Principle VIII (hard to update without code deploys)
- Document database: Poor relational querying, no native vector search

---

## Decision 10: Rate Limiting Strategy for Gemini API

**Decision**: Multi-layer rate limiting

**Layer 1**: In-memory cache (TTL: 5 minutes)
- Cache frequent queries (e.g., "Tell me about Mehdi")
- Reduces API calls for repeated questions

**Layer 2**: Request queue with rate limiter
- Token bucket algorithm (15 tokens/minute)
- Queues excess requests, processes them as tokens refill

**Layer 3**: Fallback response
- If rate limit exceeded and queue full, return cached or generic response
- Logs rate limit events for monitoring

**Rationale**:
- Gemini API free tier: 15 RPM hard limit
- Portfolio traffic is low, but rate limiting prevents accidental overuse
- Aligns with Principle VI (simplicity) - no external rate limiting service needed

**Alternatives considered**:
- Redis-based caching: Overkill for single-user portfolio (in-memory sufficient)
- External rate limiting (Cloudflare, API gateway): Adds cost, violates Principle IX

---

## Unresolved Items

None. All NEEDS CLARIFICATION items resolved.

---

## Follow-up Research Needs

1. **Gemini API grounding techniques**: Test system prompt designs for hallucination prevention
2. **pgvector indexing performance**: Benchmark HNSW vs IVFFlat for knowledge base size
3. **Accessibility audit tools**: Identify best automated tools (axe-core, Lighthouse, WAVE)
4. **Vercel/Render deployment automation**: Research GitHub Actions integration for CI/CD

---

**Status**: ✅ COMPLETE - All decisions documented with rationale and alternatives
