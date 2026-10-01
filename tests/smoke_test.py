"""
ZEROBUGS HRM-05: API Smoke Test Script.
Executes an end-to-end smoke test against the running backend server.
Can be executed directly via: python tests/smoke_test.py
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"


def run_smoke_test():
    print("=" * 60)
    print("ZEROBUGS HRM-05: API Smoke Test Suite")
    print(f"Target Server: {BASE_URL}")
    print("=" * 60)

    checks = []

    def log_result(step_num, name, passed, details=""):
        status_text = "PASS" if passed else "FAIL"
        checks.append((name, passed))
        print(f"[{status_text}] Step {step_num}: {name} {details}")

    # 1. Health
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/health", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and data.get("status") == "healthy"
            log_result(1, "GET /api/health", ok, f"(count: {data.get('employee_count')})")
    except Exception as e:
        log_result(1, "GET /api/health", False, f"Error: {e}")
        print("\nERROR: Backend server does not appear to be running on port 8000.")
        print("Please ensure: uvicorn backend.app.main:app --reload is running.")
        sys.exit(1)

    # 2. Employees directory
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and len(data) == 30
            log_result(2, "GET /api/employees", ok, f"(retrieved {len(data)} employees)")
    except Exception as e:
        log_result(2, "GET /api/employees", False, str(e))

    # 3. EMP001 (Elena Rostova)
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees/EMP001", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and data["name"] == "Elena Rostova"
            log_result(3, "GET /api/employees/EMP001", ok, f"({data['name']} - {data['current_role']['name']})")
    except Exception as e:
        log_result(3, "GET /api/employees/EMP001", False, str(e))

    # 4. EMP002 (Marcus Chen)
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees/EMP002", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and data["name"] == "Marcus Chen"
            log_result(4, "GET /api/employees/EMP002", ok, f"({data['name']} - {data['current_role']['name']})")
    except Exception as e:
        log_result(4, "GET /api/employees/EMP002", False, str(e))

    # 5. EMP003 (Priya Sharma)
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees/EMP003", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and data["name"] == "Priya Sharma"
            log_result(5, "GET /api/employees/EMP003", ok, f"({data['name']} - {data['current_role']['name']})")
    except Exception as e:
        log_result(5, "GET /api/employees/EMP003", False, str(e))

    # 6. Performance
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees/EMP001/performance", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and "performance_score" in data
            log_result(6, "GET /api/employees/EMP001/performance", ok, f"(score: {data['performance_score']})")
    except Exception as e:
        log_result(6, "GET /api/employees/EMP001/performance", False, str(e))

    # 7. Gaps
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees/EMP002/gaps", timeout=5) as r:
            data = json.loads(r.read().decode())
            gaps = [g["skill_name"] for g in data.get("critical_gaps", [])]
            ok = r.status == 200 and "Kubernetes" in gaps and "Distributed Systems" in gaps
            log_result(7, "GET /api/employees/EMP002/gaps", ok, f"(gaps: {gaps})")
    except Exception as e:
        log_result(7, "GET /api/employees/EMP002/gaps", False, str(e))

    # 8. Career
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees/EMP001/career", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and len(data.get("milestones", [])) == 4
            log_result(8, "GET /api/employees/EMP001/career", ok, f"({len(data.get('milestones', []))} milestones)")
    except Exception as e:
        log_result(8, "GET /api/employees/EMP001/career", False, str(e))

    # 9. Promotion
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/employees/EMP001/promotion", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and data.get("readiness_level") == "Ready Now"
            log_result(9, "GET /api/employees/EMP001/promotion", ok, f"(level: {data.get('readiness_level')})")
    except Exception as e:
        log_result(9, "GET /api/employees/EMP001/promotion", False, str(e))

    # 10. Calibration
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/calibration/EMP003", timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and data.get("flag") is True
            log_result(10, "GET /api/calibration/EMP003", ok, f"(flag: {data.get('flag')}, variance: {data.get('variance')})")
    except Exception as e:
        log_result(10, "GET /api/calibration/EMP003", False, str(e))

    # 11. Analyze POST
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/analyze/EMP001", data=b"", method="POST")
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read().decode())
            ok = r.status == 200 and data.get("persisted") is True
            log_result(11, "POST /api/analyze/EMP001", ok, f"(readiness: {data['promotion']['readiness_level']})")
    except Exception as e:
        log_result(11, "POST /api/analyze/EMP001", False, str(e))

    # Summary
    print("=" * 60)
    passed_count = sum(1 for _, p in checks if p)
    total_count = len(checks)
    print(f"SMOKE TEST SUMMARY: {passed_count}/{total_count} Passed")
    if passed_count == total_count:
        print("RESULT: ALL SMOKE TESTS PASSED!")
    else:
        print(f"RESULT: {total_count - passed_count} FAILED")
    print("=" * 60)

    return passed_count == total_count


if __name__ == "__main__":
    success = run_smoke_test()
    sys.exit(0 if success else 1)
