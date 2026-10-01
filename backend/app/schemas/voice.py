"""
ZEROBUGS HRM-05: Voice Intelligence Pydantic Schemas.
"""

from pydantic import BaseModel, Field, ConfigDict


class VoicePerformanceResponse(BaseModel):
    status: str = Field(default="success", description="Status of the voice operation ('success')")
    employee_id: str = Field(..., description="Corporate employee ID (e.g. EMP001)")
    employee_name: str = Field(..., description="Full name of the employee")
    summary_text: str = Field(..., description="Concise, HR-professional summary used for voice generation")
    audio_url: str = Field(..., description="URL to stream or download generated MP3 audio")
    cached: bool = Field(..., description="Whether audio was served from existing cache")

    model_config = ConfigDict(from_attributes=True)
