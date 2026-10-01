"""
ZEROBUGS HRM-05: AI Analysis and Promotion Intelligence Test Suite.
Validates performance evaluation, skill gap detection, career roadmaps,
promotion readiness, and end-to-end analysis orchestration & persistence.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_performance_endpoint_elena():
    """Verify performance analysis for Elena Rostova (EMP001)."""
    res = client.get("/api/employees/EMP001/performance")
    assert res.status_code == 200
    data = res.json()
    assert data["employee_id"] == "EMP001"
    assert data["performance_score"] >= 90.0
    assert "components" in data
    comps = data["components"]
    assert comps["goal_score"] >= 90.0
    assert comps["project_score"] >= 90.0
    assert comps["feedback_score"] >= 90.0
    assert comps["reliability_score"] >= 90.0
    assert comps["business_impact_score"] >= 90.0
    assert "weights" in data
    assert data["weights"]["goals"] == 0.30
    assert data["weights"]["projects"] == 0.25
    assert data["weights"]["feedback"] == 0.20
    assert data["weights"]["reliability"] == 0.10
    assert data["weights"]["business_impact"] == 0.15


def test_skill_gaps_endpoint_marcus():
    """Verify critical mandatory skill gap detection for Marcus Chen (EMP002)."""
    res = client.get("/api/employees/EMP002/gaps")
    assert res.status_code == 200
    data = res.json()
    assert data["employee_id"] == "EMP002"
    assert data["target_role_name"] == "Senior Data Engineer"
    crit_gaps = data["critical_gaps"]
    crit_names = [g["skill_name"] for g in crit_gaps]
    assert "Distributed Systems" in crit_names
    assert "Kubernetes" in crit_names

    # Check Kubernetes gap size: current 1, required 3 -> gap 2
    k8s = next(g for g in crit_gaps if g["skill_name"] == "Kubernetes")
    assert k8s["current_level"] == 1
    assert k8s["required_level"] == 3
    assert k8s["gap"] == 2
    assert k8s["is_mandatory"] is True


def test_career_endpoint_structure_and_disclaimer():
    """Verify career roadmap produces 4 milestones and non-authoritative disclaimer."""
    res = client.get("/api/employees/EMP001/career")
    assert res.status_code == 200
    data = res.json()
    assert data["employee_id"] == "EMP001"
    assert "milestones" in data
    assert len(data["milestones"]) == 4
    assert "recommended_development_actions" in data
    assert len(data["recommended_development_actions"]) > 0
    assert "recommendation engine" in data["disclaimer"].lower()


def test_promotion_readiness_endpoint_elena():
    """Verify promotion readiness evaluates Elena as 'Ready Now'."""
    res = client.get("/api/employees/EMP001/promotion")
    assert res.status_code == 200
    data = res.json()
    assert data["employee_id"] == "EMP001"
    assert data["readiness_level"] == "Ready Now"
    assert data["human_review_required"] is True
    assert "Final promotion decisions remain with HR and managers." in data["disclaimer"]
    assert "readiness_assessment_note" in data


def test_promotion_readiness_endpoint_marcus():
    """Verify promotion readiness evaluates Marcus as 'Developing - Ready in 6-12 Months'."""
    res = client.get("/api/employees/EMP002/promotion")
    assert res.status_code == 200
    data = res.json()
    assert data["employee_id"] == "EMP002"
    assert data["readiness_level"] == "Developing - Ready in 6-12 Months"
    assert data["human_review_required"] is True


def test_post_analyze_orchestrator_and_idempotency():
    """Verify POST /api/analyze/{employee_id} persists and updates idempotently."""
    # First execution
    res1 = client.post("/api/analyze/EMP001")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["employee"]["employee_id"] == "EMP001"
    assert data1["promotion"]["readiness_level"] == "Ready Now"
    assert data1["persisted"] is True

    # Second execution (must not create duplicate records or crash)
    res2 = client.post("/api/analyze/EMP001")
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["employee"]["employee_id"] == "EMP001"
    assert data2["promotion"]["readiness_level"] == "Ready Now"
    assert data2["persisted"] is True


def test_get_analyze_convenience_endpoint():
    """Verify GET /api/analyze/{employee_id} convenience endpoint."""
    res = client.get("/api/analyze/EMP002")
    assert res.status_code == 200
    data = res.json()
    assert data["employee"]["employee_id"] == "EMP002"
    assert data["promotion"]["readiness_level"] == "Developing - Ready in 6-12 Months"
