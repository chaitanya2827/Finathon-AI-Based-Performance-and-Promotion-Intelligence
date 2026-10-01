# ZEROBUGS HRM-05: Data Dictionary (Phase 2 Synthetic Dataset)

This document describes all entities, fields, data types, constraints, and relationships for the primary synthetic HR dataset (`data/synthetic_hr_data.json`) utilized across ZEROBUGS.

---

## 1. Roles (`roles`)
Catalog of organizational job positions and seniority benchmarks.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique role identifier (e.g. `ROLE_SR_SWE`, `ROLE_TECH_LEAD`). |
| `name` | String | Descriptive title of the position. |
| `department` | String | Department unit (Engineering, Data, Design, Product, QA, Operations, HR). |
| `description` | String | Core responsibilities and scope of the role. |

---

## 2. Skills (`skills`)
Catalog of core technical, architectural, product, and leadership competencies.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique skill identifier (e.g. `SKILL_PY`, `SKILL_DIST_SYS`). |
| `name` | String | Human-readable skill name. |
| `category` | String | Categorization (Technical, Architecture, Cloud & DevOps, Leadership & Soft Skills, Product & Design, Engineering Quality). |
| `description` | String | Capability definition and evaluation scope. |

---

## 3. Role Required Skills (`role_requirements`)
Mapping defining benchmark skill proficiencies required for promotion into target roles.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique requirement identifier (e.g. `REQ_TL_1`). |
| `role_id` | String (FK) | Reference to `roles.id`. |
| `skill_id` | String (FK) | Reference to `skills.id`. |
| `required_level` | Integer (1–5) | Benchmark proficiency needed (1=Beginner to 5=Expert). |
| `is_mandatory` | Boolean | Whether promotion demands strict fulfillment of this competency. |

---

## 4. Employees (`employees`)
Core organizational profile for each worker in the 30-employee roster.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Auto-increment primary key. |
| `employee_id` | String (Unique) | Corporate identifier (e.g. `EMP001` - `EMP030`). |
| `name` | String | Full employee name. |
| `email` | String (Unique) | Fictional enterprise email. |
| `department` | String | Department division. |
| `current_role_id` | String (FK) | Reference to current job in `roles.id`. |
| `target_role_id` | String (FK) | Reference to next target role in `roles.id`. |
| `manager_id` | String (FK, Nullable) | Reference to supervising employee (`employees.employee_id`). |
| `hire_date` | String (YYYY-MM-DD) | Start date baseline. |
| `avatar_url` | String (URL) | Portrait asset URL for frontend UI display. |

---

## 5. Goals / OKRs (`goals`)
Quantified quarterly key results and objectives.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique goal identifier (e.g. `GOAL_EMP001_1`). |
| `employee_id` | String (FK) | Reference to `employees.employee_id`. |
| `title` | String | Objective title and milestone. |
| `category` | String | Delivery, Quality, Leadership, Innovation, Cost Optimization, Customer. |
| `target_value` | Float | Target deliverable metric. |
| `achieved_value` | Float | Actual recorded performance value. |
| `metric_unit` | String | Measurement unit (`%`, `queries`, `score`, `sessions`). |
| `progress_pct` | Float (0–100) | Completion percentage. |
| `verification_evidence` | String | Objective documentation citation or telemetry proof. |

---

## 6. Projects (`projects`)
Major project deliverables, code quality scores, and timeliness tracking.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique project identifier (e.g. `PRJ_EMP001_1`). |
| `employee_id` | String (FK) | Contributor reference (`employees.employee_id`). |
| `project_name` | String | Initiative name. |
| `role_in_project` | String | Scope of contribution (Lead Architect, Specialist, Contributor). |
| `deliverables` | String | Functional deliverables summary. |
| `delivered_on_time` | Boolean | Schedule milestone adherence. |
| `code_quality_score` | Float (1.0–5.0, Nullable) | Automated code review rating (nullable for non-software roles). |
| `outcome_evidence` | String | Verifiable business outcome or release record. |

---

## 7. 360 Feedback (`feedback`)
Multi-perspective performance reviews from peers, managers, and stakeholders.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique feedback identifier (e.g. `FB_EMP001_1`). |
| `employee_id` | String (FK) | Recipient reference (`employees.employee_id`). |
| `reviewer_type` | String | Evaluator role (`peer`, `manager`, `stakeholder`). |
| `rating` | Float (1.0–5.0) | Numerical satisfaction rating. |
| `comments` | String | Qualitative review narrative. |
| `sentiment` | String | Classified sentiment (`positive`, `neutral`, `mixed`, `negative`). |

---

## 8. Employee Skills (`employee_skills`)
Assessed competency proficiencies for each individual.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique record ID (e.g. `ES_EMP001_1`). |
| `employee_id` | String (FK) | Reference to `employees.employee_id`. |
| `skill_id` | String (FK) | Reference to `skills.id`. |
| `proficiency_level` | Integer (1–5) | Assessed capability (1=Beginner, 5=Expert). |
| `verification_proof` | String | Verifiable artifact (ADR, certification, codebase citation). |

---

## 9. Training & Development (`training`)
Continuous professional learning and development courses.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique training ID (e.g. `TRN_EMP001_1`). |
| `employee_id` | String (FK) | Reference to `employees.employee_id`. |
| `course_name` | String | Training course or curriculum title. |
| `provider` | String | Training institute or internal portal. |
| `completion_status` | String | Status (`completed`, `in_progress`, `planned`). |
| `completion_date` | String (Nullable) | Completion date (YYYY-MM-DD). |
| `skill_area` | String | Associated domain area. |

---

## 10. Attendance & Reliability (`attendance`)
Operational dependability, sprint presence, and SLA adherence.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique record identifier (e.g. `ATT_EMP001`). |
| `employee_id` | String (FK) | Reference to `employees.employee_id`. |
| `period` | String | Evaluation period (e.g. `2026-H1`). |
| `working_days` | Integer | Total scheduled working days. |
| `days_present` | Integer | Recorded days present. |
| `attendance_pct` | Float (0–100) | Punctuality percentage. |
| `reliability_notes` | String | Qualitative reliability observations. |

---

## 11. Business Impact (`business_impact`)
Quantified organizational, financial, and operational contributions.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique impact identifier (e.g. `BI_EMP001_1`). |
| `employee_id` | String (FK) | Reference to `employees.employee_id`. |
| `impact_type` | String | Category (`cost_savings`, `productivity`, `revenue`, `quality`, `customer_impact`). |
| `metric_name` | String | Measurable impact indicator. |
| `value` | String | Numeric or quantified value string (e.g. `420000`, `28`). |
| `metric_unit` | String | Unit of measure (`USD`, `percent`, `hours_per_week`). |
| `description` | String | Explanation of contribution. |
| `evidence` | String | Audit trail or financial verification record. |

---

## 12. Manager Evaluations (`manager_evaluations`)
Formal appraisal ratings submitted by people managers.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (PK) | Unique evaluation ID (e.g. `ME_EMP001_1`). |
| `employee_id` | String (FK) | Reference to `employees.employee_id`. |
| `manager_name` | String | Name of evaluating manager. |
| `rating` | Float (1.0–5.0) | Formal numerical appraisal score. |
| `evaluation_cycle` | String | Appraisal cycle (`2026-H1`). |
| `comments` | String | Manager's formal evaluation feedback. |
| `evaluation_date` | String (YYYY-MM-DD) | Submission timestamp. |
