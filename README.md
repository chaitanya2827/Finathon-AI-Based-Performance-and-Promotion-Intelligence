# ZEROBUGS — HRM-05: AI-Based Performance & Promotion Intelligence

An evidence-based, transparent, and explainable AI intelligence platform for performance appraisal, development gap detection, career path recommendations, promotion readiness, and manager evaluation calibration.

---

## Project Overview

Traditional performance and promotion workflows often suffer from subjective bias, recency bias, and unexplainable opaque scoring metrics. **ZEROBUGS (HRM-05)** eliminates black-box evaluations by synthesizing observable, verifiable employee signals across 9 evidence dimensions:

1. **Employee Profile** (Core organizational metadata for 30 employees)
2. **Goals / OKRs** (Quantitative metrics with objective proof)
3. **Projects** (On-time delivery, code review scores, and outcome evidence)
4. **360 Feedback** (Multi-perspective feedback from peers, leads, and partners)
5. **Skills & Proficiency** (Competency levels 1–5 with concrete artifacts)
6. **Training & Development** (Continuous learning and course hours)
7. **Attendance & Reliability** (Sprint presence and operational dependability)
8. **Business Impact** (Commercial, latency, and cost reduction outcomes)
9. **Manager Evaluations** (Formal ratings and rationale for calibration)

> **Core Philosophy:** The AI assists by synthesizing evidence, identifying skill gaps, and flagging evaluation anomalies. The final promotion decision remains a human/HR responsibility.

---

## Current Architecture & Phase Status

### Phase 1–4: Backend Architecture, Dataset, AI Analytics & Hardening Complete
- **Phase 1**: FastAPI project skeleton, architecture, and modular structure.
- **Phase 2**: Comprehensive 30-employee synthetic dataset across 9 dimensions, SQLite database with 13 tables, SQLAlchemy ORM, and repository layer.
- **Phase 3**: 5 AI intelligence services (performance scoring, skill gaps, career roadmap, promotion readiness, calibration) and end-to-end analysis orchestration with human-in-the-loop decision-support wording.
- **Phase 4**: Backend hardening, CORS configuration, database session safety, response consistency, comprehensive 65-test automated suite, smoke testing, and regression verification across all 30 employees.

---

## Project Directory Structure

```text
ZEROBUGS/
│
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── main.py                    # FastAPI application entry point
│       ├── config.py                  # Environment configuration & settings
│       │
│       ├── database/
│       │   ├── __init__.py
│       │   ├── base.py                # SQLAlchemy declarative base
│       │   ├── database.py            # SQLite engine & SessionLocal
│       │   ├── init_db.py             # Idempotent table & seed initialization
│       │   ├── repository.py          # Clean data access layer
│       │   ├── validate_data.py       # Dataset integrity validator
│       │   └── verify_db.py           # SQLite verification script
│       │
│       ├── models/                    # SQLAlchemy ORM models
│       │   ├── employee.py
│       │   ├── role.py
│       │   ├── skill.py
│       │   ├── role_required_skill.py
│       │   ├── goal.py
│       │   ├── project.py
│       │   ├── feedback.py
│       │   ├── employee_skill.py
│       │   ├── training.py
│       │   ├── attendance.py
│       │   ├── business_impact.py
│       │   ├── manager_evaluation.py
│       │   └── analysis_result.py
│       │
│       ├── schemas/                   # Pydantic v2 serialization schemas
│       │   ├── employee.py
│       │   ├── role.py
│       │   ├── skill.py
│       │   ├── goal.py
│       │   ├── project.py
│       │   ├── feedback.py
│       │   ├── training.py
│       │   ├── attendance.py
│       │   ├── business_impact.py
│       │   ├── manager_evaluation.py
│       │   └── analysis_result.py
│       │
│       ├── api/
│       │   ├── __init__.py
│       │   └── employees.py           # Read-only REST API endpoints
│       │
│       └── services/                  # Business & AI analytics services (Phase 3)
│
├── data/
│   ├── synthetic_hr_data.json         # Primary synthetic dataset (30 employees)
│   ├── data_dictionary.md             # Dataset data dictionary
│   ├── validation_report.md           # Dataset validation report
│   ├── employees.csv                  # CSV exports for inspection
│   └── ...
│
├── docs/
│   └── data-model.md                  # Comprehensive schema documentation
│
├── tests/
│   └── test_phase2.py                 # Automated unit and API test suite
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Quick Start Guide

### 1. Prerequisites
- **Python**: Version 3.10+ (tested on Python 3.14)
- **Node.js**: Version 18+ (for upcoming frontend integration)

### 2. Setup Virtual Environment & Install Dependencies

```powershell
# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 3. Validate Synthetic Dataset

Run the automated integrity validator to test all 9 evidence dimensions and referential consistency:

```powershell
python -m backend.app.database.validate_data
```

### 4. Initialize Database

Create SQLite tables and populate the 30-employee dataset idempotently:

```powershell
python -m backend.app.database.init_db
```

### 5. Verify Database

Verify database file existence, tables, and record counts:

```powershell
python -m backend.app.database.verify_db
```

### 6. Run the FastAPI Server

Start the server with hot reload:

```powershell
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### 7. Interactive API Documentation (Swagger)

Open your browser to:
- **Interactive Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## Backend API

### Starting the Backend

```powershell
# Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Run the FastAPI server with hot-reload
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

- **Base API URL:** `http://127.0.0.1:8000`
- **Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check Endpoint:** [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Major Endpoint Groups

| Group | Method & Route | Description |
| :--- | :--- | :--- |
| **System** | `GET /api/health` | Backend connectivity & SQLite database health check |
| **Employees** | `GET /api/employees` | List all 30 employees with pagination support (`skip`, `limit`) |
| | `GET /api/employees/{employee_id}` | Detailed employee profile by corporate ID (`EMP001` - `EMP030`) |
| | `GET /api/employees/{employee_id}/evidence` | Aggregated 9-dimension evidence package for an employee |
| **Raw Evidence** | `GET /api/employees/{employee_id}/goals` | Quarterly OKRs and goal completion records |
| | `GET /api/employees/{employee_id}/projects` | Project deliverables, on-time status, code quality |
| | `GET /api/employees/{employee_id}/feedback` | 360-degree peer and stakeholder reviews |
| | `GET /api/employees/{employee_id}/skills` | Evaluated competencies and proficiency levels |
| | `GET /api/employees/{employee_id}/training` | Completed and in-progress training coursework |
| | `GET /api/employees/{employee_id}/attendance` | Operational presence and reliability logs |
| | `GET /api/employees/{employee_id}/business-impact` | Commercial, latency, and cost-reduction impact |
| | `GET /api/employees/{employee_id}/manager-evaluations` | Manager review ratings and qualitative feedback |
| **AI Analytics** | `GET /api/employees/{employee_id}/performance` | 5-dimension normalized performance score & component breakdown |
| | `GET /api/employees/{employee_id}/gaps` | Skill deficit calculation against target role expectations |
| | `GET /api/employees/{employee_id}/career` | 4-step developmental roadmap & milestone actions |
| | `GET /api/employees/{employee_id}/promotion` | Promotion readiness level & supporting evidence |
| **Calibration** | `GET /api/calibration` | Organization-wide manager evaluation calibration |
| | `GET /api/calibration/{employee_id}` | Single employee evaluation variance & neutral flag |
| **Orchestration** | `POST /api/analyze/{employee_id}` | End-to-end analytics, offline reasoning & persistence |
| | `GET /api/analyze/{employee_id}` | Convenience retrieval/trigger for complete intelligence |

### Running Tests

```powershell
# Run full automated test suite (65 tests across all modules)
pytest

# Run automated smoke test against live running backend
python tests/smoke_test.py

# Run specific test modules
pytest tests/test_health.py tests/test_employees.py tests/test_analysis.py
```

---

## Demo Personas in Seed Dataset

| Persona | Role | Scenario | Key Evidence Highlights |
| :--- | :--- | :--- | :--- |
| **Elena Rostova** (`EMP001`) | Senior Software Engineer → Tech Lead | **Promotion Ready** | 98% OKRs, $420k cloud cost reduction, 4.9 peer review, 4.8 manager rating, 5/5 in Python & System Design. Ready for Tech Lead. |
| **Marcus Chen** (`EMP002`) | Data Engineer → Senior Data Engineer | **Skill Gaps Identified** | 94% OKR delivery, reliable batch ETL pipelines, but clear gaps in Distributed Systems (Level 2/3) and Kubernetes (Level 1/3) for Senior Data Engineer. |
| **Priya Sharma** (`EMP003`) | UX Lead → Director of Product Design | **Evaluation Inconsistency Detected** | 94 SUS score, 28% trial conversion lift, 4.83/5 peer reviews, but manager evaluation is 2.8/5 due to subjective recency bias. Neutral flag: *"Potential evaluation inconsistency detected."* |
