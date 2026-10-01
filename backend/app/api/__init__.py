"""API routers and endpoints package."""

from backend.app.api.employees import router as employees_router
from backend.app.api.calibration import router as calibration_router
from backend.app.api.analysis import router as analysis_router
from backend.app.api.voice import router as voice_router

__all__ = ["employees_router", "calibration_router", "analysis_router", "voice_router"]
