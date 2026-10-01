# ZEROBUGS HRM-05: Explainable Analysis Methodology & Intelligence Engine

## Executive Summary

The **ZEROBUGS AI-Based Performance & Promotion Intelligence Platform** (HRM-05) replaces opaque, subjective, or black-box evaluation systems with a **deterministic, transparent, and multi-dimensional analytics engine**.

All decisions, recommendations, and intelligence summaries are grounded directly in verifiable evidence from the underlying database across 9 dimensions. The engine operates completely offline without requiring third-party AI keys, guaranteeing deterministic reproducibility, data privacy, and objective fairness.

---

## 1. Multi-Dimensional Performance Formula

An employee's overall performance cannot be reduced to a single metric or subjective impression. ZEROBUGS aggregates five normalized components on a common `[0, 100]` scale:

$$\text{Performance Score} = \sum_{i} (\text{Component}_i \times \text{Weight}_i)$$

$$\begin{aligned}
\text{Performance Score} = & \; (\text{Goal Score} \times 0.30) \\
& + (\text{Project Score} \times 0.25) \\
& + (\text{Feedback Score} \times 0.20) \\
& + (\text{Reliability Score} \times 0.10) \\
& + (\text{Business Impact Score} \times 0.15)
\end{aligned}$$

### Component Calculations:

#### A. Goal Achievement Score (Weight: 30%)
Calculated from actual OKRs and measurable target records in the `goals` table:
$$\text{Average Progress} = \frac{1}{N} \sum_{k=1}^{N} \text{progress\_pct}_k$$
- Bound: $\min(100.0, \max(0.0, \text{Average Progress}))$
- Completed goals count instances where $\text{progress\_pct} \ge 100.0\%$.
- Verification artifacts (Jira boards, production deployments, system uptime metrics) are retained in the evidence trail.

#### B. Project Execution Score (Weight: 25%)
Evaluates delivery rigor and technical execution from the `projects` table:
$$\text{On-Time Delivery Rate} = \left(\frac{\text{Delivered On-Time Projects}}{\text{Total Projects}}\right) \times 100$$
- **Technical Roles:** When `code_quality_score` (1.0–5.0) is present:
  $$\text{Normalized Quality} = \left(\frac{\text{Average Code Quality}}{5.0}\right) \times 100$$
  $$\text{Project Score} = (\text{On-Time Rate} \times 0.40) + (\text{Normalized Quality} \times 0.60)$$
- **Non-Technical / Design / Leadership Roles:** Where `code_quality_score` is not applicable (`null`), the candidate is **not penalized**:
  $$\text{Project Score} = \text{On-Time Rate}$$

#### C. 360-Degree Feedback Score (Weight: 20%)
Aggregates multi-perspective reviews (Peer, Manager, Stakeholder) from the `feedback` table:
$$\text{Feedback Score} = \left(\frac{\text{Average Rating}}{5.0}\right) \times 100$$
- Discrete tracking of peer rating, manager rating, and cross-functional stakeholder rating.
- Qualitative comments and sentiment distributions (positive, neutral, constructive) provide context but do not artificially override the normalized score.

#### D. Operational Reliability Score (Weight: 10%)
Derived from recorded working days, days present, and attendance percentage in the `attendance` table:
$$\text{Reliability Score} = \min(100.0, \max(0.0, \text{Average Attendance Pct}))$$
- Treated as a supporting operational factor, avoiding inappropriate over-weighting of presence over impact.

#### E. Business Impact Score (Weight: 15%)
Evaluates tangible commercial and operational contributions from the `business_impact` table:
- Preserves raw metrics without false unit aggregation (avoiding summing USD, latency milliseconds, and retention percentages).
- Evaluates the presence of verified high-scale milestones:
  - $\ge 2$ verified impact records: $98.0$
  - $1$ verified impact record: $88.0$
  - Baseline (no recorded commercial items): $75.0$ (with transparent documentation, avoiding unfair penalty for non-commercial roles).

---

## 2. Component Weight Model

| Component | Weight | Justification |
| :--- | :---: | :--- |
| **Goal Achievement** | **30%** | Primary objective commitment; reflects alignment with organizational OKRs. |
| **Project Delivery** | **25%** | Tangible production deliverables, on-time delivery, and code/design craftsmanship. |
| **360 Feedback** | **20%** | Cross-functional collaboration, peer respect, stakeholder trust, and leadership. |
| **Business Impact** | **15%** | Quantified financial savings, latency reductions, conversion improvements, or efficiency. |
| **Operational Reliability** | **10%** | Baseline attendance consistency and sprint operational reliability. |
| **Total** | **100%** | **Documented, deterministic, and auditable.** |

---

## 3. Skill-Gap Calculation & Prioritization

The skill gap engine matches an employee's evaluated proficiencies (`employee_skills`) against the target role's expectations (`role_required_skills`):

$$\text{Gap} = \text{Required Level} - \text{Current Level}$$

### Classification Logic:
- If $\text{Gap} \le 0$: `status = "meets_requirement"`, Priority = `met`.
- If $\text{Gap} > 0$ and $\text{is\_mandatory} = \text{True}$: `status = "development_gap"`, Priority = `critical`.
- If $\text{Gap} > 0$ and $\text{is\_mandatory} = \text{False}$: `status = "development_gap"`, Priority = `moderate`.

### Prioritization Hierarchy:
1. **Mandatory Requirement:** Mandatory competencies take precedence over optional electives.
2. **Deficit Size:** Larger gaps (e.g., Gap = 2 vs. Gap = 1) rank higher for urgent intervention.
3. **Target Role Criticality:** Ordered to guarantee focused development before promotion review.

---

## 4. Career Pathway Recommendation Logic

The career service functions as an **advisory recommendation engine**, not an authoritative decision-maker:
1. **Readiness Context:** Summarizes current role standing, target role expectations, and remaining hurdles.
2. **Milestone Generation (4 Structured Phases):**
   - *Phase 1:* Technical / Competency Closure (directly targeting critical gaps).
   - *Phase 2:* Structured Training & Formal Certification (referencing internal training programs such as in-progress courses).
   - *Phase 3:* Target-Role Production Ownership (demonstrating execution scope in cross-functional epics).
   - *Phase 4:* Mentorship & Architectural Governance (fostering team development).
3. **Actionable Roadmap:** Prescribes concrete actions with realistic timelines (0–3 Months, 3–6 Months, 6–12 Months).

---

## 5. Promotion Readiness Logic

Promotion readiness evaluates four transparent pillars rather than a single cutoff score:

```
┌────────────────────────────────────────────────────────┐
│               PROMOTION READINESS PILLARS               │
├─────────────────┬─────────────────┬────────────────────┤
│ 1. Performance  │ 2. Competence   │ 3. Consistency     │ 4. Impact
│ Composite >= 85 │ 0 Critical Gaps │ On-time >= 85%     │ >= 1 Verified Record
└─────────────────┴─────────────────┴────────────────────┴────────────────────┘
```

### Readiness Tiers:
- **`Ready Now`**:
  - Composite Performance Score $\ge 85.0$
  - Mandatory Target-Role Skills: **0 Critical Gaps** (100% mandatory compliance)
  - Execution Consistency: On-time delivery $\ge 85\%$ and Reliability $\ge 90\%$
  - Verified Business Impact: At least 1 documented, verified commercial contribution
- **`Developing - Ready in 6-12 Months`**:
  - Composite Performance Score $\ge 70.0$
  - Critical Skills: $\le 2$ Critical Gaps remaining (manageable development scope)
  - Solid operational foundation requiring targeted competency closure.
- **`Needs Foundation`**:
  - Composite Performance Score $< 70.0$, OR
  - More than 2 Critical Gaps remaining, OR
  - Low execution consistency across project delivery or reliability.

---

## 6. Manager Calibration Variance Calculation

Evaluation calibration detects discrepancies between managerial subjective ratings and multi-factor objective evidence.

$$\text{Manager Normalized Score} = \text{Manager Rating (1–5)} \times 20.0$$

$$\text{Variance} = \text{Manager Normalized Score} - \text{Evidence Composite Score}$$

### Neutral Discrepancy Flagging:
- Threshold: $|\text{Variance}| \ge 20.0\text{ percentage points}$
- If discrepancy crosses threshold:
  - `flag = True`
  - `message = "Potential evaluation inconsistency detected."`
  - `review_recommended = True`
- If within threshold:
  - `flag = False`
  - `message = "Manager evaluation is aligned with objective evidence."`
  - `review_recommended = False`

### Strict Non-Accusatory Tone:
The system **never** uses accusatory phrases like *"manager bias"*, *"unfair evaluation"*, or makes assumptions about intent. It neutrally highlights variance to prompt objective review by HR talent committees.

---

## 7. Configurable Thresholds Reference

| Parameter | Default Value | Configurable Location | Purpose |
| :--- | :---: | :--- | :--- |
| `WEIGHT_GOALS` | `0.30` | `performance_service.py` | Weight assigned to OKR progress |
| `WEIGHT_PROJECTS` | `0.25` | `performance_service.py` | Weight assigned to project deliverables |
| `WEIGHT_FEEDBACK` | `0.20` | `performance_service.py` | Weight assigned to 360 review ratings |
| `WEIGHT_RELIABILITY` | `0.10` | `performance_service.py` | Weight assigned to attendance logs |
| `WEIGHT_BUSINESS_IMPACT` | `0.15` | `performance_service.py` | Weight assigned to business impact |
| `READY_NOW_PERFORMANCE_MIN` | `85.0` | `promotion_service.py` | Minimum composite score for immediate promotion readiness |
| `READY_NOW_MAX_CRITICAL_GAPS`| `0` | `promotion_service.py` | Maximum critical skill gaps permitted for "Ready Now" |
| `DEVELOPING_PERFORMANCE_MIN`| `70.0` | `promotion_service.py` | Minimum score for 6-12 month readiness pool |
| `DEVELOPING_MAX_CRITICAL_GAPS`| `2` | `promotion_service.py` | Maximum critical gaps permitted for developing pool |
| `VARIANCE_THRESHOLD` | `20.0` | `calibration_service.py` | Variance percentage points triggering neutral calibration review |

---

## 8. Offline Reasoning & Template Fallback

The intelligence engine operates **offline by default** (`AI_PROVIDER=offline`).
- Generates structured narrative explanations across 8 standardized sections:
  1. Performance Summary
  2. Key Strengths
  3. Objective Evidence
  4. Skill Assessment & Gaps
  5. Career Progression Roadmap
  6. Promotion Readiness Determination
  7. Manager Evaluation Calibration
  8. Recommended Next Steps
- **Zero Hallucination Guarantee:** Every figure, percentage, skill name, and timeline statement is derived directly from database evidence.
- **Pluggable Architecture:** If external LLM providers are introduced in future iterations, the deterministic offline engine serves as an immutable fallback.

---

## 9. Human-in-the-Loop Decision Support

ZEROBUGS strictly operates as an **HR decision-support and intelligence platform**, not an automated decision-maker:

- **Evidence-Based Analysis:** The system systematically analyzes available employee evidence across 9 structured dimensions.
- **Explainable Assessments:** The system generates transparent, reproducible, and auditable performance and competency assessments.
- **Advisory Career Recommendations:** Career pathways and progression milestones are advisory guidance tools designed to inform developmental conversations, not rigid mandates.
- **Analytical Readiness Indicator:** Promotion readiness categories (*Ready Now*, *Developing - Ready in 6-12 Months*, *Needs Foundation*) serve as analytical indicators based on current evidence benchmarks, not formal employment determinations.
- **Human Calibration Review:** Evaluation calibration flags identify cases exhibiting measurable discrepancies between managerial ratings and multi-factor evidence to prompt constructive human dialogue.
- **No Automated Employment Decisions:** The system does not make final promotion, retention, or compensation decisions.
- **Human Accountability:** **Final promotion decisions remain strictly with HR and managers.** Every promotion response and intelligence summary explicitly includes `human_review_required = True` and the formal HR governance disclaimer.

---

## 10. System Limitations & Boundaries

1. **Synthetic Data Context:** All evaluation models are validated on the Finathon HRM-05 synthetic dataset representing 30 multi-department employees.
2. **Quality Score Applicability:** For roles where automated code quality metrics do not exist (e.g. Design, Product Management), project evaluation defaults to on-time delivery and scope completion without penalty.
3. **Single Review Cycle Baseline:** Historical progression analysis assumes the current evaluation cycle records; longitudinal multi-year trend analysis will be expanded in future versions.
4. **Advisory Nature:** Career roadmaps and milestone suggestions represent guidance pathways and do not form contractual promotion guarantees.
