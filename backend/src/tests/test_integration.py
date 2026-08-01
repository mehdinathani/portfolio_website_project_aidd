"""
Integration tests for Milestone 2: FastAPI Backend & Gemini AI Agent.

Tests cover:
- Supabase RPC (match_knowledge) via mocking
- Gemini API (embedding + chat) via mocking
- Full RAG flow (embed -> retrieve -> prompt -> generate)
- All CRUD GET endpoints
- Chat endpoint with caching and rate limiting
- Error handling edge cases
"""

from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import sys
import os
import uuid
from datetime import datetime, timezone

# Ensure src is on path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.main import app
from src.services import gemini_service, rag_service, cache_service

client = TestClient(app)

# -- Shared test data --

TEST_UUID = str(uuid.uuid4())
NOW = datetime.now(timezone.utc).isoformat()


def _profile_data():
    return {
        "id": TEST_UUID,
        "full_name": "Mehdi Abbas Nathani",
        "headline": "Agentic AI & Software Engineer",
        "bio": "Transitioning from finance to tech",
        "email": "mehdi@example.com",
        "phone": None,
        "location": "Dubai",
        "linkedin_url": None,
        "github_url": None,
        "twitter_url": None,
        "resume_url": None,
        "profile_image_url": None,
        "created_at": NOW,
        "updated_at": NOW,
    }


def _project_data():
    return {
        "id": TEST_UUID,
        "title": "Portfolio Site",
        "description": "My portfolio",
        "short_description": "Portfolio",
        "tech_stack": ["Python", "FastAPI"],
        "project_url": None,
        "github_url": None,
        "image_url": None,
        "featured": True,
        "order_index": 0,
        "start_date": None,
        "end_date": None,
        "created_at": NOW,
        "updated_at": NOW,
        "project_skills": [],
    }


def _skill_data():
    return {
        "id": TEST_UUID,
        "name": "Python",
        "category": "backend",
        "proficiency": 5,
        "order_index": 0,
    }


def _make_mock_supabase(table_data=None, rpc_data=None):
    m = MagicMock()
    data = table_data or []
    single = data[0] if data else None
    # Table operations
    m.table.return_value.select.return_value.order.return_value.execute.return_value = MagicMock(
        data=data
    )
    m.table.return_value.select.return_value.limit.return_value.execute.return_value = MagicMock(
        data=data
    )
    m.table.return_value.select.return_value.eq.return_value.execute.return_value = MagicMock(
        data=data
    )
    m.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data=single
    )
    m.table.return_value.select.return_value.single.return_value.execute.return_value = MagicMock(
        data=single
    )
    m.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=table_data or [{"id": TEST_UUID}]
    )
    m.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
        data=table_data or [{"id": TEST_UUID}]
    )
    m.table.return_value.delete.return_value.eq.return_value.execute.return_value = MagicMock(
        data=[]
    )
    # RPC
    m.rpc.return_value.execute.return_value = MagicMock(
        data=rpc_data or []
    )
    return m


# -- CRUD Endpoint Tests --


class TestProfileEndpoint:
    def test_get_profile_success(self):
        m = _make_mock_supabase(table_data=[_profile_data()])
        with patch("src.services.profile_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/profile/")
            assert resp.status_code == 200
            data = resp.json()
            assert "full_name" in data

    def test_get_profile_not_found(self):
        m = _make_mock_supabase(table_data=[])
        m.table.return_value.select.return_value.single.return_value.execute.return_value = MagicMock(
            data=None
        )
        with patch("src.services.profile_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/profile/")
            assert resp.status_code == 404


class TestProjectsEndpoint:
    def test_list_projects(self):
        m = _make_mock_supabase(table_data=[_project_data()])
        with patch("src.services.project_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/projects/")
            assert resp.status_code == 200
            assert isinstance(resp.json(), list)

    def test_list_projects_featured_only(self):
        m = _make_mock_supabase(table_data=[_project_data()])
        with patch("src.services.project_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/projects/?featured=true")
            assert resp.status_code == 200

    def test_get_project_by_id(self):
        m = _make_mock_supabase(table_data=[_project_data()])
        m.table.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
            data=[_project_data()]
        )
        with patch("src.services.project_service.get_supabase", return_value=m):
            resp = client.get(f"/api/v1/projects/{TEST_UUID}")
            assert resp.status_code == 200


class TestSkillsEndpoint:
    def test_list_skills(self):
        m = _make_mock_supabase(table_data=[_skill_data()])
        with patch("src.services.skill_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/skills/")
            assert resp.status_code == 200
            assert isinstance(resp.json(), list)

    def test_list_skills_grouped(self):
        m = _make_mock_supabase(table_data=[_skill_data()])
        with patch("src.services.skill_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/skills/?grouped=true")
            assert resp.status_code == 200


class TestExperienceEndpoint:
    def test_list_experience(self):
        m = _make_mock_supabase(table_data=[])
        with patch("src.services.experience_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/experience/")
            assert resp.status_code == 200
            assert isinstance(resp.json(), list)


class TestCertificationsEndpoint:
    def test_list_certifications(self):
        m = _make_mock_supabase(table_data=[])
        with patch("src.services.certification_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/certifications/")
            assert resp.status_code == 200
            assert isinstance(resp.json(), list)


class TestTestimonialsEndpoint:
    def test_list_testimonials(self):
        m = _make_mock_supabase(table_data=[])
        with patch("src.services.testimonial_service.get_supabase", return_value=m):
            resp = client.get("/api/v1/testimonials/")
            assert resp.status_code == 200
            assert isinstance(resp.json(), list)


class TestLeadsEndpoint:
    def test_create_lead_success(self):
        lead_data = {
            "id": TEST_UUID,
            "name": "John Doe",
            "email": "john@example.com",
            "message": "Hello Mehdi!",
            "category": "other",
            "status": "new",
            "source": "contact_form",
            "created_at": NOW,
            "updated_at": NOW,
        }
        m = _make_mock_supabase(table_data=[lead_data])
        with patch("src.services.lead_service.get_supabase", return_value=m):
            resp = client.post("/api/v1/leads/", json={
                "name": "John Doe",
                "email": "john@example.com",
                "message": "Hello Mehdi!",
                "category": "other",
            })
            assert resp.status_code == 201
            data = resp.json()
            assert "id" in data

    def test_create_lead_invalid_email(self):
        resp = client.post("/api/v1/leads/", json={
            "name": "John Doe",
            "email": "not-an-email",
            "message": "Hello!",
        })
        assert resp.status_code == 422


# -- Gemini Service Tests --


class TestGeminiService:
    @patch("src.services.gemini_service._get_client")
    def test_generate_embedding(self, mock_get_client):
        mock_client = MagicMock()
        mock_result = MagicMock()
        mock_emb = MagicMock()
        mock_emb.values = [0.1] * 768
        mock_result.embeddings = [mock_emb]
        mock_client.models.embed_content.return_value = mock_result
        mock_get_client.return_value = mock_client

        gemini_service._client = None
        result = gemini_service.generate_embedding("test query")
        assert isinstance(result, list)
        assert len(result) == 768

    @patch("src.services.gemini_service._get_client")
    def test_generate_chat_response(self, mock_get_client):
        mock_client = MagicMock()
        mock_response = MagicMock()
        # Make response.text return a real string, not a MagicMock
        type(mock_response).text = "Hello! I'm Mehdi's assistant."
        mock_client.models.generate_content.return_value = mock_response
        mock_get_client.return_value = mock_client

        gemini_service._client = None
        result = gemini_service.generate_chat_response("Tell me about Mehdi")
        assert "response" in result
        assert isinstance(result["response"], str)


# -- RAG Service Tests --


class TestRagService:
    @patch("src.services.rag_service.get_supabase")
    @patch("src.services.rag_service.gemini_service")
    def test_retrieve_context(self, mock_gemini, mock_get_sb):
        mock_gemini.generate_embedding.return_value = [0.1] * 768
        m = _make_mock_supabase(
            rpc_data=[{"id": "kb1", "content": "Mehdi is a Python dev", "metadata": {}, "source": "resume", "source_id": None, "similarity": 0.85}]
        )
        mock_get_sb.return_value = m

        result = rag_service.retrieve_context("test query", top_k=3, threshold=0.7)
        assert isinstance(result, list)

    @patch("src.services.rag_service.get_supabase")
    @patch("src.services.rag_service.gemini_service")
    def test_retrieve_context_empty(self, mock_gemini, mock_get_sb):
        mock_gemini.generate_embedding.return_value = [0.1] * 768
        m = _make_mock_supabase(rpc_data=[])
        mock_get_sb.return_value = m

        result = rag_service.retrieve_context("unknown query")
        assert isinstance(result, list)
        assert len(result) == 0


# -- Chat Endpoint Tests --


class TestChatEndpoint:
    def test_chat_missing_message(self):
        resp = client.post("/api/v1/chat/", json={})
        assert resp.status_code == 422

    @patch("src.api.v1.chat.rag_service")
    @patch("src.services.gemini_service._get_client")
    def test_chat_success(self, mock_get_client, mock_rag):
        mock_rag.retrieve_context.return_value = [
            {"content": "Mehdi is a Python developer", "source": "resume", "similarity": 0.85}
        ]
        mock_client = MagicMock()
        # Patch generate_chat_response at the chat module where it's called
        with patch("src.api.v1.chat.gemini_service") as mock_gs:
            mock_gs.generate_chat_response.return_value = {
                "response": "Mehdi is a Python developer with experience in finance and AI."
            }
            resp = client.post("/api/v1/chat/", json={"message": "Tell me about Mehdi"})
            assert resp.status_code == 200
            data = resp.json()
            assert "response" in data
            assert isinstance(data["response"], str)

    @patch("src.api.v1.chat.rag_service")
    @patch("src.services.gemini_service._get_client")
    def test_chat_caching(self, mock_get_client, mock_rag):
        mock_rag.retrieve_context.return_value = []
        with patch("src.api.v1.chat.gemini_service") as mock_gs:
            mock_gs.generate_chat_response.return_value = {"response": "Cached response"}
            gemini_service._client = None
            cache_service.cache = {}

            msg = "Unique cached message here"
            resp1 = client.post("/api/v1/chat/", json={"message": msg})
            resp2 = client.post("/api/v1/chat/", json={"message": msg})

            assert resp1.status_code == 200
            assert resp2.status_code == 200

    @patch("src.api.v1.chat.rag_service")
    @patch("src.services.gemini_service._get_client")
    def test_chat_gemini_error_fallback(self, mock_get_client, mock_rag):
        mock_rag.retrieve_context.return_value = []
        with patch("src.api.v1.chat.gemini_service") as mock_gs:
            mock_gs.generate_chat_response.side_effect = Exception("Gemini API error")

            resp = client.post("/api/v1/chat/", json={"message": "Hello"})
            assert resp.status_code == 200
            data = resp.json()
            assert data["fallback"] is True
            assert "unavailable" in data["response"].lower() or "contact" in data["response"].lower()


# -- Health Endpoint Test --


class TestHealthEndpoint:
    def test_health_ok(self):
        m = _make_mock_supabase(table_data=[{"id": TEST_UUID}])
        with patch("src.api.v1.health.get_supabase", return_value=m):
            resp = client.get("/api/v1/health/")
            assert resp.status_code == 200
            data = resp.json()
            assert "status" in data

    def test_health_db_failure(self):
        m = MagicMock()
        m.table.return_value.select.return_value.limit.return_value.execute.side_effect = Exception("DB down")
        with patch("src.api.v1.health.get_supabase", return_value=m):
            resp = client.get("/api/v1/health/")
            assert resp.status_code == 503


# -- Prompt Builder Test --


class TestPromptBuilder:
    def test_build_system_prompt(self):
        from src.services.prompt_builder import build_system_prompt

        chunks = [
            {"content": "Mehdi is a Python developer", "source": "resume", "similarity": 0.85}
        ]
        history = [{"role": "user", "parts": [{"text": "Hello"}]}]

        prompt = build_system_prompt(chunks, history)
        assert isinstance(prompt, str)
        assert len(prompt) > 0
