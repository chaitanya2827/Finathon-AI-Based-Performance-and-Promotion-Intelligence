"""
ZEROBUGS HRM-05: Voice Intelligence Service
Converts existing deterministic employee performance analyses into concise,
HR-professional, evidence-grounded voice briefs using ElevenLabs Text-to-Speech.
Implements robust credit protection via SHA-256 caching.
"""

import hashlib
import logging
import re
from pathlib import Path
from typing import Dict, Any, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.database.repository import EmployeeRepository
from backend.app.services.analysis_service import AnalysisOrchestrator

logger = logging.getLogger(__name__)

SAFE_FILENAME_REGEX = re.compile(r"^[A-Za-z0-9_-]+\.mp3$")
SAFE_ID_REGEX = re.compile(r"^[A-Za-z0-9_-]+$")


class VoiceService:
    """Service for generating and serving AI Performance Voice Briefs."""

    @classmethod
    def build_voice_summary(cls, analysis: Dict[str, Any]) -> str:
        """
        Build an HR-professional, concise, and evidence-grounded summary from
        the existing WORKVISTA analysis payload (500-800 characters).
        Adheres strictly to neutral calibration language and advisory disclaimers.
        """
        emp = analysis.get("employee", {})
        name = emp.get("name", "The employee")
        current_role = emp.get("current_role")

        perf = analysis.get("performance", {})
        score = perf.get("performance_score", 0.0)
        components = perf.get("components", {})
        if isinstance(components, dict):
            comp_dict = components
        else:
            comp_dict = getattr(components, "__dict__", {})

        skills = analysis.get("skills", {})
        critical_gaps = skills.get("critical_gaps", [])
        moderate_gaps = skills.get("moderate_gaps", [])

        career = analysis.get("career", {})
        target_role_info = career.get("target_role", {})
        if isinstance(target_role_info, dict):
            target_role_name = target_role_info.get("name") or emp.get("target_role") or "the target role"
        else:
            target_role_name = getattr(target_role_info, "name", None) or emp.get("target_role") or "the target role"

        promotion = analysis.get("promotion", {})
        readiness = promotion.get("readiness_level", "Under Review")

        calibration = analysis.get("calibration", {})
        cal_flag = calibration.get("flag", False)

        # 1. Performance and current role
        if current_role:
            intro = f"{name} is currently assessed at {score:.1f} percent performance in the role of {current_role}."
        else:
            intro = f"{name} is currently assessed at {score:.1f} percent performance."

        # 2. Key evidence achievements
        high_areas = []
        if comp_dict.get("goal_score", 0) >= 90:
            high_areas.append("goal completion")
        if comp_dict.get("project_score", 0) >= 90:
            high_areas.append("project delivery")
        if comp_dict.get("business_impact_score", 0) >= 90:
            high_areas.append("business impact")
        if comp_dict.get("feedback_score", 0) >= 90:
            high_areas.append("stakeholder feedback")
        if comp_dict.get("reliability_score", 0) >= 95:
            high_areas.append("operational reliability")

        def format_list(items: list[str]) -> str:
            if not items:
                return ""
            if len(items) == 1:
                return items[0]
            if len(items) == 2:
                return f"{items[0]} and {items[1]}"
            return f"{', '.join(items[:-1])}, and {items[-1]}"

        if high_areas:
            evidence_str = f"The evidence indicates strong achievement across {format_list(high_areas[:3])}."
        else:
            evidence_str = "The evidence reflects solid contributions across operational deliverables."

        # 3. Competencies and Skill Gaps
        if critical_gaps:
            gap_names = [
                g.get("skill_name") if isinstance(g, dict) else getattr(g, "skill_name", "key skill")
                for g in critical_gaps[:2]
            ]
            skills_str = f"Key development priorities focus on {format_list(gap_names)} to support readiness for {target_role_name}."
        elif moderate_gaps:
            gap_names = [
                g.get("skill_name") if isinstance(g, dict) else getattr(g, "skill_name", "elective skill")
                for g in moderate_gaps[:2]
            ]
            skills_str = f"All mandatory competencies for {target_role_name} are satisfied, with moderate elective development suggested in {format_list(gap_names)}."
        else:
            skills_str = f"All core competencies for {target_role_name} are met with zero critical skill gaps."

        # 4. Career and Promotion Readiness
        career_str = f"The current career recommendation is {target_role_name}, with the analysis indicating {readiness}."

        # 5. Calibration (strictly neutral, non-accusatory wording)
        cal_str = ""
        if cal_flag:
            cal_str = " Potential evaluation inconsistency detected; the difference has been flagged for HR review and calibration."

        # 6. Advisory disclaimer
        disclaimer = "These insights are advisory and final promotion decisions remain with HR and management."

        summary = f"{intro} {evidence_str} {skills_str} {career_str}{cal_str} {disclaimer}".strip()
        return summary

    @classmethod
    def get_cache_key(cls, employee_id: str, summary_text: str, voice_id: str, model_id: str) -> str:
        """Generate deterministic SHA-256 cache key from input parameters."""
        cache_input = f"{employee_id}|{summary_text}|{voice_id}|{model_id}"
        return hashlib.sha256(cache_input.encode("utf-8")).hexdigest()[:16]

    @classmethod
    def get_audio_filename(cls, employee_id: str, cache_key: str) -> str:
        """Create a safe, structured audio filename: EMP001_<hash>.mp3."""
        clean_emp_id = re.sub(r"[^A-Za-z0-9_-]", "", employee_id)
        return f"{clean_emp_id}_{cache_key}.mp3"

    @classmethod
    def generate_voice_brief(cls, db: Session, employee_id: str) -> Dict[str, Any]:
        """
        Generate or retrieve cached AI Performance Voice Brief for an employee.
        Guarantees that ElevenLabs is only called on a cache miss.
        """
        # 1. Validate employee existence
        emp = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not emp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found."
            )

        # 2. Reuse existing AnalysisOrchestrator pipeline
        analysis = AnalysisOrchestrator.analyze_employee(db, employee_id, persist=True)
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate analysis for employee '{employee_id}'."
            )

        employee_name = analysis.get("employee", {}).get("name", emp.name)

        # 3. Build concise, professional summary
        summary_text = cls.build_voice_summary(analysis)

        # 4. Configuration and deterministic cache check
        voice_id = settings.ELEVENLABS_VOICE_ID
        model_id = settings.ELEVENLABS_MODEL_ID or "eleven_flash_v2_5"

        cache_key = cls.get_cache_key(employee_id, summary_text, voice_id, model_id)
        filename = cls.get_audio_filename(employee_id, cache_key)

        audio_dir = settings.AUDIO_DIR
        audio_dir.mkdir(parents=True, exist_ok=True)
        audio_path = audio_dir / filename

        # 5. Credit Protection: Check if already cached on disk
        if audio_path.exists() and audio_path.stat().st_size > 0:
            logger.info("Serving cached audio for employee %s (%s)", employee_id, filename)
            return {
                "status": "success",
                "employee_id": employee_id,
                "employee_name": employee_name,
                "summary_text": summary_text,
                "audio_url": f"/api/voice/audio/{filename}",
                "cached": True
            }

        # 6. Validate ElevenLabs credentials before calling external API
        if not settings.ELEVENLABS_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ElevenLabs text-to-speech service is unavailable: ELEVENLABS_API_KEY is not configured."
            )

        if not voice_id:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ElevenLabs text-to-speech service is unavailable: ELEVENLABS_VOICE_ID is not configured."
            )

        # 7. Synthesize audio via ElevenLabs SDK
        try:
            from elevenlabs.client import ElevenLabs
            client = ElevenLabs(api_key=settings.ELEVENLABS_API_KEY)
            audio = client.text_to_speech.convert(
                voice_id=voice_id,
                model_id=model_id,
                text=summary_text
            )

            # Write atomically using a temporary file
            temp_path = audio_path.with_suffix(".tmp")
            with open(temp_path, "wb") as f:
                if isinstance(audio, (bytes, bytearray)):
                    f.write(audio)
                else:
                    for chunk in audio:
                        f.write(chunk)
            temp_path.replace(audio_path)
            logger.info("Generated new ElevenLabs audio for employee %s (%s)", employee_id, filename)

        except HTTPException:
            raise
        except Exception as exc:
            # Never leak the API key or raw credentials in logs or responses
            logger.error("ElevenLabs synthesis error for employee %s: %s", employee_id, type(exc).__name__)
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to synthesize voice audio with ElevenLabs service."
            )

        return {
            "status": "success",
            "employee_id": employee_id,
            "employee_name": employee_name,
            "summary_text": summary_text,
            "audio_url": f"/api/voice/audio/{filename}",
            "cached": False
        }

    @classmethod
    def resolve_audio_file(cls, filename: str, employee_id: Optional[str] = None) -> Path:
        """
        Validate path and return resolved path to audio file.
        Strictly prevents path traversal and verifies file boundaries.
        """
        if not SAFE_FILENAME_REGEX.match(filename):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid audio filename format."
            )

        if employee_id:
            if not SAFE_ID_REGEX.match(employee_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid employee ID format."
                )
            if not filename.startswith(f"{employee_id}_"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Filename does not match the specified employee ID."
                )

        audio_dir = settings.AUDIO_DIR.resolve()
        target_path = (audio_dir / filename).resolve()

        # Prevent directory traversal attacks
        try:
            target_path.relative_to(audio_dir)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Directory traversal attempt detected."
            )

        if not target_path.exists() or not target_path.is_file():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Audio file '{filename}' not found."
            )

        return target_path
