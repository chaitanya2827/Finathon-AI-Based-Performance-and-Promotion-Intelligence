# ZEROBUGS HRM-05: Data Model & Architecture Specification

## Overview

The ZEROBUGS platform (**HRM-05: AI-Based Performance & Promotion Intelligence**) relies on an evidence-based, transparent, and multi-dimensional data foundation. Rather than computing arbitrary or black-box evaluation scores, the system grounds every assessment in observable, verifiable employee signals across 9 evidence dimensions.

In Phase 2, this data model is fully realized using **SQLite** (`backend/app/database/zerobugs.db`) managed via **SQLAlchemy ORM** and serialized through **Pydantic v2** schemas.

---

## 1. Relational Entity Architecture

```
                  ┌──────────────┐
                  │    Roles     │
                  └──────┬───────┘
                         │ 1:N
                         ▼
┌──────────────┐  1:N   ┌──────────────┐  1:N   ┌─────────────────────┐
│  Employees   ├───────►│    Goals     │        │Role_Required_Skills │
└──────┬───────┘        └──────────────┘        └──────────┬──────────┘
       │                                                   │
       ├───────► Projects (1:N)                            │
       ├───────► Feedback (1:N)                            ▼
       ├───────► Employee_Skills (1:N) ◄─────────────── Skills
       ├───────► Training (1:N)
       ├───────► Attendance (1:N)
       ├───────► Business_Impact (1:N)
       ├───────► Manager_Evaluations (1:N)
       └───────► Analysis_Results (1:N)
```

---

## 2. Evidence Dimensions & Database Tables

### A. Employee Profile (`employees`)
Stores organizational, biographical, and hierarchy metadata for 30 employees (`EMP001` - `EMP030`).
- **`id`** (`Integer`, PK): Auto-increment identifier.
- **`employee_id`** (`String`, Unique, Index): Corporate identifier (e.g. `EMP001`).
- **`name`** (`String`): Full employee name.
- **`email`** (`String`, Unique, Index): Corporate email address.
- **`department`** (`String`, Index): Department unit (Engineering, Data, Design, Product, QA, Operations, HR, Marketing).
- **`current_role_id`** (`String`, FK → `roles.id`): Current job profile.
- **`target_role_id`** (`String`, FK → `roles.id`): Target promotion benchmark.
- **`manager_id`** (`String`, FK → `employees.employee_id`, Nullable): Direct supervisor (self-referential).
- **`hire_date`** (`String`, YYYY-MM-DD): Start date baseline.
- **`avatar_url`** (`String`, Nullable): UI portrait photo URL.

### B. Goals / OKRs (`goals`)
Quantified quarterly key results and objectives.
- **`id`** (`String`, PK): Unique goal ID (e.g., `GOAL_EMP001_1`).
- **`employee_id`** (`String`, FK → `employees.employee_id`): Owning employee.
- **`title`** (`String`): Objective title.
- **`category`** (`String`): Delivery, Quality, Productivity, Innovation, Customer, Leadership, Cost Optimization.
- **`target_value`** / **`achieved_value`** (`Float`): Quantified metrics.
- **`metric_unit`** (`String`): `%`, `queries`, `score`, `sessions`.
- **`progress_pct`** (`Float`, 0–100): Completion percentage.
- **`verification_evidence`** (`Text`): Jira Epics, telemetry dashboards, incident postmortems.

### C. Projects (`projects`)
Major project deliverables, code review quality scores, and schedule timeliness.
- **`id`** (`String`, PK): Unique project ID (e.g., `PRJ_EMP001_1`).
- **`employee_id`** (`String`, FK → `employees.employee_id`): Contributor ID.
- **`project_name`** (`String`): Initiative title.
- **`role_in_project`** (`String`): Lead Architect, Specialist, Core Contributor.
- **`deliverables`** (`Text`): Functional technical outputs.
- **`delivered_on_time`** (`Boolean`): Schedule adherence flag.
- **`code_quality_score`** (`Float`, 1.0–5.0, Nullable): Code review rating (NULL for non-technical roles).
- **`outcome_evidence`** (`Text`): Production release records and outcome verification.

### D. 360 Feedback (`feedback`)
Multi-perspective performance reviews from peers, managers, and cross-functional partners.
- **`id`** (`String`, PK): Unique feedback ID (e.g., `FB_EMP001_1`).
- **`employee_id`** (`String`, FK → `employees.employee_id`): Recipient.
- **`reviewer_type`** (`String`): `peer`, `manager`, `stakeholder`.
- **`rating`** (`Float`, 1.0–5.0): Structured rating.
- **`comments`** (`Text`): Qualitative appraisal narrative.
- **`sentiment`** (`String`): `positive`, `neutral`, `mixed`, `negative`.

### E. Skills & Proficiencies (`skills` & `employee_skills`)
Evaluated competencies and real-world execution proof.
- **`skill_id`** (`String`, FK → `skills.id`): Standard capability (e.g., `SKILL_PY`, `SKILL_DIST_SYS`, `SKILL_K8S`).
- **`proficiency_level`** (`Integer`, 1–5): Evaluated mastery level (1=Beginner, 5=Expert).
- **`verification_proof`** (`Text`): Verifiable artifacts (ADRs, certifications, codebase links).

### F. Training & Development (`training`)
Continuous professional learning and skill acquisition courses.
- **`id`** (`String`, PK): Unique training session ID.
- **`course_name`** (`String`): Curriculum title.
- **`provider`** (`String`): Training institute or academy.
- **`completion_status`** (`String`): `completed`, `in_progress`, `planned`.
- **`completion_date`** (`String`, Nullable): Completion timestamp.
- **`skill_area`** (`String`): Targeted competency domain.

### G. Attendance & Reliability (`attendance`)
Operational consistency, sprint presence, and dependability.
- **`id`** (`String`, PK): Unique attendance ID.
- **`period`** (`String`): Evaluation cycle (e.g., `2026-H1`).
- **`working_days`** / **`days_present`** (`Integer`): Attendance records.
- **`attendance_pct`** (`Float`, 0–100): Calculated presence percentage.
- **`reliability_notes`** (`Text`): On-call shift reliability, meeting attendance notes.

### H. Business Impact (`business_impact`)
Measurable commercial, architectural, and operational outcomes.
- **`id`** (`String`, PK): Unique impact identifier.
- **`impact_type`** (`String`): `cost_savings`, `productivity`, `revenue`, `quality`, `customer_impact`.
- **`metric_name`** (`String`): Specific indicator.
- **`value`** (`String`): Quantified metric value (e.g. `420000`, `15`, `28`).
- **`metric_unit`** (`String`): `USD`, `hours_per_week`, `percent`.
- **`description`** (`Text`): Contextual explanation.
- **`evidence`** (`Text`): Financial audit, analytics verification.

### I. Manager Evaluations (`manager_evaluations`)
Formal appraisal ratings submitted by people managers.
- **`id`** (`String`, PK): Unique evaluation ID.
- **`manager_name`** (`String`): Evaluator name.
- **`rating`** (`Float`, 1.0–5.0): Formal appraisal score.
- **`evaluation_cycle`** (`String`): Appraisal period (e.g. `2026-H1`).
- **`comments`** (`Text`): Manager's formal evaluation feedback.
- **`evaluation_date`** (`String`): Timestamp.

### J. Analysis Results (`analysis_results`)
Dedicated schema created in Phase 2 for storing explainable evaluations generated by the Phase 3 AI Engine.
- **`id`** (`String`, PK): Unique analysis ID.
- **`employee_id`** (`String`, FK → `employees.employee_id`): Evaluated employee.
- **`readiness_level`** (`String`): Promotion readiness tier (`Ready Now`, `Developing`, `Needs Foundation`).
- **`strengths`** (`Text`): JSON array of verified strengths.
- **`evidence_summary`** (`Text`): Synthesized multi-dimensional evidence ledger.
- **`missing_requirements`** (`Text`): JSON array of unmet role-required competencies.
- **`development_actions`** (`Text`): Tailored learning roadmap.
- **`calibration_details`** (`Text`): Discrepancy delta and neutral consistency flag.
- **`generated_at`** (`String`): Generation timestamp.

---

## 3. Demonstration Personas

| Persona | Employee ID | Role Transition | Scenario |
| :--- | :--- | :--- | :--- |
| **Elena Rostova** | `EMP001` | Senior Software Engineer → Tech Lead | **Strong Performer (Promotion Ready)**: 98% OKRs, 4.9 peer review, 4.8 manager rating, 5/5 in Python & System Design, $420k savings. |
| **Marcus Chen** | `EMP002` | Data Engineer → Senior Data Engineer | **Skill Gaps Identified**: Strong daily batch ETL delivery, but has clear gaps in Distributed Systems (2/5) and Kubernetes (1/5) vs target requirement (3/5). |
| **Priya Sharma** | `EMP003` | UX Lead → Director of Product Design | **Evaluation Inconsistency Detected**: 4.83/5 peer reviews, 94 SUS score, 28% ARR lift, but manager rated 2.8/5 due to isolated retro friction. Triggers neutral calibration flag. |

---

## 4. How Phase 3 AI & Analytics Engine Uses This Schema

1. **Performance Profile Engine**: Reads `goals`, `projects`, and `feedback` to assemble an objective performance profile.
2. **Skill Assessment & Gap Detection**: Compares `employee_skills` with `role_required_skills` for the employee's `target_role_id` to classify competencies into Strong, Developing, and Skill Gaps.
3. **Promotion Readiness Engine**: Evaluates OKR track records, mandatory skill gaps, and business impact to suggest readiness tiers with supporting evidence. Final decisions remain with human HR committees.
4. **Manager Evaluation Consistency Engine**: Compares manager evaluation score against composite objective evidence and generates neutral, fact-based flags: `"Potential evaluation inconsistency detected."`
