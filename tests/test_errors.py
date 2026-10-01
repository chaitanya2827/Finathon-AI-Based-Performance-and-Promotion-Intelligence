"""
ZEROBUGS HRM-05: Error Handling and API Robustness Test Suite.
Validates safe error responses (404 Not Found, 422 Unprocessable Entity, 405 Method Not Allowed),
ensuring no stack traces, secrets, database internals, or file paths are leaked.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_error_non_existent_employee_404():
    """Verify that non-existent employee IDs return clean 404 responses."""
    endpoints = [
        "/api/employees/EMP_DOES_NOT_EXIST",
        "/api/employees/EMP_DOES_NOT_EXIST/evidence",
        "/api/employees/EMP_DOES_NOT_EXIST/goals",
        "/api/employees/EMP_DOES_NOT_EXIST/projects",
        "/api/employees/EMP_DOES_NOT_EXIST/feedback",
        "/api/employees/EMP_DOES_NOT_EXIST/skills",
        "/api/employees/EMP_DOES_NOT_EXIST/training",
        "/api/employees/EMP_DOES_NOT_EXIST/attendance",
        "/api/employees/EMP_DOES_NOT_EXIST/business-impact",
        "/api/employees/EMP_DOES_NOT_EXIST/manager-evaluations",
        "/api/employees/EMP_DOES_NOT_EXIST/performance",
        "/api/employees/EMP_DOES_NOT_EXIST/gaps",
        "/api/employees/EMP_DOES_NOT_EXIST/career",
        "/api/employees/EMP_DOES_NOT_EXIST/promotion",
        "/api/calibration/EMP_DOES_NOT_EXIST",
        "/api/analyze/EMP_DOES_NOT_EXIST"
    ]
    for url in endpoints:
        res = client.get(url)
        assert res.status_code == 404, f"Expected 404 for GET {url}, got {res.status_code}"
        data = res.json()
        assert "detail" in data
        assert "not found" in data["detail"].lower()


def test_post_analyze_invalid_employee_404():
    """Verify POST /api/analyze with invalid employee returns 404."""
    res = client.post("/api/analyze/INVALID_999")
    assert res.status_code == 404
    data = res.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()


def test_validation_error_422_on_invalid_query_params():
    """Verify 422 Unprocessable Entity when passing non-integer pagination params."""
    res = client.get("/api/employees?skip=abc&limit=xyz")
    assert res.status_code == 422
    data = res.json()
    assert "detail" in data
    # Error message should not leak internals
    error_str = str(data)
    assert "Traceback" not in error_str
    assert "password" not in error_str
    assert "secret" not in error_str


def test_method_not_allowed_405():
    """Verify 405 Method Not Allowed when calling wrong HTTP method on route."""
    res = client.delete("/api/employees/EMP001")
    assert res.status_code == 405
    data = res.json()
    assert "detail" in data


def test_error_response_does_not_leak_internals():
    """Verify error responses never expose server filesystem paths or secrets."""
    res = client.get("/api/employees/SOME_INVALID_ID")
    content = res.text
    assert "C:\\" not in content
    assert "/home/" not in content
    assert "sqlite3.OperationalError" not in content
    assert "Traceback (most recent call last)" not in content
