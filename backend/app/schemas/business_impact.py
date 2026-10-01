"""
BusinessImpact Pydantic schemas.
"""

from pydantic import BaseModel, ConfigDict


class BusinessImpactRead(BaseModel):
    id: str
    employee_id: str
    impact_type: str
    metric_name: str
    value: str
    metric_unit: str
    description: str
    evidence: str

    model_config = ConfigDict(from_attributes=True)
