"""
Repository and data access layer for ZEROBUGS HRM-05.
Keeps database queries encapsulated and separate from API and AI services.
"""

from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session, joinedload
from backend.app.models import (
    Employee,
    Role,
    Skill,
    RoleRequiredSkill,
    Goal,
    Project,
    Feedback,
    EmployeeSkill,
    Training,
    Attendance,
    BusinessImpact,
    ManagerEvaluation,
    AnalysisResult
)


class EmployeeRepository:
    @staticmethod
    def get_all_employees(db: Session, skip: int = 0, limit: int = 100) -> List[Employee]:
        """Retrieve all employees with basic role relationships loaded."""
        return (
            db.query(Employee)
            .options(
                joinedload(Employee.current_role),
                joinedload(Employee.target_role)
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_employee_by_id(db: Session, employee_id: str) -> Optional[Employee]:
        """Retrieve an employee by corporate employee_id (e.g., EMP001)."""
        return (
            db.query(Employee)
            .options(
                joinedload(Employee.current_role),
                joinedload(Employee.target_role),
                joinedload(Employee.manager)
            )
            .filter(Employee.employee_id == employee_id)
            .first()
        )

    @staticmethod
    def get_employee_goals(db: Session, employee_id: str) -> List[Goal]:
        """Retrieve all OKRs and goals for an employee."""
        return db.query(Goal).filter(Goal.employee_id == employee_id).all()

    @staticmethod
    def get_employee_projects(db: Session, employee_id: str) -> List[Project]:
        """Retrieve all project records for an employee."""
        return db.query(Project).filter(Project.employee_id == employee_id).all()

    @staticmethod
    def get_employee_feedback(db: Session, employee_id: str) -> List[Feedback]:
        """Retrieve all 360 feedback records for an employee."""
        return db.query(Feedback).filter(Feedback.employee_id == employee_id).all()

    @staticmethod
    def get_employee_skills(db: Session, employee_id: str) -> List[EmployeeSkill]:
        """Retrieve evaluated skill proficiencies with skill definitions for an employee."""
        return (
            db.query(EmployeeSkill)
            .options(joinedload(EmployeeSkill.skill))
            .filter(EmployeeSkill.employee_id == employee_id)
            .all()
        )

    @staticmethod
    def get_employee_training(db: Session, employee_id: str) -> List[Training]:
        """Retrieve all training and development records for an employee."""
        return db.query(Training).filter(Training.employee_id == employee_id).all()

    @staticmethod
    def get_employee_attendance(db: Session, employee_id: str) -> List[Attendance]:
        """Retrieve attendance and operational reliability records for an employee."""
        return db.query(Attendance).filter(Attendance.employee_id == employee_id).all()

    @staticmethod
    def get_employee_business_impact(db: Session, employee_id: str) -> List[BusinessImpact]:
        """Retrieve business impact records for an employee."""
        return db.query(BusinessImpact).filter(BusinessImpact.employee_id == employee_id).all()

    @staticmethod
    def get_employee_manager_evaluations(db: Session, employee_id: str) -> List[ManagerEvaluation]:
        """Retrieve manager evaluation records for an employee."""
        return db.query(ManagerEvaluation).filter(ManagerEvaluation.employee_id == employee_id).all()

    @staticmethod
    def get_employee_evidence(db: Session, employee_id: str) -> Optional[Dict[str, Any]]:
        """
        Aggregate all 9 evidence dimensions for an employee into a structured package.
        Returns None if employee does not exist.
        """
        employee = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not employee:
            return None

        return {
            "employee_id": employee.employee_id,
            "name": employee.name,
            "department": employee.department,
            "current_role": employee.current_role.name if employee.current_role else None,
            "target_role": employee.target_role.name if employee.target_role else None,
            "evidence": {
                "goals": EmployeeRepository.get_employee_goals(db, employee_id),
                "projects": EmployeeRepository.get_employee_projects(db, employee_id),
                "feedback": EmployeeRepository.get_employee_feedback(db, employee_id),
                "skills": EmployeeRepository.get_employee_skills(db, employee_id),
                "training": EmployeeRepository.get_employee_training(db, employee_id),
                "attendance": EmployeeRepository.get_employee_attendance(db, employee_id),
                "business_impact": EmployeeRepository.get_employee_business_impact(db, employee_id),
                "manager_evaluations": EmployeeRepository.get_employee_manager_evaluations(db, employee_id)
            }
        }

    @staticmethod
    def get_role_required_skills(db: Session, role_id: str) -> List[RoleRequiredSkill]:
        """Retrieve required skill expectations for a specific role with skill definitions."""
        return (
            db.query(RoleRequiredSkill)
            .options(joinedload(RoleRequiredSkill.skill))
            .filter(RoleRequiredSkill.role_id == role_id)
            .all()
        )

    @staticmethod
    def save_analysis_result(db: Session, result_data: Dict[str, Any]) -> AnalysisResult:
        """
        Idempotently insert or update an AnalysisResult for an employee.
        Preserves structured JSON serialization and prevents duplicate records.
        """
        emp_id = result_data["employee_id"]
        record = db.query(AnalysisResult).filter(AnalysisResult.employee_id == emp_id).first()
        if not record:
            record = AnalysisResult(
                id=f"AR_{emp_id}",
                employee_id=emp_id,
                readiness_level=result_data.get("readiness_level"),
                strengths=result_data.get("strengths"),
                evidence_summary=result_data.get("evidence_summary"),
                missing_requirements=result_data.get("missing_requirements"),
                development_actions=result_data.get("development_actions"),
                calibration_details=result_data.get("calibration_details"),
                generated_at=result_data.get("generated_at")
            )
            db.add(record)
        else:
            record.readiness_level = result_data.get("readiness_level")
            record.strengths = result_data.get("strengths")
            record.evidence_summary = result_data.get("evidence_summary")
            record.missing_requirements = result_data.get("missing_requirements")
            record.development_actions = result_data.get("development_actions")
            record.calibration_details = result_data.get("calibration_details")
            record.generated_at = result_data.get("generated_at")
        try:
            db.commit()
            db.refresh(record)
            return record
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get_analysis_result(db: Session, employee_id: str) -> Optional[AnalysisResult]:
        """Retrieve the latest stored AnalysisResult for an employee."""
        return db.query(AnalysisResult).filter(AnalysisResult.employee_id == employee_id).first()
