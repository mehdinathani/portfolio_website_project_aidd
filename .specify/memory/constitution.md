<!--
SYNC IMPACT REPORT
==================
Version change: 2.0.0 → 2.0.1 (Patch: added resource references for deep-research-report.md
  and Context7 MCP server; clarifications only, no principle changes)
Modified principles: None
Added sections:
  - Authoritative Resources (deep-research-report.md, Context7 MCP)
Removed sections: None
Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (no changes needed — resource refs are constitution-internal)
  - ✅ .specify/templates/spec-template.md (no changes needed)
  - ✅ .specify/templates/tasks-template.md (no changes needed)
Follow-up TODOs: None
-->

# Mehdi AI Portfolio Constitution

## Core Principles

### I. Spec-First

Every feature begins with a written specification in `specs/<feature>/spec.md`.
No code is written without an approved spec and implementation plan.
Specs must define user stories, functional requirements, and success criteria.

**Rationale**: Prevents scope creep, ensures shared understanding before implementation,
and enables async review without code context.

### II. Test-Driven (NON-NEGOTIABLE)

Tests are written before implementation for all feature logic.
Red-Green-Refactor cycle is mandatory:
1. Write failing test
2. Implement minimal code to pass
3. Refactor with confidence

Tests are OPTIONAL in task lists — only included when explicitly requested in the spec.

**Rationale**: Catches regressions early, documents expected behavior, enables safe refactoring.

### III. CLI-Compatible

Where applicable, tooling and scripts MUST be invokable via command line.
Standard I/O conventions: stdin/args → stdout, errors → stderr.
Support both machine-readable (JSON) and human-readable output formats.

**Rationale**: Ensures automation capability, debuggability, and composability with other tools.

### IV. Observability

All feature implementations MUST include:
- Structured logging for key operations and errors
- Clear error messages with actionable context
- Metrics or traces where system complexity warrants them

**Rationale**: Enables rapid debugging in production, supports user troubleshooting,
and provides data for performance optimization.

### V. Versioning & Breaking Changes

All public interfaces (APIs, data contracts, CLI outputs) follow semantic versioning:
MAJOR.MINOR.PATCH.

Breaking changes require:
- MAJOR version increment
- Migration guide or backward-compatible fallback
- Explicit documentation in changelog and ADR

**Rationale**: Predictable versioning prevents downstream breakage and communicates
impact clearly to consumers.

### VI. Simplicity

Start with the simplest viable solution. YAGNI (You Ain't Gonna Need It) applies.
Complexity must be justified with measurable benefit.
Refactor toward simplicity — never add complexity speculatively.

**Rationale**: Reduces maintenance burden, accelerates onboarding, minimizes surface
area for bugs.

### VII. Strict Separation of Concerns

Next.js App Router handles UI, routing, and client-side interactions ONLY.
FastAPI handles all business logic, data processing, and AI operations.
The two layers communicate exclusively via HTTP/gRPC APIs with explicit contracts.
No business logic in Next.js API routes. No UI rendering in FastAPI.

**Rationale**: Clean boundaries enable independent scaling, testing, and technology
swaps. Prevents framework coupling and keeps AI logic portable.

### VIII. Zero Hardcoded Data

All content — Mehdi's background, projects, skills, testimonials, resume data,
and chatbot knowledge — MUST be fetched from Supabase (PostgreSQL + pgvector).
No static JSON files, no hardcoded strings in source code for content.
Supabase is the single source of truth.

**Rationale**: Enables content updates without code deploys. Supports non-technical
content management. Ensures chatbot RAG queries always reflect current data.

### IX. Zero-Cost Deployment

Architecture and deployment MUST optimize for $0 hosting costs.
Target free tiers:
- Vercel (Next.js frontend — Hobby tier)
- Render/Railway (FastAPI — free tier)
- Supabase (PostgreSQL + pgvector — Free tier: 500 MB, 2 projects)
- Google Gemini API (Free tier: 15 RPM, 1M tokens/min context)

If free tiers prove insufficient, the cheapest paid tier MUST be justified
with measurable user value before upgrade.

**Rationale**: Portfolio is a cost center, not revenue-generating. Zero-cost
architecture enables indefinite operation without financial commitment.

### X. RAG-Powered AI Chatbot

The AI chatbot MUST utilize Retrieval-Augmented Generation (RAG) against
Mehdi's unique professional background, specifically highlighting the
Finance-to-Technology career transition narrative.

RAG pipeline requirements:
- Embeddings stored in Supabase pgvector
- Retrieval scope: resume data, project descriptions, skills, career narrative
- Responses MUST be grounded in retrieved context — no hallucinated credentials
- Chatbot must differentiate Mehdi's profile from generic tech portfolios

**Rationale**: The chatbot is a differentiator — it demonstrates technical skill
while simultaneously telling Mehdi's unique story. Generic chatbot responses
undermine the portfolio's purpose.

### XI. Modern, Accessible, Responsive UI

All UI MUST meet these standards:
- Modern design language (clean, minimal, purposeful animations)
- WCAG 2.1 AA accessibility compliance (keyboard navigation, screen reader support, color contrast)
- Fully responsive across mobile (320px), tablet (768px), and desktop (1280px+)
- Performance budget: First Contentful Paint < 1.5s, Time to Interactive < 3.5s

**Rationale**: The portfolio IS the product. First impressions determine
recruiter engagement. Accessibility is non-negotiable for professional software.

## Project Stack

The following technology stack is locked for this project:

| Layer             | Technology                          | Notes                              |
|-------------------|-------------------------------------|------------------------------------|
| Frontend          | Next.js (App Router)                | React Server Components preferred  |
| Backend API       | FastAPI (Python 3.11+)              | Async endpoints for AI operations  |
| Database          | Supabase (PostgreSQL)               | Primary data store                 |
| Vector Store      | Supabase pgvector                   | RAG embeddings                     |
| AI Model          | Google Gemini API (Free Tier)       | Chat completions + embeddings      |
| Deployment (FE)   | Vercel (Hobby tier)                 | Free tier                          |
| Deployment (BE)   | Render / Railway (Free tier)        | Free tier FastAPI hosting          |
| Styling           | Tailwind CSS + shadcn/ui            | Component library                  |
| Language          | TypeScript (frontend), Python (API) | Strict typing both sides           |

## Data Architecture

- **Source of Truth**: Supabase PostgreSQL
- **Schema Management**: Migrations tracked in `migrations/` directory
- **Content Types**: Profile data, projects, skills, testimonials, chatbot knowledge base
- **Vector Embeddings**: Stored in pgvector tables, updated when source content changes
- **Environment Variables**: All connection strings, API keys in `.env` (gitignored)

## AI/ML Constraints

- Gemini API free tier rate limits (15 RPM) MUST be respected with request queuing or caching
- RAG retrieval scope limited to Mehdi's data — no external knowledge injection
- Embedding model: use Gemini's text embedding endpoint (free tier)
- Prompt engineering MUST include system prompts that anchor responses to retrieved context
- No fine-tuning required (free tier constraint)

## Authoritative Resources

The following resources are designated as authoritative references for project decisions:

- **`deep-research-report.md`** — Comprehensive portfolio research document containing:
  - Detailed project plan, user profile, and requirements
  - Site structure, feature specifications, and data models
  - Technology stack comparison and rationale
  - UX flows, chatbot design (RAG), and implementation roadmap
  - Hosting, security, SEO, accessibility, and cost analysis
  - All research-backed portfolio decisions with citations

  This file is the **single source of truth for portfolio content and planning**. When specifications conflict between this file and other documents, `deep-research-report.md` takes precedence for content, features, and user requirements. Technical architecture decisions remain governed by this constitution and individual spec files.

- **Context7 MCP Server** — The project uses the Context7 MCP (`mcp__context7__*`) tool to fetch up-to-date documentation for libraries, frameworks, and tools referenced in this project. This ensures:
  - Latest API documentation for Next.js, FastAPI, Supabase, Gemini, and other dependencies
  - Current best practices and breaking changes in locked technologies
  - Accurate code examples from authoritative sources

  Agents MUST use the Context7 MCP tool when resolving library-specific questions or generating code that depends on external APIs. Never rely on internal knowledge alone when MCP documentation is available.

  Context7 tool IDs available:
  - `mcp__context7__resolve-library-id` — Resolve a library name to a Context7 library ID
  - `mcp__context7__query-docs` — Query documentation for a resolved library ID

## Development Workflow

1. **Spec → Plan → Tasks → Implement → Validate**
   - Spec defines what and why
   - Plan defines how (architecture, tech choices)
   - Tasks define executable steps with test cases
   - Implementation follows tasks sequentially or in parallel where marked `[P]`
   - Validation ensures acceptance criteria met

2. **Branching**: Feature branches follow pattern `###-feature-name`.
   Merge to main only after all gates pass.

3. **Gates**:
   - Constitution Check passes (before Phase 0 research)
   - All tests pass (if tests included in spec)
   - Linting and type-checking pass (if configured)
   - Quickstart validation succeeds
   - Accessibility audit passes (for UI features)
   - RAG response accuracy verified (for chatbot features)

## Governance

This constitution supersedes all other development practices in the project.
Amendments require:
1. A proposed change documented via `/sp.constitution` or ADR
2. Review and approval by project maintainer
3. Version increment per semantic versioning rules
4. Migration plan if change affects existing code or processes

All PRs and reviews must verify constitution compliance.
Complexity introduced beyond these principles must be justified in the implementation plan.
For runtime development guidance, consult this file alongside `.specify/templates/`.

**Version**: 2.0.1 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-12
