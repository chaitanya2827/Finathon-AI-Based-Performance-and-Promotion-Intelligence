"""
ZEROBUGS HRM-05: AI-Based Performance & Promotion Intelligence
FastAPI Application Entry Point
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.app.config import settings
from backend.app.api import employees_router, calibration_router, analysis_router, voice_router
from backend.app.database.database import SessionLocal
from backend.app.models.employee import Employee

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for HRM-05: AI-Based Performance & Promotion Intelligence",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration for frontend modules
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(employees_router, prefix="/api")
app.include_router(calibration_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(voice_router, prefix="/api")


# Global Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "path": str(request.url.path),
            }
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "success": False,
            "error": {
                "code": 422,
                "message": "Validation error in request payload",
                "details": exc.errors(),
                "path": str(request.url.path),
            }
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error occurred",
            "success": False,
            "error": {
                "code": 500,
                "message": "Internal server error occurred",
                "path": str(request.url.path),
            }
        },
    )


# Root Endpoint
@app.get("/", tags=["General"])
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "code": settings.PROJECT_CODE,
        "version": settings.VERSION,
        "status": "online",
        "phase": "Phase 4 - Backend Hardening & Complete API Testing Complete",
        "docs_url": "/docs"
    }


# Health Check Endpoint
@app.get("/api/health", tags=["Health"])
async def health_check():
    db_connected = False
    employee_count = 0
    try:
        db = SessionLocal()
        employee_count = db.query(Employee).count()
        db_connected = True
        db.close()
    except Exception:
        db_connected = False

    return {
        "status": "healthy" if db_connected else "degraded",
        "backend": "online",
        "database": "sqlite_ready" if db_connected else "database_unavailable",
        "employee_count": employee_count,
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
