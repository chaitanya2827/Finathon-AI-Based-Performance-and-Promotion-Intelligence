"""
ZEROBUGS HRM-05: Employee Endpoints Test Suite.
Validates employee retrieval, pagination, all 30 employee personas,
and demo employee profiles (EMP001, EMP002, EMP003).
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_get_all_employees():
    """Verify retrieval of employee directory with exact count of 30 employees."""
    response = client.get("/api/employees")
    assert response.status_code == 200
    employees = response.json()
    assert isinstance(employees, list)
    assert len(employees) == 30

    # Verify structural integrity of employee object
    first = employees[0]
    assert "employee_id" in first
    assert "name" in first
    assert "department" in first
    assert "current_role" in first
    assert "target_role" in first


def test_get_all_30_individual_employees():
    """Verify that every single employee (EMP001 - EMP030) can be retrieved by ID."""
    for idx in range(1, 31):
        emp_id = f"EMP{idx:03d}"
        response = client.get(f"/api/employees/{emp_id}")
        assert response.status_code == 200, f"Failed to retrieve {emp_id}"
        data = response.json()
        assert data["employee_id"] == emp_id
        assert data["name"] is not None
        assert data["department"] is not None
        assert data["current_role"] is not None
        assert data["target_role"] is not None


def test_demo_employee_elena_rostova():
    """Verify Elena Rostova profile (EMP001)."""
    response = client.get("/api/employees/EMP001")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP001"
    assert data["name"] == "Elena Rostova"
    assert data["department"] == "Engineering"
    assert data["current_role"]["name"] == "Senior Software Engineer"
    assert data["target_role"]["name"] == "Tech Lead"


def test_demo_employee_marcus_chen():
    """Verify Marcus Chen profile (EMP002)."""
    response = client.get("/api/employees/EMP002")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP002"
    assert data["name"] == "Marcus Chen"
    assert data["department"] == "Data"
    assert data["current_role"]["name"] == "Data Engineer"
    assert data["target_role"]["name"] == "Senior Data Engineer"


def test_demo_employee_priya_sharma():
    """Verify Priya Sharma profile (EMP003)."""
    response = client.get("/api/employees/EMP003")
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP003"
    assert data["name"] == "Priya Sharma"
    assert data["department"] == "Design"
    assert data["current_role"]["name"] == "UX Lead"
    assert data["target_role"]["name"] == "Director of Product Design"


def test_get_employees_pagination():
    """Verify pagination parameters (skip, limit)."""
    response = client.get("/api/employees?skip=0&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5

    response_skip = client.get("/api/employees?skip=5&limit=5")
    assert response_skip.status_code == 200
    data_skip = response_skip.json()
    assert len(data_skip) == 5
    assert data[0]["employee_id"] != data_skip[0]["employee_id"]
