"""
ZEROBUGS HRM-05: Manager Calibration & Inconsistency Detection Service
Compares manager evaluation scores against evidence-based composite performance scores
to detect evaluation variances and recommend neutral HR calibration reviews.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.database.repository import EmployeeRepository
from backend.app.models import Employee, ManagerEvaluation


# Configurable Inconsistency Discrepancy Threshold (Percentage Points)
VARIANCE_THRESHOLD: float = 20.0


class CalibrationService:
    """Objective, neutral evaluation calibration engine."""

    @classmethod
    def evaluate_employee_calibration(
        cls,
        employee_id: str,
        employee_name: str,
        manager_evaluations: List[ManagerEvaluation],
        evidence_score: float,
        evidence_breakdown: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Compare the latest manager evaluation rating against the objective evidence composite score.
        Uses strictly neutral language and evidence citations.
        """
        if not manager_evaluations:
            return {
                "employee_id": employee_id,
                "employee_name": employee_name,
                "manager_name": None,
                "manager_rating": None,
                "manager_normalized_score": None,
                "evidence_score": round(evidence_score, 2),
                "variance": None,
                "flag": False,
                "message": "No manager evaluation on file for calibration comparison.",
                "review_recommended": False,
                "evidence_summary": {
                    "note": "Evaluation pending managerial submission."
                }
            }

        latest_eval = manager_evaluations[0]
        m_rating = latest_eval.rating
        m_normalized = round(m_rating * 20.0, 2)
        variance = round(m_normalized - evidence_score, 2)
        abs_variance = abs(variance)

        is_flagged = abs_variance >= VARIANCE_THRESHOLD

        if is_flagged:
            message = "Potential evaluation inconsistency detected."
            review_recommended = True
        else:
            message = "Manager evaluation is aligned with objective evidence."
            review_recommended = False

        evidence_summary = {
            "evaluation_cycle": latest_eval.evaluation_cycle,
            "manager_comments": latest_eval.comments,
            "evaluation_date": latest_eval.evaluation_date,
            "peer_feedback_comparison": None,
            "variance_magnitude": abs_variance
        }

        if evidence_breakdown and "feedback" in evidence_breakdown:
            fb = evidence_breakdown["feedback"]
            evidence_summary["peer_feedback_comparison"] = {
                "peer_rating": fb.get("peer_rating"),
                "overall_feedback_score": fb.get("feedback_score")
            }

        return {
            "employee_id": employee_id,
            "employee_name": employee_name,
            "manager_name": latest_eval.manager_name,
            "manager_rating": m_rating,
            "manager_normalized_score": m_normalized,
            "evidence_score": round(evidence_score, 2),
            "variance": variance,
            "flag": is_flagged,
            "message": message,
            "review_recommended": review_recommended,
            "evidence_summary": evidence_summary
        }

    @classmethod
    def get_employee_calibration(
        cls,
        db: Session,
        employee_id: str,
        evidence_score: Optional[float] = None
    ) -> Optional[Dict[str, Any]]:
        """Fetch records from DB and compute employee calibration."""
        from backend.app.services.performance_service import PerformanceService

        emp = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not emp:
            return None

        if evidence_score is None:
            perf = PerformanceService.get_employee_performance(db, employee_id) or {}
            evidence_score = perf.get("performance_score", 70.0)
            evidence_breakdown = perf.get("evidence", {})
        else:
            evidence_breakdown = {}

        manager_evals = EmployeeRepository.get_employee_manager_evaluations(db, employee_id)

        return cls.evaluate_employee_calibration(
            employee_id=employee_id,
            employee_name=emp.name,
            manager_evaluations=manager_evals,
            evidence_score=evidence_score,
            evidence_breakdown=evidence_breakdown
        )

    @classmethod
    def get_org_calibration(cls, db: Session) -> Dict[str, Any]:
        """
        Run calibration analysis across all employees in the organization.
        Identifies potential evaluation variances organization-wide.
        """
        from backend.app.services.performance_service import PerformanceService

        employees = EmployeeRepository.get_all_employees(db, limit=200)
        all_calibrations: List[Dict[str, Any]] = []
        flagged_calibrations: List[Dict[str, Any]] = []

        total_variance = 0.0
        variance_count = 0

        for emp in employees:
            perf = PerformanceService.get_employee_performance(db, emp.employee_id) or {}
            ev_score = perf.get("performance_score", 70.0)
            ev_breakdown = perf.get("evidence", {})
            evals = EmployeeRepository.get_employee_manager_evaluations(db, emp.employee_id)

            cal_res = cls.evaluate_employee_calibration(
                employee_id=emp.employee_id,
                employee_name=emp.name,
                manager_evaluations=evals,
                evidence_score=ev_score,
                evidence_breakdown=ev_breakdown
            )

            all_calibrations.append(cal_res)
            if cal_res["flag"]:
                flagged_calibrations.append(cal_res)

            if cal_res["variance"] is not None:
                total_variance += abs(cal_res["variance"])
                variance_count += 1

        avg_variance = round(total_variance / variance_count, 2) if variance_count > 0 else 0.0

        return {
            "total_evaluated": len(all_calibrations),
            "flagged_count": len(flagged_calibrations),
            "aligned_count": len(all_calibrations) - len(flagged_calibrations),
            "average_variance": avg_variance,
            "variance_threshold": VARIANCE_THRESHOLD,
            "flagged_evaluations": flagged_calibrations,
            "all_evaluations": all_calibrations
        }
