"""
ZEROBUGS HRM-05: Manager Calibration & Inconsistency Detection Test Suite.
Validates organization-wide calibration summaries, single-employee variance analysis,
and neutral inconsistency flagging on Priya Sharma (EMP003).
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_org_wide_calibration():
    """Verify organization-wide calibration returns all 30 evaluated employees."""
    response = client.get("/api/calibration")
    assert response.status_code == 200
    data = response.json()
    assert data["total_evaluated"] == 30
    assert data["flagged_count"] > 0
    assert data["aligned_count"] > 0
    assert data["flagged_count"] + data["aligned_count"] == 30
    assert isinstance(data["average_variance"], (int, float))
    assert data["variance_threshold"] == 20.0
    assert len(data["all_evaluations"]) == 30
    assert len(data["flagged_evaluations"]) == data["flagged_count"]


def test_calibration_elena_aligned():
    """Verify Elena Rostova (EMP001) evaluation is aligned with objective evidence."""
    response = client.get("/api/calibration/EMP001")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP001"
    assert data["employee_name"] == "Elena Rostova"
    assert data["manager_rating"] == 4.8
    assert data["manager_normalized_score"] == 96.0
    assert abs(data["variance"]) < 20.0
    assert data["flag"] is False
    assert data["review_recommended"] is False
    assert "aligned" in data["message"].lower()


def test_calibration_marcus_aligned():
    """Verify Marcus Chen (EMP002) evaluation is aligned with evidence."""
    response = client.get("/api/calibration/EMP002")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP002"
    assert data["manager_rating"] == 4.1
    assert data["manager_normalized_score"] == 82.0
    assert abs(data["variance"]) < 20.0
    assert data["flag"] is False
    assert data["review_recommended"] is False


def test_calibration_priya_inconsistency_flag():
    """
    Verify Priya Sharma (EMP003) naturally triggers the neutral inconsistency flag.
    Discrepancy: Manager 2.8 (56.0) vs Evidence (~96.83), variance < -20.
    """
    response = client.get("/api/calibration/EMP003")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP003"
    assert data["manager_rating"] == 2.8
    assert data["manager_normalized_score"] == 56.0
    assert data["evidence_score"] > 90.0
    assert data["variance"] < -20.0
    assert data["flag"] is True
    assert data["review_recommended"] is True
    assert data["message"] == "Potential evaluation inconsistency detected."

    # Neutrality verification: zero accusatory or bias language
    msg_lower = data["message"].lower()
    assert "bias" not in msg_lower
    assert "unfair" not in msg_lower
    assert "wrong" not in msg_lower
