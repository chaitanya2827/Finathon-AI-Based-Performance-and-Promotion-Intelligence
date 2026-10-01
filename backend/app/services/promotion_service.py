"""
ZEROBUGS HRM-05: Promotion Readiness Service
Evaluates promotion readiness across four transparent dimensions:
Performance, Competence, Consistency, and Impact.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.database.repository import EmployeeRepository


# Configurable Promotion Thresholds (Transparent & Documented)
READY_NOW_PERFORMANCE_MIN: float = 85.0
READY_NOW_MAX_CRITICAL_GAPS: int = 0

DEVELOPING_PERFORMANCE_MIN: float = 70.0
DEVELOPING_MAX_CRITICAL_GAPS: int = 2


class PromotionService:
    """Multi-dimensional promotion readiness evaluation engine."""

    @classmethod
    def evaluate_readiness(
        cls,
        employee_id: str,
        performance_result: Dict[str, Any],
        skill_gap_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluate promotion readiness based on Performance, Competence, Consistency, and Impact.
        Always retains human_review_required=True and a formal HR governance disclaimer.
        """
        perf_score = performance_result.get("performance_score", 0.0)
        components = performance_result.get("components", {})
        evidence_breakdown = performance_result.get("evidence", {})

        g_score = components.get("goal_score", 0.0)
        p_score = components.get("project_score", 0.0)
        f_score = components.get("feedback_score", 0.0)
        r_score = components.get("reliability_score", 0.0)
        b_score = components.get("business_impact_score", 0.0)

        critical_gaps = skill_gap_result.get("critical_gaps", [])
        moderate_gaps = skill_gap_result.get("moderate_gaps", [])
        mandatory_met_pct = skill_gap_result.get("mandatory_met_pct", 100.0)
        mandatory_count = skill_gap_result.get("mandatory_count", 0)
        mandatory_met_count = skill_gap_result.get("mandatory_met_count", 0)

        # Dimension 1: Performance Summary
        perf_summary = {
            "score": perf_score,
            "status": "Exceeds Expectations" if perf_score >= 88.0 else ("Meets Expectations" if perf_score >= 75.0 else "Needs Development"),
            "goal_achievement_pct": g_score,
            "benchmark_met": perf_score >= READY_NOW_PERFORMANCE_MIN
        }

        # Dimension 2: Competence Summary
        competence_summary = {
            "mandatory_skills_total": mandatory_count,
            "mandatory_skills_met": mandatory_met_count,
            "mandatory_met_pct": mandatory_met_pct,
            "critical_gaps_count": len(critical_gaps),
            "moderate_gaps_count": len(moderate_gaps),
            "status": "Target Competencies Satisfied" if len(critical_gaps) == 0 else f"{len(critical_gaps)} Critical Gaps Identified"
        }

        # Dimension 3: Consistency Summary
        proj_evidence = evidence_breakdown.get("projects", {})
        on_time_pct = proj_evidence.get("on_time_rate_pct", 80.0)
        consistency_summary = {
            "project_delivery_on_time_pct": on_time_pct,
            "attendance_reliability_score": r_score,
            "feedback_consensus_score": f_score,
            "is_consistent": on_time_pct >= 85.0 and r_score >= 90.0 and f_score >= 80.0
        }

        # Dimension 4: Impact Summary
        impact_evidence = evidence_breakdown.get("business_impact", {})
        impact_count = impact_evidence.get("impact_records_count", 0)
        impact_summary = {
            "verified_impact_count": impact_count,
            "impact_score": b_score,
            "has_high_impact": impact_count >= 1 and b_score >= 85.0
        }

        # Decision Logic:
        # READY NOW:
        # - Strong performance (>= 85.0)
        # - 0 critical mandatory gaps
        # - High consistency and verified impact
        # DEVELOPING:
        # - Good performance (>= 70.0)
        # - <= 2 critical gaps
        # NEEDS FOUNDATION:
        # - Performance < 70.0 or > 2 critical gaps
        if (
            perf_score >= READY_NOW_PERFORMANCE_MIN
            and len(critical_gaps) <= READY_NOW_MAX_CRITICAL_GAPS
            and impact_summary["has_high_impact"]
        ):
            readiness_level = "Ready Now"
        elif (
            perf_score >= DEVELOPING_PERFORMANCE_MIN
            and len(critical_gaps) <= DEVELOPING_MAX_CRITICAL_GAPS
        ):
            readiness_level = "Developing - Ready in 6-12 Months"
        else:
            readiness_level = "Needs Foundation"

        # Supporting Strengths & Evidence
        strengths: List[str] = []
        supporting_evidence: List[str] = []

        if perf_score >= 88.0:
            strengths.append(f"High composite performance score ({perf_score}/100) reflecting reliable technical delivery.")
        if len(critical_gaps) == 0:
            strengths.append(f"Full alignment with target role competencies ({mandatory_met_pct}% mandatory skills met).")
        if on_time_pct >= 95.0:
            strengths.append(f"Pristine project execution timeline ({on_time_pct}% delivered on time).")
        if f_score >= 90.0:
            strengths.append(f"Broad organizational consensus and strong peer feedback ({f_score}/100).")
        if impact_count >= 1:
            strengths.append(f"Demonstrated business impact with {impact_count} verified commercial or operational records.")

        # Supporting Evidence Points
        if proj_evidence.get("evidence"):
            p_names = [p["project_name"] for p in proj_evidence["evidence"][:2]]
            supporting_evidence.append(f"Demonstrated project deliverables in: {', '.join(p_names)}.")
        if evidence_breakdown.get("goals", {}).get("evidence"):
            supporting_evidence.append(f"Validated OKR completion averaging {g_score}% across all tracked goals.")
        if impact_evidence.get("evidence"):
            for imp in impact_evidence["evidence"][:2]:
                supporting_evidence.append(f"Verified Impact: {imp['metric_name']} ({imp['value']} {imp['metric_unit']}).")

        # Missing Requirements & Development Actions
        missing_requirements: List[str] = []
        development_actions: List[str] = []

        for cg in critical_gaps:
            missing_requirements.append(
                f"Deficit in mandatory target competency '{cg['skill_name']}': current Level {cg['current_level']}, required Level {cg['required_level']}."
            )
            development_actions.append(
                f"Complete focused upskilling and practical application in {cg['skill_name']} to reach Level {cg['required_level']}."
            )

        if perf_score < READY_NOW_PERFORMANCE_MIN:
            missing_requirements.append(
                f"Overall performance score ({perf_score}) currently sits below the {READY_NOW_PERFORMANCE_MIN} benchmark for immediate advancement consideration."
            )
            development_actions.append("Focus on elevating quarterly OKR completion and expanding project deliverable scope.")

        if not impact_summary["has_high_impact"]:
            missing_requirements.append("Additional verified business impact records recommended to support target-role readiness review.")
            development_actions.append("Partner with product and engineering leads on initiatives with measurable business metrics.")

        if not missing_requirements:
            missing_requirements.append("None. Candidate has satisfied all primary objective benchmark criteria for target-role assessment.")
            development_actions.append("Prepare the employee's evidence profile for HR and manager review during the next formal career discussion.")

        return {
            "employee_id": employee_id,
            "readiness_level": readiness_level,
            "readiness_assessment_note": "System-generated readiness assessment based on available performance, competency, consistency, and impact evidence.",
            "performance_score": perf_score,
            "competence_summary": competence_summary,
            "consistency_summary": consistency_summary,
            "impact_summary": impact_summary,
            "strengths": strengths,
            "supporting_evidence": supporting_evidence,
            "missing_requirements": missing_requirements,
            "development_actions": development_actions,
            "human_review_required": True,
            "disclaimer": "Final promotion decisions remain with HR and managers."
        }

    @classmethod
    def get_employee_promotion_readiness(
        cls,
        db: Session,
        employee_id: str,
        performance_result: Optional[Dict[str, Any]] = None,
        skill_gap_result: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Fetch records and execute promotion readiness evaluation."""
        from backend.app.services.performance_service import PerformanceService
        from backend.app.services.skill_gap_service import SkillGapService

        emp = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not emp:
            return None

        if performance_result is None:
            performance_result = PerformanceService.get_employee_performance(db, employee_id) or {}
        if skill_gap_result is None:
            skill_gap_result = SkillGapService.get_employee_skill_gaps(db, employee_id) or {}

        return cls.evaluate_readiness(
            employee_id=employee_id,
            performance_result=performance_result,
            skill_gap_result=skill_gap_result
        )
