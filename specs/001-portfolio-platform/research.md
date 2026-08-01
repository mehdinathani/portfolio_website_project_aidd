# Research: Portfolio & Lead Generation Platform

**Date**: 2026-04-12
**Feature**: 001-portfolio-platform
**Phase**: 0 (Outline & Research)

## Purpose

This document resolves all technical design decisions for the portfolio platform. All NEEDS CLARIFICATION items from the Technical Context have been resolved through research and informed decisions.

---

## Decision 1: Next.js App Router vs Pages Router

**Decision**: Next.js 14+ App Router with React Server Components

**Rationale**:
- App Router provides SSR by default — critical for SEO on a portfolio site
- Server Components eliminate client-side JS for static content (about, projects, skills)
- Built-in layouts reduce boilerplate (header/footer defined once)
- Better data fetching: fetch directly in server components (no client-side waterfalls)
- Aligns with Constitution Principle VII (clean UI/logic separation)

**Alternatives considered**:
- Pages Router: Simpler but legacy; no streaming, no RSC
- Pure React SPA: Requires manual SSR setup, worse SEO, larger JS bundle

---

## Decision 2: FastAPI vs Node.js Backend

**Decision**: FastAPI (Python 3.11+)

**Rationale**:
- Python is the native language for AI/ML (Gemini API, RAG, embeddings)
- FastAPI provides async support, automatic OpenAPI docs, Pydantic validation
- RAG pipeline is simpler in Python (mature vector search ecosystem)
- Constitution Principle VII: Separation of concerns (Python backend, TypeScript frontend)

**Alternatives considered**:
- Node.js/Express: Would require Python subprocess for AI logic (added complexity)
- Next.js API Routes: Violates Principle VII (no business logic in Next.js)

---

## Decision 3: Gemini 1.5 Flash vs Gemini Pro vs OpenAI

**Decision**: Google Gemini 1.5 Flash (Free Tier)

**Rationale**:
- Free tier: 15 RPM, 1M token context window — sufficient for portfolio traffic
- Faster and cheaper than Gemini Pro; adequate quality for portfolio Q&A
- Supports both chat completions and text embeddings (single provider)
- `response_mime_type: "application/json"` enables structured output (critical for lead detection)
- Constitution Principle IX: Zero-cost deployment

**Alternatives considered**:
- Gemini Pro: Higher quality but slower, counts against same free tier limits
- OpenAI GPT-4o mini: Excellent but costs $0.03-0.06 per 1K tokens (violates Principle IX)
- Claude Haiku: Good quality but no free tier

---

## Decision 4: Supabase Auth vs Custom JWT Auth

**Decision**: Supabase Auth (email/password)

**Rationale**:
- Free tier included with Supabase project (no additional cost)
- Handles password hashing, session management, token refresh automatically
- `@supabase/supabase-js` client integrates seamlessly with Next.js
- Backend verifies JWT using `supabase-py` admin client
- Eliminates custom auth implementation (reduces attack surface)

**Alternatives considered**:
- Custom JWT: Requires implementing password hashing, token refresh, session store
- NextAuth.js: Good but adds dependency; Supabase Auth is already available

---

## Decision 5: RAG Framework (Custom vs LangChain vs LlamaIndex)

**Decision**: Custom RAG implementation

**Rationale**:
- Constitution Principle VI: Simplicity
- Portfolio RAG is straightforward: embed query → pgvector similarity → construct prompt → call Gemini
- LangChain/LlamaIndex add abstraction layers that obscure debugging and increase bundle size
- Custom implementation allows fine-tuned control over grounding, rate limits, and structured output

**Alternatives considered**:
- LangChain: Overkill for single-purpose RAG, adds dependency complexity
- LlamaIndex: Excellent for document retrieval but portfolio data is structured (not documents)

---

## Decision 6: Embedding Model

**Decision**: Gemini `models/text-embedding-004` (768 dimensions)

**Rationale**:
- Same provider as chat completions — single API key, single rate limit
- 768 dimensions: good balance of accuracy and storage (pgvector handles this natively)
- Free tier: embedding calls count against the same 15 RPM limit (acceptable for admin-triggered embeds only)
- No need to maintain a separate embedding service

**Alternatives considered**:
- OpenAI `text-embedding-3-small`: Better quality but costs per call (violates Principle IX)
- Sentence Transformers (local): Requires GPU or CPU-heavy inference (not free-tier compatible)

---

## Decision 7: Deployment Platforms

**Decision**: Vercel (frontend) + Render (backend) + Supabase (database)

**Rationale**:
- Vercel Hobby: Free, native Next.js support, automatic preview deployments, 100GB bandwidth
- Render Free: 512 MB RAM, auto-deploy from Git, 100GB bandwidth, supports Python
- Supabase Free: 500 MB database, pgvector included, managed backups
- Combined cost: $0/month

**Alternatives considered**:
- Railway: Similar to Render but shorter idle timeout on free tier
- Fly.io: Requires credit card, free tier limited to 3 shared-CPU VMs
- AWS/GCP free tiers: Complex setup, easy to exceed limits accidentally

---

## Decision 8: Caching Strategy

**Decision**: In-memory TTL cache (5-minute expiry) + request queuing

**Rationale**:
- Portfolio chat queries are highly repetitive ("Tell me about Mehdi", "What is Bidly?")
- In-memory cache eliminates API calls for repeated questions
- 5-minute TTL: short enough to serve fresh content, long enough to catch duplicates
- Request queuing via token bucket algorithm (15 tokens/minute)

**Alternatives considered**:
- Redis: Overkill for single-user portfolio; adds cost and infrastructure complexity
- CDN caching: Not applicable for POST chat endpoint

---

## Decision 9: Structured Output from Gemini

**Decision**: Gemini native JSON mode (`response_mime_type: "application/json"`)

**Rationale**:
- Gemini 1.5 Flash supports native JSON output with schema validation
- Eliminates need for response parsing / regex extraction
- Guarantees consistent structure for lead detection (`lead_intent: boolean`)
- Cheaper and more reliable than function calling (single API call)

**Alternatives considered**:
- Function calling: Requires two API calls (one for function selection, one for response)
- Prompt engineering with regex parsing: Fragile, higher token costs

---

## Decision 10: Lead Categorization

**Decision**: Category field on leads with predefined enum values

**Categories**:
- `job_offer`: Full-time employment inquiry
- `freelance`: Contract/project-based work
- `collaboration`: Partnership or open-source interest
- `chatbot_capture`: Lead captured through the chatbot widget
- `other`: General inquiry

**Rationale**:
- Enables Mehdi to prioritize leads in the admin dashboard
- Chatbot-captured leads are tagged differently from form submissions for tracking
- Simple enum — no ML-based categorization needed for MVP

**Alternatives considered**:
- ML-based auto-categorization: Overkill for MVP; can add later
- Free-text tags: Inconsistent, harder to filter

---

## Unresolved Items

None. All design decisions resolved.

---

**Status**: ✅ COMPLETE — All decisions documented with rationale and alternatives
