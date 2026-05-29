"""
Test cases for admin projects endpoint to verify the fix for missing GET method.
"""
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_admin_projects_endpoint_exists():
    """Test that the admin projects GET endpoint exists and requires authentication."""
    # This should return 401 (Unauthorized) since no auth token is provided
    response = client.get("/api/v1/admin/projects/")
    assert response.status_code == 401
    # The response might be plain text or JSON depending on middleware
    assert "Unauthorized" in response.text or response.json().get("detail") == "Unauthorized"


def test_admin_projects_endpoint_structure():
    """Test that the admin projects endpoint has the correct structure when implemented."""
    # We can't test the actual data return without authentication,
    # but we can verify the endpoint is properly registered

    # Check that the app has the admin router included
    admin_routes = [route for route in app.routes if hasattr(route, 'path') and '/api/v1/admin/projects' in route.path]
    assert len(admin_routes) > 0, "Admin projects routes should be registered"

    # Check that GET method is available for the admin projects endpoint
    get_routes = [route for route in admin_routes if hasattr(route, 'methods') and 'GET' in route.methods]
    assert len(get_routes) > 0, "GET method should be available for admin projects endpoint"


if __name__ == "__main__":
    test_admin_projects_endpoint_exists()
    test_admin_projects_endpoint_structure()
    print("All tests passed!")