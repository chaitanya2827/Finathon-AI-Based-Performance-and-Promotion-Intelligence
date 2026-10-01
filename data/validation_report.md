# ZEROBUGS HRM-05: Dataset Validation Report

**Dataset:** `data/synthetic_hr_data.json`  
**Execution Timestamp:** 2026-09-30  
**Status:** **PASSED (100% Validated)**  

---

## 1. Summary Statistics

| Dimension | Record Count | Unique Key Constraint | Referential Integrity | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Roles** | 14 | 14 unique `id` | Valid | **PASS** |
| **Skills** | 18 | 18 unique `id` | Valid | **PASS** |
| **Role Requirements** | 33 | 33 unique `id` | All `role_id` & `skill_id` exist | **PASS** |
| **Employees** | 30 | 30 unique `employee_id`, 30 unique `email` | `current_role_id`, `target_role_id`, `manager_id` valid | **PASS** |
| **Goals / OKRs** | 61 | 61 unique `id` | All `employee_id` exist; progress 0–100% | **PASS** |
| **Projects** | 45 | 45 unique `id` | All `employee_id` exist; quality 1.0–5.0 | **PASS** |
| **360 Feedback** | 62 | 62 unique `id` | All `employee_id` exist; ratings 1.0–5.0 | **PASS** |
| **Employee Skills** | 167 | 167 unique `id` | All `employee_id` & `skill_id` exist; levels 1–5 | **PASS** |
| **Training & Development** | 33 | 33 unique `id` | All `employee_id` exist; valid status enum | **PASS** |
| **Attendance & Reliability** | 30 | 30 unique `id` | All `employee_id` exist; percentages 0–100% | **PASS** |
| **Business Impact** | 32 | 32 unique `id` | All `employee_id` exist; valid impact types | **PASS** |
| **Manager Evaluations** | 30 | 30 unique `id` | All `employee_id` exist; ratings 1.0–5.0 | **PASS** |

---

## 2. Demonstration Persona Verification

### Demo A: Elena Rostova (`EMP001`) — Strong Performer (Promotion Ready)
- **Current Role:** Senior Software Engineer (`ROLE_SR_SWE`) → **Target Role:** Tech Lead (`ROLE_TECH_LEAD`)
- **Goals:** 3 goals, progress 98.0%, 100.0%, 100.0% (Average OKR: 99.3%)
- **Projects:** 2 projects delivered on time with high code quality (4.8, 4.9); $420,000 annualized cost savings.
- **Feedback:** 3 reviews, ratings 4.9, 5.0, 4.8 (Average: 4.9/5, Sentiment: Positive)
- **Skills:** Python (5/5), System Design (5/5), Leadership (4/5), Communication (5/5) — Meets all mandatory Tech Lead requirements.
- **Attendance:** 99.2% attendance; 0 missed on-call shifts.
- **Manager Evaluation:** 4.8/5 from David Vance ("Elena consistently outperforms expectations... Strong promotion candidate.")
- **Result:** **PASS**

### Demo B: Marcus Chen (`EMP002`) — Good Performer with Skill Gaps
- **Current Role:** Data Engineer (`ROLE_DE`) → **Target Role:** Senior Data Engineer (`ROLE_SR_DE`)
- **Goals:** 2 goals, progress 94.0%, 90.0% (Average OKR: 92.0%)
- **Projects:** Real-time Telemetry Ingestion Hub delivered on time (Quality score: 4.4/5).
- **Feedback:** 2 reviews, ratings 4.3 (peer), 4.2 (stakeholder).
- **Skills Check:**
  - Python: 4/5 (Meets requirement: 4)
  - SQL: 4/5 (Meets requirement: 4)
  - Data Analysis: 4/5 (Meets requirement: 4)
  - **Distributed Systems: 2/5 (Target Senior Data Engineer requires 3+, Mandatory) → GAP DETECTED**
  - **Kubernetes: 1/5 (Target Senior Data Engineer requires 3+, Mandatory) → GAP DETECTED**
- **Attendance:** 98.4% attendance.
- **Business Impact:** 15 analyst hours/week saved via automated ETL marts.
- **Manager Evaluation:** 4.1/5 from Sarah Jenkins ("To advance to Senior Data Engineer, he must build hands-on mastery in distributed systems and Kubernetes.")
- **Result:** **PASS**

### Demo C: Priya Sharma (`EMP003`) — Evaluation Inconsistency Scenario
- **Current Role:** UX Lead (`ROLE_UX_LEAD`) → **Target Role:** Director of Product Design (`ROLE_DIR_DESIGN`)
- **Goals:** 2 goals, progress 92.0%, 94.0% (Average OKR: 93.0%)
- **Projects:** Enterprise Portal Design System Overhaul delivered on time; reduced UX revision loops by 60%.
- **Feedback:** 3 reviews, ratings 4.9, 4.8, 4.8 (Average peer/stakeholder rating: 4.83/5, 100% Positive).
- **Skills:** UX Design (5/5), Leadership (4/5), Communication (5/5), Project Management (4/5).
- **Attendance:** 99.0% attendance.
- **Business Impact:** Reduced onboarding drop-off from 34% to 8%; +28% trial-to-paid conversion lift.
- **Manager Evaluation:** **2.8/5** from Robert Sterling citing minor timeline friction in one retro sprint.
- **Discrepancy Analysis:** Objective composite rating is ~4.8/5 vs Manager rating 2.8/5.
- **Flag Triggered:** Neutral flag ready for Phase 3 calibration engine: `"Potential evaluation inconsistency detected."`
- **Result:** **PASS**

---

## 3. Conclusion
The dataset conforms 100% to all relational, structural, and domain constraints required for ZEROBUGS HRM-05.
