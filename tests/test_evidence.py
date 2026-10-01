"""
ZEROBUGS HRM-05: Raw Evidence Dimensions Test Suite.
Validates aggregated evidence packages and individual evidence endpoints across
all 8 dimensions for demo personas and organization employees.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_aggregated_evidence_package():
    """Verify aggregated 9-dimension evidence package structure."""
    response = client.get("/api/employees/EMP001/evidence")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP001"
    assert "evidence" in data
    ev = data["evidence"]
    assert "goals" in ev and isinstance(ev["goals"], list)
    assert "projects" in ev and isinstance(ev["projects"], list)
    assert "feedback" in ev and isinstance(ev["feedback"], list)
    assert "skills" in ev and isinstance(ev["skills"], list)
    assert "training" in ev and isinstance(ev["training"], list)
    assert "attendance" in ev and isinstance(ev["attendance"], list)
    assert "business_impact" in ev and isinstance(ev["business_impact"], list)
    assert "manager_evaluations" in ev and isinstance(ev["manager_evaluations"], list)


def test_individual_evidence_endpoints_elena():
    """Verify individual evidence endpoints for Elena Rostova (EMP001)."""
    endpoints = [
        "goals",
        "projects",
        "feedback",
        "skills",
        "training",
        "attendance",
        "business-impact",
        "manager-evaluations"
    ]
    for ep in endpoints:
        res = client.get(f"/api/employees/EMP001/{ep}")
        assert res.status_code == 200, f"Endpoint /api/employees/EMP001/{ep} failed"
        items = res.json()
        assert isinstance(items, list), f"Expected list for {ep}"
        assert len(items) > 0, f"Expected non-empty list for EMP001 {ep}"


def test_goals_evidence_structure():
    """Verify structure and numeric integrity of goals."""
    res = client.get("/api/employees/EMP001/goals")
    assert res.status_code == 200
    goals = res.json()
    assert len(goals) >= 2
    for g in goals:
        assert "title" in g
        assert "progress_pct" in g
        assert isinstance(g["progress_pct"], (int, float))
        assert "verification_evidence" in g


def test_projects_evidence_structure():
    """Verify projects evidence and handling of technical vs design roles."""
    # Technical role (Elena): code_quality_score is present
    res_tech = client.get("/api/employees/EMP001/projects")
    assert res_tech.status_code == 200
    projects_tech = res_tech.json()
    assert len(projects_tech) >= 1
    assert projects_tech[0]["code_quality_score"] is not None

    # UX/Design role (Priya): code_quality_score can be None without causing errors
    res_ux = client.get("/api/employees/EMP003/projects")
    assert res_ux.status_code == 200
    projects_ux = res_ux.json()
    assert len(projects_ux) >= 1
    assert projects_ux[0]["delivered_on_time"] is True


def test_feedback_ratings_and_sentiments():
    """Verify 360 feedback ratings and sentiment distribution."""
    res = client.get("/api/employees/EMP003/feedback")
    assert res.status_code == 200
    feedbacks = res.json()
    assert len(feedbacks) >= 2
    for fb in feedbacks:
        assert 1.0 <= fb["rating"] <= 5.0
        assert fb["sentiment"] in ["positive", "neutral", "constructive"]
        assert len(fb["comments"]) > 0


def test_manager_evaluations_ratings():
    """Verify manager evaluation records for EMP001, EMP002, EMP003."""
    for emp_id, min_rating, max_rating in [("EMP001", 4.5, 5.0), ("EMP002", 3.8, 4.5), ("EMP003", 2.0, 3.2)]:
        res = client.get(f"/api/employees/{emp_id}/manager-evaluations")
        assert res.status_code == 200
        evals = res.json()
        assert len(evals) >= 1
        rating = evals[0]["rating"]
        assert min_rating <= rating <= max_rating
