"""
ZEROBUGS HRM-05: Phase 3 Analytics Pydantic Schemas.
Structured models for performance, skill assessment, career pathways,
promotion readiness, manager calibration, and AI reasoning.
"""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field, ConfigDict


# 1. Performance Models
class PerformanceComponents(BaseModel):
    goal_score: float = Field(..., description="Normalized goal achievement score (0-100)")
    project_score: float = Field(..., description="Normalized project outcome and on-time score (0-100)")
    feedback_score: float = Field(..., description="Normalized 360 feedback rating score (0-100)")
    reliability_score: float = Field(..., description="Normalized attendance and operational reliability score (0-100)")
    business_impact_score: float = Field(..., description="Normalized measurable business impact score (0-100)")


class PerformanceAnalysisResult(BaseModel):
    employee_id: str
    performance_score: float = Field(..., description="Weighted composite score (0-100)")
    weights: Dict[str, float] = Field(..., description="Documented component weights")
    components: PerformanceComponents
    evidence: Dict[str, Any] = Field(..., description="Underlying evidence breakdown per dimension")
    strengths: List[str] = Field(default_factory=list, description="Performance strengths identified from evidence")
    areas_for_improvement: List[str] = Field(default_factory=list, description="Opportunities for growth")


# 2. Skill Gap Models
class SkillRequirementItem(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    current_level: int
    required_level: int
    gap: int
    status: str = Field(..., description="'meets_requirement' or 'development_gap'")
    is_mandatory: bool
    priority: str = Field(..., description="'critical', 'moderate', or 'met'")
    reason: str


class StrongSkillItem(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    proficiency_level: int


class SkillGapAnalysisResult(BaseModel):
    employee_id: str
    target_role_id: Optional[str] = None
    target_role_name: Optional[str] = None
    total_required: int
    mandatory_count: int
    mandatory_met_count: int
    overall_match_pct: float
    mandatory_met_pct: float
    critical_gaps: List[SkillRequirementItem]
    moderate_gaps: List[SkillRequirementItem]
    skills_meeting_requirements: List[SkillRequirementItem]
    strong_skills: List[StrongSkillItem]


# 3. Career Path Models
class CareerMilestone(BaseModel):
    step: int
    title: str
    status: str = Field(..., description="'completed', 'in_progress', or 'recommended'")
    description: str


class RecommendedAction(BaseModel):
    category: str
    action: str
    target_skill: str
    recommended_resource: Optional[str] = None
    timeline: str


class CareerRoleInfo(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    department: Optional[str] = None


class CareerPathResult(BaseModel):
    employee_id: str
    current_role: CareerRoleInfo
    target_role: CareerRoleInfo
    readiness_context: str
    milestones: List[CareerMilestone]
    recommended_development_actions: List[RecommendedAction]
    disclaimer: str = "The career service is a recommendation engine, not a decision-maker."


# 4. Promotion Readiness Models
class PromotionReadinessResult(BaseModel):
    employee_id: str
    readiness_level: str = Field(..., description="'Ready Now' | 'Developing - Ready in 6-12 Months' | 'Needs Foundation'")
    readiness_assessment_note: Optional[str] = Field(
        default="System-generated readiness assessment based on available performance, competency, consistency, and impact evidence.",
        description="Clarification that readiness is an analytical assessment, not a final decision"
    )
    performance_score: float
    competence_summary: Dict[str, Any]
    consistency_summary: Dict[str, Any]
    impact_summary: Dict[str, Any]
    strengths: List[str]
    supporting_evidence: List[str]
    missing_requirements: List[str]
    development_actions: List[str]
    human_review_required: bool = True
    disclaimer: str = "Final promotion decisions remain with HR and managers."


# 5. Manager Calibration Models
class EmployeeCalibrationResult(BaseModel):
    employee_id: str
    employee_name: str
    manager_name: Optional[str] = None
    manager_rating: Optional[float] = None
    manager_normalized_score: Optional[float] = None
    evidence_score: float
    variance: Optional[float] = None
    flag: bool
    message: str
    review_recommended: bool
    evidence_summary: Dict[str, Any]


class OrgCalibrationSummaryResult(BaseModel):
    total_evaluated: int
    flagged_count: int
    aligned_count: int
    average_variance: float
    variance_threshold: float
    flagged_evaluations: List[EmployeeCalibrationResult]
    all_evaluations: List[EmployeeCalibrationResult]


# 6. Comprehensive End-to-End Analysis Models
class EmployeeSummaryInfo(BaseModel):
    employee_id: str
    name: str
    department: str
    current_role: Optional[str] = None
    target_role: Optional[str] = None


class ComprehensiveAnalysisResult(BaseModel):
    employee: EmployeeSummaryInfo
    performance: PerformanceAnalysisResult
    skills: SkillGapAnalysisResult
    career: CareerPathResult
    promotion: PromotionReadinessResult
    calibration: EmployeeCalibrationResult
    explanation: Dict[str, Any]
    explanation_narrative: str
    persisted: bool = True
    generated_at: str

    model_config = ConfigDict(from_attributes=True)
