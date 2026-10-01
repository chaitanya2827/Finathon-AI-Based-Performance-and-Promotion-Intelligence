"""
Feedback Pydantic schemas.
"""

from pydantic import BaseModel, ConfigDict


class FeedbackRead(BaseModel):
    id: str
    employee_id: str
    reviewer_type: str
    rating: float
    comments: str
    sentiment: str

    model_config = ConfigDict(from_attributes=True)
