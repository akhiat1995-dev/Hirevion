import sys
import os
from pathlib import Path

backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import candidate, recruiter, auth
from config.database import connect_db, close_db, get_statistics
from config.settings import settings

def validate_settings():
    try:
        settings.validate_all()
    except ValueError as e:
        print(f"WARNING: {e}")
        print("Server will continue but some features may not work properly.")

validate_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

origins = settings.allowed_origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

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
    try:
        stats = await get_statistics()
        return {"success": True, "stats": stats}
    except Exception as e:
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

if __name__ == "__main__":
    import uvicorn
    import socket

    def find_free_port(start_port=8000, max_attempts=10):
        for port in range(start_port, start_port + max_attempts):
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(('0.0.0.0', port))
                s.close()
                return port
            except OSError:
                s.close()
                continue
        return start_port

    port = find_free_port()
    print(f"Starting Hirevion Backend on port {port}...")
    print(f"Server: http://localhost:{port}")
    print(f"Docs: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)