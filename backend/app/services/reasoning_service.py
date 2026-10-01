"""
ZEROBUGS HRM-05: AI Reasoning & Explanation Engine
Transforms structured performance, skill, career, promotion, and calibration metrics
into deterministic, evidence-grounded, human-readable explanations.
Works completely offline without external API keys.
"""

from typing import Dict, Any, List, Optional
from backend.app.config import settings


class ReasoningService:
    """Explainable intelligence generator with offline rule-based & template fallback."""

    @classmethod
    def generate_offline_reasoning(
        cls,
        employee_info: Dict[str, Any],
        performance_result: Dict[str, Any],
        skill_gap_result: Dict[str, Any],
        career_result: Dict[str, Any],
        promotion_result: Dict[str, Any],
        calibration_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Synthesize all structured evidence into structured explanation sections
        and a full markdown narrative. Every sentence is backed by database metrics.
        """
        name = employee_info.get("name", "Employee")
        emp_id = employee_info.get("employee_id", "")
        curr_role = employee_info.get("current_role") or "Current Role"
        targ_role = employee_info.get("target_role") or "Target Role"

        perf_score = performance_result.get("performance_score", 0.0)
        comps = performance_result.get("components", {})
        ev_breakdown = performance_result.get("evidence", {})

        g_score = comps.get("goal_score", 0.0)
        p_score = comps.get("project_score", 0.0)
        f_score = comps.get("feedback_score", 0.0)
        r_score = comps.get("reliability_score", 0.0)
        b_score = comps.get("business_impact_score", 0.0)

        readiness = promotion_result.get("readiness_level", "Needs Foundation")
        critical_gaps = skill_gap_result.get("critical_gaps", [])
        moderate_gaps = skill_gap_result.get("moderate_gaps", [])
        met_skills = skill_gap_result.get("skills_meeting_requirements", [])

        cal_flag = calibration_result.get("flag", False)
        cal_variance = calibration_result.get("variance")
        m_rating = calibration_result.get("manager_rating")

        # 1. Performance Summary
        perf_summary = (
            f"{name} ({emp_id}) achieved a composite performance score of {perf_score}/100. "
            f"The score reflects weighted contributions across Goal Completion ({g_score}/100, 30% weight), "
            f"Project Delivery ({p_score}/100, 25% weight), 360-Degree Feedback ({f_score}/100, 20% weight), "
            f"Operational Reliability ({r_score}/100, 10% weight), and Business Impact ({b_score}/100, 15% weight)."
        )

        # 2. Strengths
        strengths_list = promotion_result.get("strengths", [])
        if not strengths_list:
            strengths_list = [f"Consistent operational performance with composite score {perf_score}/100."]

        # 3. Evidence
        evidence_points: List[str] = []
        # Goals evidence
        goal_data = ev_breakdown.get("goals", {})
        if goal_data.get("evidence"):
            g_count = goal_data.get("total_goals", 0)
            avg_g = goal_data.get("average_progress", 0.0)
            evidence_points.append(f"Goals: {g_count} active OKRs tracked with an average progress of {avg_g}%.")

        # Projects evidence
        proj_data = ev_breakdown.get("projects", {})
        if proj_data.get("evidence"):
            p_count = proj_data.get("total_projects", 0)
            ot_rate = proj_data.get("on_time_rate_pct", 0.0)
            cq = proj_data.get("average_code_quality")
            if cq is not None:
                evidence_points.append(f"Projects: {p_count} deliverables completed with {ot_rate}% on-time delivery rate and {cq}/5.0 code quality score.")
            else:
                evidence_points.append(f"Projects: {p_count} deliverables completed with {ot_rate}% on-time delivery rate.")

        # Feedback evidence
        fb_data = ev_breakdown.get("feedback", {})
        if fb_data.get("evidence"):
            avg_fb = fb_data.get("average_rating", 0.0)
            peer_fb = fb_data.get("peer_rating")
            s_dist = fb_data.get("sentiment_distribution", {})
            fb_text = f"Feedback: {avg_fb}/5.0 average rating across stakeholder reviews"
            if peer_fb is not None:
                fb_text += f" (peer rating: {peer_fb}/5.0)"
            fb_text += f", with {s_dist.get('positive', 0)} positive sentiments logged."
            evidence_points.append(fb_text)

        # Reliability evidence
        rel_data = ev_breakdown.get("reliability", {})
        if rel_data.get("evidence"):
            att_pct = rel_data.get("attendance_pct", 0.0)
            evidence_points.append(f"Reliability: Maintained {att_pct}% attendance across tracked periods.")

        # Business impact evidence
        imp_data = ev_breakdown.get("business_impact", {})
        if imp_data.get("evidence"):
            for imp in imp_data["evidence"][:2]:
                evidence_points.append(f"Business Impact: Logged {imp['metric_name']} of {imp['value']} {imp['metric_unit']}.")

        # 4. Skill Gaps
        if critical_gaps:
            c_gap_desc = "; ".join(
                f"{g['skill_name']} (Current Level: {g['current_level']}, Required Level: {g['required_level']}, Gap: {g['gap']})"
                for g in critical_gaps
            )
            skill_gap_summary = (
                f"Candidate exhibits {len(critical_gaps)} critical mandatory gap(s) for the target role '{targ_role}': {c_gap_desc}."
            )
        elif moderate_gaps:
            m_gap_desc = ", ".join(g["skill_name"] for g in moderate_gaps)
            skill_gap_summary = (
                f"All mandatory target competencies are satisfied. {len(moderate_gaps)} moderate elective area(s) noted for upskilling: {m_gap_desc}."
            )
        else:
            skill_gap_summary = (
                f"All {len(met_skills)} target-role competencies for '{targ_role}' are met or exceeded with zero critical deficits."
            )

        # 5. Career Development
        milestones = career_result.get("milestones", [])
        milestone_summaries = [f"Step {m['step']}: {m['title']} ({m['status'].replace('_', ' ').title()})" for m in milestones]

        # 6. Promotion Readiness Context
        if readiness == "Ready Now":
            readiness_context = (
                f"System-generated readiness assessment: 'Ready Now'. Based on available evidence across four core dimensions, "
                f"{name} demonstrates sustained high performance ({perf_score}/100), satisfies 100% of target mandatory competencies, "
                f"maintains consistent project execution, and has documented business impact. "
                f"This analytical assessment indicates readiness for consideration by HR and managers in the next career review."
            )
        elif readiness == "Developing - Ready in 6-12 Months":
            readiness_context = (
                f"System-generated readiness assessment: 'Developing - Ready in 6-12 Months'. Evidence indicates that {name} shows "
                f"strong foundational performance ({perf_score}/100), with {len(critical_gaps)} mandatory competency area(s) "
                f"recommended for targeted development before formal advancement to '{targ_role}'."
            )
        else:
            readiness_context = (
                f"System-generated readiness assessment: 'Needs Foundation'. Available performance and competency evidence indicates that "
                f"further foundational development is recommended prior to formal consideration for '{targ_role}'."
            )

        # 7. Calibration Notes
        if cal_flag:
            cal_notes = (
                f"Potential evaluation inconsistency detected: Manager evaluation rating is {m_rating}/5.0 "
                f"(normalized: {calibration_result.get('manager_normalized_score')}/100) compared to an objective evidence composite score of "
                f"{perf_score}/100, representing a variance of {cal_variance} percentage points (threshold: ±20.0). "
                f"Human calibration review is recommended to reconcile the available evidence."
            )
        else:
            cal_notes = (
                f"Evaluation consistency confirmed: Manager rating ({m_rating}/5.0) aligns with objective multi-factor evidence "
                f"(composite score: {perf_score}/100, variance: {cal_variance} points within standard tolerance)."
            )

        # 8. Recommended Next Steps
        next_steps: List[str] = []
        if readiness == "Ready Now":
            next_steps.append("Prepare the employee's evidence profile for HR and manager review.")
            next_steps.append("Compile relevant performance and development evidence for the next career discussion.")
            next_steps.append("Consider discussing progression readiness with the manager and HR talent partner.")
        elif readiness == "Developing - Ready in 6-12 Months":
            for cg in critical_gaps:
                next_steps.append(f"Focus on upskilling and practical application in {cg['skill_name']} to bridge the identified development gap.")
            next_steps.append("Schedule a career development check-in between employee and reporting manager to review progression milestones.")
        else:
            next_steps.append("Establish a structured development plan focusing on core goal delivery and project execution.")

        if cal_flag:
            next_steps.append("HR Talent Partner to facilitate an objective calibration discussion to review the available evidence.")

        # Compose Complete Narrative Text
        narrative_parts = [
            f"# Performance & Promotion Intelligence Report: {name} ({emp_id})",
            f"**Current Role:** {curr_role} | **Target Role:** {targ_role}",
            "",
            "## 1. Performance Summary",
            perf_summary,
            "",
            "## 2. Key Strengths",
            "\n".join(f"- {s}" for s in strengths_list),
            "",
            "## 3. Objective Evidence",
            "\n".join(f"- {e}" for e in evidence_points),
            "",
            "## 4. Skill Assessment & Gap Analysis",
            skill_gap_summary,
            "",
            "## 5. Career Progression Roadmap",
            "\n".join(f"- {m}" for m in milestone_summaries),
            "",
            "## 6. Promotion Readiness Determination",
            readiness_context,
            "",
            "## 7. Manager Evaluation Calibration",
            cal_notes,
            "",
            "## 8. Recommended Next Steps",
            "\n".join(f"1. {step}" for step in next_steps),
            "",
            "> *Final promotion decisions remain with HR and managers.*"
        ]

        full_narrative = "\n".join(narrative_parts)

        return {
            "performance_summary": perf_summary,
            "strengths": strengths_list,
            "evidence": evidence_points,
            "skill_gaps": skill_gap_summary,
            "career_development": milestone_summaries,
            "promotion_readiness_context": readiness_context,
            "calibration_notes": cal_notes,
            "recommended_next_steps": next_steps,
            "full_narrative": full_narrative,
            "provider": "offline"
        }

    @classmethod
    def generate_reasoning(
        cls,
        employee_info: Dict[str, Any],
        performance_result: Dict[str, Any],
        skill_gap_result: Dict[str, Any],
        career_result: Dict[str, Any],
        promotion_result: Dict[str, Any],
        calibration_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Orchestrates reasoning generation.
        Checks settings.AI_PROVIDER and falls back seamlessly to deterministic offline templates.
        """
        provider = getattr(settings, "AI_PROVIDER", "offline").lower()

        # Offline rule-based template generation is default and always available
        offline_result = cls.generate_offline_reasoning(
            employee_info=employee_info,
            performance_result=performance_result,
            skill_gap_result=skill_gap_result,
            career_result=career_result,
            promotion_result=promotion_result,
            calibration_result=calibration_result
        )

        if provider == "offline":
            return offline_result

        # Optional LLM integration hook (extensible for future external LLM configuration)
        # Guarantees zero failures if API key is absent or unreachable
        return offline_result
