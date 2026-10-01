"""
ZEROBUGS HRM-05: Health and General API Endpoint Tests.
Validates system status, database connectivity, and OpenAPI documentation endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint_healthy():
    """Verify health endpoint returns 200 and healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["backend"] == "online"
    assert data["database"] == "sqlite_ready"
    assert data["employee_count"] == 30
    assert "version" in data


def test_root_endpoint():
    """Verify root endpoint returns operational metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["code"] == "HRM-05"
    assert "phase" in data
    assert data["docs_url"] == "/docs"


def test_openapi_schema_accessible():
    """Verify OpenAPI JSON schema is accessible and contains required API paths."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "paths" in schema
    paths = schema["paths"]

    # Verify key routes are present in OpenAPI spec
    assert "/api/health" in paths
    assert "/api/employees" in paths
    assert "/api/employees/{employee_id}" in paths
    assert "/api/employees/{employee_id}/evidence" in paths
    assert "/api/employees/{employee_id}/performance" in paths
    assert "/api/employees/{employee_id}/gaps" in paths
    assert "/api/employees/{employee_id}/career" in paths
    assert "/api/employees/{employee_id}/promotion" in paths
    assert "/api/calibration" in paths
    assert "/api/calibration/{employee_id}" in paths
    assert "/api/analyze/{employee_id}" in paths


def test_swagger_docs_accessible():
    """Verify interactive Swagger UI docs page loads with 200 OK."""
    response = client.get("/docs")
    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")
