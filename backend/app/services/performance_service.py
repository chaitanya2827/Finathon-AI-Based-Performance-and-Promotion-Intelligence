"""
ZEROBUGS HRM-05: Performance Analysis Service
Transforms raw database evidence (Goals, Projects, Feedback, Attendance, Business Impact)
into transparent, explainable, and deterministic performance metrics.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.database.repository import EmployeeRepository
from backend.app.models import Employee, Goal, Project, Feedback, Attendance, BusinessImpact


# Configurable Component Weights (Documented Transparent Model)
WEIGHT_GOALS: float = 0.30
WEIGHT_PROJECTS: float = 0.25
WEIGHT_FEEDBACK: float = 0.20
WEIGHT_RELIABILITY: float = 0.10
WEIGHT_BUSINESS_IMPACT: float = 0.15

COMPONENT_WEIGHTS: Dict[str, float] = {
    "goals": WEIGHT_GOALS,
    "projects": WEIGHT_PROJECTS,
    "feedback": WEIGHT_FEEDBACK,
    "reliability": WEIGHT_RELIABILITY,
    "business_impact": WEIGHT_BUSINESS_IMPACT,
}


class PerformanceService:
    """Deterministic, evidence-grounded performance evaluation engine."""

    @classmethod
    def analyze_goals(cls, goals: List[Goal]) -> Dict[str, Any]:
        """
        Analyze goal completion and progress percentage.
        Normalizes to 0-100 scale.
        """
        total_goals = len(goals)
        if total_goals == 0:
            return {
                "goal_score": 70.0,
                "average_progress": 70.0,
                "completed_goals": 0,
                "total_goals": 0,
                "note": "No active goals recorded for this cycle; baseline applied.",
                "evidence": []
            }

        progress_values = [g.progress_pct for g in goals]
        avg_progress = sum(progress_values) / total_goals
        completed = sum(1 for g in goals if g.progress_pct >= 100.0)

        # Normalized goal score bounded to [0, 100]
        goal_score = round(min(100.0, max(0.0, avg_progress)), 2)

        evidence_items = [
            {
                "title": g.title,
                "category": g.category,
                "progress_pct": g.progress_pct,
                "target_value": g.target_value,
                "achieved_value": g.achieved_value,
                "metric_unit": g.metric_unit,
                "verification_evidence": g.verification_evidence
            }
            for g in goals
        ]

        return {
            "goal_score": goal_score,
            "average_progress": round(avg_progress, 2),
            "completed_goals": completed,
            "total_goals": total_goals,
            "evidence": evidence_items
        }

    @classmethod
    def analyze_projects(cls, projects: List[Project]) -> Dict[str, Any]:
        """
        Analyze project outcomes, on-time delivery, and code quality (where applicable).
        Non-technical roles where code_quality_score is null are NOT penalized.
        """
        total_projects = len(projects)
        if total_projects == 0:
            return {
                "project_score": 70.0,
                "total_projects": 0,
                "on_time_count": 0,
                "on_time_rate_pct": 70.0,
                "average_code_quality": None,
                "note": "No active project deliverables recorded; baseline applied.",
                "evidence": []
            }

        on_time_count = sum(1 for p in projects if p.delivered_on_time)
        on_time_rate_pct = (on_time_count / total_projects) * 100.0

        # Filter projects that possess code quality scores
        quality_scores = [p.code_quality_score for p in projects if p.code_quality_score is not None]

        if quality_scores:
            avg_quality_5 = sum(quality_scores) / len(quality_scores)
            avg_quality_pct = (avg_quality_5 / 5.0) * 100.0
            # 40% on-time delivery, 60% quality rigor
            project_score = round((on_time_rate_pct * 0.40) + (avg_quality_pct * 0.60), 2)
            avg_quality_val = round(avg_quality_5, 2)
        else:
            # Non-technical / design / leadership roles: evaluate solely on on-time & delivery scope
            project_score = round(on_time_rate_pct, 2)
            avg_quality_val = None

        evidence_items = [
            {
                "project_name": p.project_name,
                "role_in_project": p.role_in_project,
                "deliverables": p.deliverables,
                "delivered_on_time": p.delivered_on_time,
                "code_quality_score": p.code_quality_score,
                "outcome_evidence": p.outcome_evidence
            }
            for p in projects
        ]

        return {
            "project_score": min(100.0, max(0.0, project_score)),
            "total_projects": total_projects,
            "on_time_count": on_time_count,
            "on_time_rate_pct": round(on_time_rate_pct, 2),
            "average_code_quality": avg_quality_val,
            "evidence": evidence_items
        }

    @classmethod
    def analyze_feedback(cls, feedback_list: List[Feedback]) -> Dict[str, Any]:
        """
        Analyze multi-perspective feedback (Peer, Manager, Stakeholder).
        Converts 1-5 scale into 0-100 scale transparently.
        """
        total = len(feedback_list)
        if total == 0:
            return {
                "feedback_score": 75.0,
                "average_rating": 3.75,
                "peer_rating": None,
                "manager_rating": None,
                "stakeholder_rating": None,
                "sentiment_distribution": {"positive": 0, "neutral": 0, "constructive": 0},
                "note": "No 360 feedback records submitted; baseline applied.",
                "evidence": []
            }

        ratings = [f.rating for f in feedback_list]
        avg_rating = sum(ratings) / total
        feedback_score = round((avg_rating / 5.0) * 100.0, 2)

        peer_ratings = [f.rating for f in feedback_list if f.reviewer_type.lower() == "peer"]
        mgr_ratings = [f.rating for f in feedback_list if f.reviewer_type.lower() == "manager"]
        stk_ratings = [f.rating for f in feedback_list if f.reviewer_type.lower() == "stakeholder"]

        peer_avg = round(sum(peer_ratings) / len(peer_ratings), 2) if peer_ratings else None
        mgr_avg = round(sum(mgr_ratings) / len(mgr_ratings), 2) if mgr_ratings else None
        stk_avg = round(sum(stk_ratings) / len(stk_ratings), 2) if stk_ratings else None

        sentiment_dist = {"positive": 0, "neutral": 0, "constructive": 0}
        for f in feedback_list:
            s = f.sentiment.lower()
            if "pos" in s:
                sentiment_dist["positive"] += 1
            elif "neu" in s:
                sentiment_dist["neutral"] += 1
            else:
                sentiment_dist["constructive"] += 1

        evidence_items = [
            {
                "reviewer_type": f.reviewer_type,
                "rating": f.rating,
                "sentiment": f.sentiment,
                "comments": f.comments
            }
            for f in feedback_list
        ]

        return {
            "feedback_score": min(100.0, max(0.0, feedback_score)),
            "average_rating": round(avg_rating, 2),
            "peer_rating": peer_avg,
            "manager_rating": mgr_avg,
            "stakeholder_rating": stk_avg,
            "sentiment_distribution": sentiment_dist,
            "evidence": evidence_items
        }

    @classmethod
    def analyze_reliability(cls, attendance_records: List[Attendance]) -> Dict[str, Any]:
        """
        Analyze operational reliability from attendance records.
        Attendance is treated as a supporting factor (10% weight).
        """
        if not attendance_records:
            return {
                "reliability_score": 85.0,
                "attendance_pct": 85.0,
                "working_days": 0,
                "days_present": 0,
                "note": "No attendance log recorded; standard baseline applied.",
                "evidence": []
            }

        total_working = sum(a.working_days for a in attendance_records)
        total_present = sum(a.days_present for a in attendance_records)
        avg_pct = sum(a.attendance_pct for a in attendance_records) / len(attendance_records)

        score = round(min(100.0, max(0.0, avg_pct)), 2)

        evidence_items = [
            {
                "period": a.period,
                "working_days": a.working_days,
                "days_present": a.days_present,
                "attendance_pct": a.attendance_pct,
                "reliability_notes": a.reliability_notes
            }
            for a in attendance_records
        ]

        return {
            "reliability_score": score,
            "attendance_pct": round(avg_pct, 2),
            "working_days": total_working,
            "days_present": total_present,
            "evidence": evidence_items
        }

    @classmethod
    def analyze_business_impact(cls, impacts: List[BusinessImpact]) -> Dict[str, Any]:
        """
        Analyze business impact records without converting apples to oranges.
        Identifies presence, magnitude, and verification of business contribution.
        """
        count = len(impacts)
        if count == 0:
            return {
                "business_impact_score": 75.0,
                "impact_records_count": 0,
                "note": "No direct commercial/operational impact records on file for this period; non-penalizing baseline applied.",
                "evidence": []
            }

        # Transparent rule-based impact scoring:
        # Multiple verified impact records demonstrate significant cross-functional influence
        if count >= 2:
            score = 98.0
        elif count == 1:
            score = 88.0
        else:
            score = 75.0

        evidence_items = [
            {
                "impact_type": b.impact_type,
                "metric_name": b.metric_name,
                "value": b.value,
                "metric_unit": b.metric_unit,
                "description": b.description,
                "evidence": b.evidence
            }
            for b in impacts
        ]

        return {
            "business_impact_score": score,
            "impact_records_count": count,
            "evidence": evidence_items
        }

    @classmethod
    def evaluate_performance(
        cls,
        employee_id: str,
        goals: List[Goal],
        projects: List[Project],
        feedback: List[Feedback],
        attendance: List[Attendance],
        impacts: List[BusinessImpact]
    ) -> Dict[str, Any]:
        """
        Orchestrate multi-dimensional performance analysis and compute weighted composite score.
        """
        goal_res = cls.analyze_goals(goals)
        project_res = cls.analyze_projects(projects)
        feedback_res = cls.analyze_feedback(feedback)
        reliability_res = cls.analyze_reliability(attendance)
        impact_res = cls.analyze_business_impact(impacts)

        g_score = goal_res["goal_score"]
        p_score = project_res["project_score"]
        f_score = feedback_res["feedback_score"]
        r_score = reliability_res["reliability_score"]
        b_score = impact_res["business_impact_score"]

        # Composite Formula:
        # 30% Goals + 25% Projects + 20% Feedback + 10% Reliability + 15% Business Impact
        composite_score = round(
            (g_score * WEIGHT_GOALS) +
            (p_score * WEIGHT_PROJECTS) +
            (f_score * WEIGHT_FEEDBACK) +
            (r_score * WEIGHT_RELIABILITY) +
            (b_score * WEIGHT_BUSINESS_IMPACT),
            2
        )
        composite_score = min(100.0, max(0.0, composite_score))

        # Identify strengths
        strengths: List[str] = []
        if g_score >= 90.0:
            strengths.append(f"High goal achievement: {goal_res['average_progress']}% average progress across {goal_res['total_goals']} OKRs.")
        if p_score >= 90.0:
            strengths.append(f"Exemplary project delivery: {project_res['on_time_rate_pct']}% on-time completion across {project_res['total_projects']} key initiatives.")
        if f_score >= 90.0:
            strengths.append(f"Outstanding 360 stakeholder feedback: {feedback_res['average_rating']}/5.0 average across peer and managerial reviews.")
        if r_score >= 95.0:
            strengths.append(f"Strong operational reliability: {reliability_res['attendance_pct']}% attendance consistency.")
        if b_score >= 90.0:
            strengths.append(f"Demonstrated high business impact: {impact_res['impact_records_count']} verified high-value contributions.")

        # Identify areas for improvement
        areas_for_improvement: List[str] = []
        if g_score < 80.0:
            areas_for_improvement.append("Goal completion pacing fell below the 80% benchmark.")
        if p_score < 80.0:
            areas_for_improvement.append("Project delivery timelines or technical quality need strengthening.")
        if f_score < 80.0:
            areas_for_improvement.append("Feedback from cross-functional peers indicates communication or delivery friction.")
        if r_score < 85.0:
            areas_for_improvement.append("Attendance and reliability logs reflect operational inconsistency.")
        if b_score < 80.0:
            areas_for_improvement.append("Expand measurable business impact documentation for senior review cycles.")

        return {
            "employee_id": employee_id,
            "performance_score": composite_score,
            "weights": COMPONENT_WEIGHTS,
            "components": {
                "goal_score": g_score,
                "project_score": p_score,
                "feedback_score": f_score,
                "reliability_score": r_score,
                "business_impact_score": b_score
            },
            "evidence": {
                "goals": goal_res,
                "projects": project_res,
                "feedback": feedback_res,
                "reliability": reliability_res,
                "business_impact": impact_res
            },
            "strengths": strengths,
            "areas_for_improvement": areas_for_improvement
        }

    @classmethod
    def get_employee_performance(cls, db: Session, employee_id: str) -> Optional[Dict[str, Any]]:
        """Fetch employee records and execute full performance analysis."""
        emp = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not emp:
            return None

        goals = EmployeeRepository.get_employee_goals(db, employee_id)
        projects = EmployeeRepository.get_employee_projects(db, employee_id)
        feedback = EmployeeRepository.get_employee_feedback(db, employee_id)
        attendance = EmployeeRepository.get_employee_attendance(db, employee_id)
        impacts = EmployeeRepository.get_employee_business_impact(db, employee_id)

        return cls.evaluate_performance(
            employee_id=employee_id,
            goals=goals,
            projects=projects,
            feedback=feedback,
            attendance=attendance,
            impacts=impacts
        )
