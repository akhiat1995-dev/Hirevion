import sys
from pathlib import Path

# Add the BACKEND directory to Python path
backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import candidate, recruiter, auth
from config.database import connect_db, close_db, get_statistics
from config.settings import settings

# Validate settings at startup
settings.validate_all()

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION
)

# CORS - Use centralized settings
origins = settings.allowed_origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Connect to database on startup."""
    await connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown."""
    await close_db()

app.include_router(auth.router)
app.include_router(candidate.router)
app.include_router(recruiter.router)

@app.get("/")
def read_root():
    return {
        "message": "Hirevion Backend is Running!",
        "version": "1.0.0",
        "docs": "/docs",
        "brand": "Hirevion - Smart Hiring"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint to verify API and database status."""
    from datetime import datetime
    from config.database import database

    db_status = "connected" if database.db is not None else "disconnected"

    return {
        "status": "healthy",
        "version": "1.0.0",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/stats")
async def get_platform_stats():
    """
    Get platform statistics for dashboard.
    
    Returns:
    - total_cvs: Total number of CVs analyzed
    - total_jobs: Total number of job postings
    - total_applications: Total recruiter applications
    - average_score: Average CV score
    - average_experience_years: Average years of experience
    - top_skills: Top 10 most common skills
    """
    try:
        stats = await get_statistics()
        return {
            "success": True,
            "stats": stats
        }
    except Exception as e:
        print(f"❌ Error getting statistics: {e}")
        return {
            "success": False,
            "error": str(e),
            "stats": {
                "total_cvs": 0,
                "total_jobs": 0,
                "total_applications": 0,
                "average_score": 0,
                "average_experience_years": 0,
                "top_skills": []
            }
        }

# Run server when executed directly
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Hirevion Backend...")
    print("🎯 Smart Hiring Platform")
    print("📡 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)