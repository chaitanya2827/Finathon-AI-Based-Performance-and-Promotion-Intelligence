"""
ZEROBUGS HRM-05: Voice Intelligence API Router.
Provides endpoints to generate AI Performance Voice Briefs using ElevenLabs
and serve cached MP3 audio files securely.
"""

from fastapi import APIRouter, Depends, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.schemas.voice import VoicePerformanceResponse
from backend.app.services.voice_service import VoiceService

router = APIRouter(prefix="/voice", tags=["Voice Intelligence"])


@router.post("/performance/{employee_id}", response_model=VoicePerformanceResponse, status_code=status.HTTP_200_OK)
def generate_employee_voice_brief(employee_id: str, db: Session = Depends(get_db)):
    """
    Generate an AI Performance Voice Brief for an employee.
    Reuses existing deterministic analysis data, synthesizes natural spoken audio
    via ElevenLabs (credit-protected with SHA-256 caching), and returns audio metadata.
    """
    return VoiceService.generate_voice_brief(db, employee_id)


@router.get("/audio/{employee_id}/{filename}")
def serve_employee_audio_file(employee_id: str, filename: str):
    """
    Serve cached MP3 audio file for a specific employee.
    Validates employee ID and filename, prevents directory traversal, and returns audio/mpeg.
    """
    file_path = VoiceService.resolve_audio_file(filename=filename, employee_id=employee_id)
    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=file_path.name
    )


@router.get("/audio/{filename}")
def serve_audio_file(filename: str):
    """
    Serve cached MP3 audio file by filename.
    Validates filename format, prevents directory traversal, and returns audio/mpeg.
    """
    file_path = VoiceService.resolve_audio_file(filename=filename)
    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=file_path.name
    )
