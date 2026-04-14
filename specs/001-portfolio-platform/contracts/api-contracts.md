# API Contracts: Portfolio & Lead Generation Platform

**Feature**: 001-portfolio-platform
**Date**: 2026-04-12
**Version**: v1
**Base URL**: `https://api.example.com/api/v1` (production), `http://localhost:8000/api/v1` (development)

---

## Public Endpoints (No Auth)

### 1. GET /api/v1/profile

Fetch Mehdi's profile information.

**Response (200)**:
```json
{
  "id": "uuid",
  "full_name": "Mehdi Abbas Nathani",
  "headline": "Agentic AI & Software Engineer",
  "bio": "...",
  "email": "mehdi@example.com",
  "location": "City, Country",
  "linkedin_url": "https://linkedin.com/in/...",
  "github_url": "https://github.com/...",
  "resume_url": "https://...",
  "profile_image_url": "https://...",
  "updated_at": "2026-04-12T00:00:00Z"
}
```

---

### 2. GET /api/v1/projects

List portfolio projects.

**Query Parameters**: `featured` (bool), `sort` (order_index|created_at), `order` (asc|desc), `limit` (1-50), `offset` (int)

**Response (200)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "BIDLY",
      "short_description": "...",
      "description": "...",
      "tech_stack": ["Flutter", "Dart", "Firebase"],
      "project_url": "https://...",
      "github_url": "https://...",
      "image_url": "https://...",
      "featured": true,
      "order_index": 1,
      "start_date": "2025-01-01",
      "end_date": "2025-06-15",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-06-15T00:00:00Z"
    }
  ],
  "pagination": {"total": 10, "limit": 20, "offset": 0, "has_more": false}
}
```

---

### 3. GET /api/v1/projects/{id}

Get a specific project with linked skills.

**Response (200)**: Same as above plus `"skills": [{"id": "uuid", "name": "Flutter", "category": "Frameworks", "proficiency": 4}]`

---

### 4. GET /api/v1/skills

List skills, optionally grouped by category.

**Query Parameters**: `category` (string), `grouped` (bool), `min_proficiency` (1-5)

**Response (200)** — flat:
```json
{
  "grouped": false,
  "data": [
    {"id": "uuid", "name": "Python", "category": "Languages", "proficiency": 5, "order_index": 1}
  ]
}
```

---

### 5. GET /api/v1/experience

List work experience timeline entries.

**Query Parameters**: `sort` (start_date|order_index), `order` (asc|desc)

---

### 6. GET /api/v1/certifications

List certifications.

---

### 7. GET /api/v1/testimonials

List professional testimonials.

---

### 8. POST /api/v1/chat

RAG-powered chatbot. Receives user message, returns structured JSON from Gemini 1.5 Flash.

**Request**:
```json
{
  "message": "Tell me about Mehdi's transition from finance to tech",
  "session_id": "anon-session-uuid",
  "history": [
    {"role": "user", "content": "What is Mehdi's background?"},
    {"role": "assistant", "content": "Mehdi has 10+ years in finance..."}
  ]
}
```

**Response (200)** — Structured JSON:
```json
{
  "response": "Mehdi transitioned from a Senior Finance Executive role to Agentic AI & Software Engineering after realizing his passion for building software. With an MBA in Finance and 10+ years of experience...",
  "lead_intent": false,
  "lead_prompt": null,
  "sources": [
    {"source": "career_narrative", "similarity": 0.92},
    {"source": "bio", "similarity": 0.85}
  ],
  "fallback": false
}
```

**Response when lead detected**:
```json
{
  "response": "I'd be happy to connect you with Mehdi! He's currently available for freelance and full-time opportunities.",
  "lead_intent": true,
  "lead_prompt": "Would you like to share your name, email, and a brief message? I'll make sure Mehdi gets it.",
  "sources": [],
  "fallback": false
}
```

**Errors**:
- `400`: Invalid message (empty, too long)
- `429`: Rate limit exceeded (15 RPM)
- `503`: Gemini API unavailable

**Rate Limiting**: 15 requests/minute (token bucket). `Retry-After` header on 429.

---

### 9. POST /api/v1/leads

Store a contact form submission or chatbot-captured lead.

**Request**:
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "message": "I'd like to discuss a freelance project with Mehdi.",
  "category": "freelance",
  "source": "contact_form"
}
```

**Response (201)**:
```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@company.com",
  "message": "I'd like to discuss a freelance project with Mehdi.",
  "category": "freelance",
  "status": "new",
  "source": "contact_form",
  "created_at": "2026-04-12T00:00:00Z"
}
```

---

### 10. GET /api/v1/health

Health check.

**Response (200)**:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-12T00:00:00Z",
  "services": {
    "database": "connected",
    "gemini_api": "available",
    "cache": "operational"
  },
  "version": "1.0.0"
}
```

---

## Admin Endpoints (Supabase Auth JWT Required)

All admin endpoints require `Authorization: Bearer <supabase-jwt>` header.
Unauthenticated requests receive `401 Unauthorized`.

### Admin CRUD Pattern

Each admin resource (projects, skills, experience, certifications, testimonials, knowledge-base) follows the same CRUD pattern:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/{resource}` | Create new entry |
| GET | `/api/v1/admin/{resource}` | List all entries |
| GET | `/api/v1/admin/{resource}/{id}` | Get single entry |
| PUT | `/api/v1/admin/{resource}/{id}` | Update entry |
| DELETE | `/api/v1/admin/{resource}/{id}` | Delete entry |

**Create Request Example** (POST /api/v1/admin/projects):
```json
{
  "title": "Hospital Reception System",
  "description": "Automated reception management system for hospitals...",
  "short_description": "Hospital automation project",
  "tech_stack": ["Python", "FastAPI", "PostgreSQL"],
  "project_url": "https://...",
  "github_url": "https://...",
  "featured": true,
  "order_index": 2,
  "start_date": "2025-06-01",
  "end_date": "2025-12-01"
}
```

### Admin Leads Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/leads` | List all leads, filter by category/status |
| GET | `/api/v1/admin/leads/{id}` | Get single lead details |
| PATCH | `/api/v1/admin/leads/{id}` | Update lead status (new → reviewed → replied → archived) |

**Query Parameters** (GET /api/v1/admin/leads): `category` (string), `status` (string), `sort` (created_at), `order` (asc|desc), `limit`, `offset`

**Patch Request** (PATCH /api/v1/admin/leads/{id}):
```json
{"status": "reviewed"}
```

### Admin Knowledge Base Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/knowledge-base` | Create entry + auto-generate embedding |
| PUT | `/api/v1/admin/knowledge-base/{id}` | Update entry + regenerate embedding |
| DELETE | `/api/v1/admin/knowledge-base/{id}` | Delete entry + remove embedding |

**Create Request** (POST /api/v1/admin/knowledge-base):
```json
{
  "content": "Mehdi transitioned from finance to tech in 2025 after completing certifications in Next.js, OpenAI Agents SDK, and Prompt Engineering. His MBA in Finance gives him unique perspective on fintech products.",
  "source": "career_narrative",
  "metadata": {"tags": ["transition", "finance", "certifications"]}
}
```

**Response**: Entry created with embedding auto-generated via Gemini embeddings API.

---

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request body or query parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT (admin endpoints) |
| `RATE_LIMIT_EXCEEDED` | 429 | 15 RPM exceeded (chat endpoint) |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Gemini API unavailable |
| `RAG_RETRIEVAL_FAILED` | 500 | RAG pipeline failed |

---

**Status**: ✅ COMPLETE — All public and admin endpoints defined with request/response/error specs
