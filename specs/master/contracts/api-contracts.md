# API Contracts: Mehdi AI Portfolio Website

**Date**: 2026-04-10
**Feature**: master
**Phase**: 1 (Design & Contracts)
**Version**: v1
**Base URL**: `https://api.example.com/api/v1` (production), `http://localhost:8000/api/v1` (development)

---

## OpenAPI 3.0 Specification

See: `contracts/openapi.yaml` (full OpenAPI spec)

This document provides a human-readable summary of all API contracts.

---

## Authentication

**Status**: No authentication required for public portfolio API.

**Rate Limiting**: All endpoints subject to rate limiting (15 RPM for `/chat` endpoint, 60 RPM for others).

**Headers**:
- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Unix timestamp when rate limit resets

---

## Endpoints

### 1. Profile

#### GET /api/v1/profile

**Description**: Fetch Mehdi's profile information (bio, contact, social links).

**Request**:
```http
GET /api/v1/profile HTTP/1.1
Host: api.example.com
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "full_name": "Mehdi Nathani",
  "headline": "Software Engineer | Finance-to-Tech Transition",
  "bio": "Detailed biography...",
  "email": "mehdi@example.com",
  "location": "City, Country",
  "linkedin_url": "https://linkedin.com/in/mehdinathani",
  "github_url": "https://github.com/mehdinathani",
  "resume_url": "https://example.com/resume.pdf",
  "profile_image_url": "https://example.com/photo.jpg",
  "updated_at": "2026-04-10T12:00:00Z"
}
```

**Errors**:
- `404 Not Found`: Profile not found (should never occur with single-row table)
- `500 Internal Server Error`: Database connection failure

**Caching**: Cache-Control: public, max-age=3600 (1 hour)

---

### 2. Projects

#### GET /api/v1/projects

**Description**: List all portfolio projects (filtered/sorted).

**Query Parameters**:
- `featured` (boolean, optional): Filter featured projects only
- `sort` (string, optional): Sort field (`order_index`, `created_at`, `start_date`). Default: `order_index`
- `order` (string, optional): Sort order (`asc`, `desc`). Default: `asc`
- `limit` (integer, optional): Max results (1-50). Default: 20
- `offset` (integer, optional): Pagination offset. Default: 0

**Request**:
```http
GET /api/v1/projects?featured=true&sort=order_index&order=asc HTTP/1.1
Host: api.example.com
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "AI Portfolio Chatbot",
      "short_description": "RAG-powered chatbot showcasing my background",
      "description": "Full project description...",
      "project_url": "https://example.com/project",
      "github_url": "https://github.com/mehdinathani/project",
      "image_url": "https://example.com/project-image.jpg",
      "featured": true,
      "order_index": 1,
      "start_date": "2026-01-01",
      "end_date": "2026-03-15",
      "skills": ["Python", "FastAPI", "pgvector", "Gemini API"],
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-03-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

**Errors**:
- `400 Bad Request`: Invalid query parameters (e.g., invalid sort field)
- `500 Internal Server Error`: Database failure

**Caching**: Cache-Control: public, max-age=1800 (30 minutes)

---

#### GET /api/v1/projects/{id}

**Description**: Get detailed information about a specific project.

**Path Parameters**:
- `id` (UUID, required): Project ID

**Request**:
```http
GET /api/v1/projects/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: api.example.com
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "AI Portfolio Chatbot",
  "short_description": "RAG-powered chatbot showcasing my background",
  "description": "Full detailed description with technical architecture...",
  "project_url": "https://example.com/project",
  "github_url": "https://github.com/mehdinathani/project",
  "image_url": "https://example.com/project-image.jpg",
  "featured": true,
  "order_index": 1,
  "start_date": "2026-01-01",
  "end_date": "2026-03-15",
  "skills": [
    {"id": "uuid", "name": "Python", "category": "Languages", "proficiency": 5},
    {"id": "uuid", "name": "FastAPI", "category": "Frameworks", "proficiency": 4}
  ],
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-03-15T12:00:00Z"
}
```

**Errors**:
- `404 Not Found`: Project with given ID not found
- `500 Internal Server Error`: Database failure

**Caching**: Cache-Control: public, max-age=1800 (30 minutes)

---

### 3. Skills

#### GET /api/v1/skills

**Description**: List all technical skills, optionally grouped by category.

**Query Parameters**:
- `category` (string, optional): Filter by category (e.g., "Languages", "Frameworks")
- `grouped` (boolean, optional): Return grouped by category. Default: false
- `min_proficiency` (integer, optional): Filter by minimum proficiency (1-5)

**Request**:
```http
GET /api/v1/skills?grouped=true&min_proficiency=3 HTTP/1.1
Host: api.example.com
```

**Response** (200 OK) - grouped:
```json
{
  "grouped": true,
  "data": {
    "Languages": [
      {"id": "uuid", "name": "Python", "proficiency": 5, "icon_url": "https://example.com/icons/python.svg"},
      {"id": "uuid", "name": "TypeScript", "proficiency": 4, "icon_url": "https://example.com/icons/ts.svg"}
    ],
    "Frameworks": [
      {"id": "uuid", "name": "FastAPI", "proficiency": 4, "icon_url": null},
      {"id": "uuid", "name": "Next.js", "proficiency": 4, "icon_url": null}
    ],
    "Databases": [
      {"id": "uuid", "name": "PostgreSQL", "proficiency": 4, "icon_url": null}
    ]
  }
}
```

**Response** (200 OK) - flat:
```json
{
  "grouped": false,
  "data": [
    {"id": "uuid", "name": "Python", "category": "Languages", "proficiency": 5, "order_index": 1},
    {"id": "uuid", "name": "TypeScript", "category": "Languages", "proficiency": 4, "order_index": 2}
  ]
}
```

**Errors**:
- `400 Bad Request`: Invalid category filter
- `500 Internal Server Error`: Database failure

**Caching**: Cache-Control: public, max-age=7200 (2 hours)

---

### 4. Testimonials

#### GET /api/v1/testimonials

**Description**: List professional testimonials/recommendations.

**Query Parameters**:
- `limit` (integer, optional): Max results (1-50). Default: 20
- `offset` (integer, optional): Pagination offset. Default: 0

**Request**:
```http
GET /api/v1/testimonials?limit=10 HTTP/1.1
Host: api.example.com
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "author_name": "Jane Doe",
      "author_role": "Senior Software Engineer",
      "author_company": "Tech Corp",
      "quote": "Mehdi is an exceptional engineer...",
      "date": "2026-02-15",
      "linkedin_url": "https://linkedin.com/in/janedoe",
      "order_index": 1
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "offset": 0,
    "has_more": false
  }
}
```

**Errors**:
- `500 Internal Server Error`: Database failure

**Caching**: Cache-Control: public, max-age=7200 (2 hours)

---

### 5. Chat (RAG Chatbot)

#### POST /api/v1/chat

**Description**: Send a message to the RAG-powered AI chatbot. Returns streaming response.

**Request Headers**:
- `Content-Type: application/json`
- `Accept: text/event-stream` (for streaming)

**Request Body**:
```json
{
  "message": "Tell me about Mehdi's transition from finance to tech",
  "session_id": "optional-session-uuid",
  "history": [
    {"role": "user", "content": "What is Mehdi's background?"},
    {"role": "assistant", "content": "Mehdi transitioned from finance..."}
  ]
}
```

**Request Fields**:
- `message` (string, required): User's message (1-500 characters)
- `session_id` (string, optional): Session identifier for multi-turn conversations
- `history` (array, optional): Conversation history (max 10 messages)

**Response** (200 OK) - Streaming (Server-Sent Events):
```
event: message
data: {"type": "chunk", "content": "Mehdi"}

event: message
data: {"type": "chunk", "content": " transitioned from finance to tech in"}

event: message
data: {"type": "chunk", "content": " 2025 after realizing his passion for software engineering."}

event: message
data: {"type": "sources", "content": [{"source": "career_narrative", "id": "uuid", "similarity": 0.92}]}

event: done
data: {"type": "complete", "session_id": "new-session-uuid"}
```

**Response** (200 OK) - Non-streaming (if `Accept: application/json`):
```json
{
  "response": "Mehdi transitioned from finance to tech in 2025 after realizing his passion for software engineering.",
  "sources": [
    {"source": "career_narrative", "id": "uuid", "similarity": 0.92}
  ],
  "session_id": "new-session-uuid"
}
```

**Errors**:
- `400 Bad Request`: Invalid message format (empty, too long, malicious content)
- `429 Too Many Requests`: Rate limit exceeded (15 RPM)
- `503 Service Unavailable`: Gemini API unavailable
- `500 Internal Server Error`: RAG pipeline failure

**Rate Limiting**:
- Limit: 15 requests per minute (Gemini API free tier constraint)
- Retry-After header provided on 429 responses
- Request queued if under limit but queue not full

**Caching**: Cache-Control: no-cache (responses are user-specific)

**Timeout**: 30 seconds (streaming starts within 2 seconds)

---

### 6. Health Check

#### GET /api/v1/health

**Description**: Health check endpoint for monitoring.

**Request**:
```http
GET /api/v1/health HTTP/1.1
Host: api.example.com
```

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-04-10T12:00:00Z",
  "services": {
    "database": "connected",
    "gemini_api": "available",
    "cache": "operational"
  },
  "version": "1.0.0"
}
```

**Response** (503 Service Unavailable):
```json
{
  "status": "degraded",
  "timestamp": "2026-04-10T12:00:00Z",
  "services": {
    "database": "connected",
    "gemini_api": "unavailable",
    "cache": "operational"
  },
  "version": "1.0.0"
}
```

**Caching**: Cache-Control: no-cache

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Request body/query parameters invalid |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded (retry after X seconds) |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | External service (Gemini API) unavailable |
| `RAG_RETRIEVAL_FAILED` | 500 | RAG pipeline failed to retrieve context |
| `HALLUCINATION_PREVENTION` | 500 | Response grounding verification failed |

---

## Versioning Strategy

**Approach**: URL path versioning (`/api/v1/`, `/api/v2/`)

**Breaking Changes**: Increment major version (v1 → v2) with migration guide
**Non-Breaking Changes**: Add fields/endpoints without version increment

**Deprecation Policy**:
- Old versions supported for 6 months after new version release
- `Deprecation` header sent on old version responses
- Sunset date provided in deprecation header

---

## Idempotency

**GET endpoints**: Naturally idempotent (safe to retry)
**POST /chat**: Idempotent for same message + session_id (cached response returned)
**Other POST/PUT/DELETE**: Not applicable (no write operations in public API)

---

## Timeout & Retry Policy

**Client-Side**:
- Connection timeout: 10 seconds
- Request timeout: 30 seconds (60 seconds for `/chat`)
- Retry: 3 times with exponential backoff (for 5xx errors only)

**Server-Side**:
- Database query timeout: 5 seconds
- Gemini API timeout: 20 seconds
- Total request timeout: 30 seconds

---

## Content-Type Support

**Request**: `application/json`
**Response**: `application/json` (default), `text/event-stream` (streaming chat)

---

**Status**: ✅ COMPLETE - All API contracts defined with inputs, outputs, errors, and edge cases
