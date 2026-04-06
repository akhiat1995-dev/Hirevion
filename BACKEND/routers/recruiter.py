import os
import tempfile
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from services.agent import run_hiring_pipeline, extract_job_profile, parse_cv_with_ai
from config.database import (
    save_recruiter_application,
    get_all_recruiter_applications,
    get_user_recruiter_applications,
    get_recruiter_application_by_id,
    delete_recruiter_application,
    clear_all_recruiter_applications,
    save_job,
    get_all_jobs,
    get_user_jobs,
    get_job_by_id,
    update_job,
    delete_job,
    save_hiring_session,
    get_all_hiring_sessions,
    get_user_hiring_sessions,
    get_hiring_session_by_id,
    delete_hiring_session,
    clear_all_hiring_sessions
)
from config.settings import settings
from services.extractor import read_pdf
from utils.validators import validate_file_extension, validate_file_size, validate_text_content
from utils.response import success_response, error_response
from middleware.auth import get_current_user, require_role

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])

# ============ MAIN ENDPOINT - COMPLETE RECRUITER WORKFLOW ============

@router.post("/hiring")
async def recruiter_hiring_workflow(
    job_title: str = Form(..., description="Job title"),
    number_of_positions: int = Form(..., ge=1, le=100, description="Number of open positions"),
    job_requirements: str = Form(..., description="Job requirements and description"),
    cvs: List[UploadFile] = File(..., description="Upload multiple CV files (PDF)"),
    current_user: dict = Depends(require_role("recruiter"))
):
    """
    ╔═══════════════════════════════════════════════════════════════════════════╗
    ║              COMPLETE RECRUITER WORKFLOW - ALL IN ONE                      ║
    ╠═══════════════════════════════════════════════════════════════════════════╣
    ║                                                                           ║
    ║  STEP 1 — JOB SETUP                                                       ║
    ║  ┌─────────────────────────────────────────────────────────────────────┐   ║
    ║  │ job_title: "Senior Full Stack Developer"                            │   ║
    ║  │ number_of_positions: 2                                              │   ║
    ║  │ job_requirements: "5+ years experience, Python, React..."           │   ║
    ║  └─────────────────────────────────────────────────────────────────────┘   ║
    ║                                                                           ║
    ║  STEP 2 — UPLOAD CVS                                                      ║
    ║  ┌─────────────────────────────────────────────────────────────────────┐   ║
    ║  │ Upload multiple PDF files (candidates' CVs)                         │   ║
    ║  └─────────────────────────────────────────────────────────────────────┘   ║
    ║                                                                           ║
    ║  STEP 3 — AI PROCESSING                                                   ║
    ║  ┌─────────────────────────────────────────────────────────────────────┐   ║
    ║  │ • Extracts and structures job profile                               │   ║
    ║  │ • Analyzes all CVs                                                  │   ║
    ║  │ • Compares candidates against job requirements                      │   ║
    ║  │ • Scores each candidate (0-100)                                     │   ║
    ║  └─────────────────────────────────────────────────────────────────────┘   ║
    ║                                                                           ║
    ║  STEP 4 — SELECTION                                                       ║
    ║  ┌─────────────────────────────────────────────────────────────────────┐   ║
    ║  │ • Ranks candidates by score                                         │   ║
    ║  │ • Selects top N candidates (N = number_of_positions)               │   ║
    ║  │ • Only QUALIFIED candidates selected (no forcing)                   │   ║
    ║  └─────────────────────────────────────────────────────────────────────┘   ║
    ║                                                                           ║
    ║  STEP 5 — HR DASHBOARD OUTPUT                                             ║
    ║  ┌─────────────────────────────────────────────────────────────────────┐   ║
    ║  │ • job_summary                                                       │   ║
    ║  │ • selected_candidates (with strengths, weaknesses, scores)          │   ║
    ║  │ • rejected_candidates (with reasons)                                │   ║
    ║  │ • selection_summary                                                 │   ║
    ║  └─────────────────────────────────────────────────────────────────────┘   ║
    ║                                                                           ║
    ╚═══════════════════════════════════════════════════════════════════════════╝
    """
    print(f"\n{'='*60}")
    print(f"🚀 RECRUITER WORKFLOW STARTED")
    print(f"{'='*60}")
    print(f"📋 Job: {job_title}")
    print(f"👥 Positions: {number_of_positions}")
    print(f"📁 CVs received: {len(cvs)}")
    print(f"{'='*60}\n")

    uploaded_applications = []
    successful = 0
    failed = 0

    for file in cvs:
        try:
            file_ext = validate_file_extension(file, settings.allowed_extensions_set)
            content = await file.read()
            validate_file_size(content, settings.MAX_FILE_SIZE)

            with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
                tmp.write(content)
                tmp_path = tmp.name

            try:
                if file_ext == '.pdf':
                    text = read_pdf(tmp_path)
                else:
                    text = f"[{file_ext} files not yet supported]"

                try:
                    validate_text_content(text)
                except HTTPException:
                    print(f"⚠️ {file.filename}: Could not extract sufficient text")
                    failed += 1
                    continue

                parsed_data = parse_cv_with_ai(text)
                candidate_name = parsed_data.get("candidate_info", {}).get("name", "Unknown")

                cv_record = {
                    "user_id": current_user["id"],
                    "user_role": current_user.get("role", "recruiter"),
                    "filename": file.filename,
                    "raw_text": text[:5000],
                    "parsed_data": parsed_data,
                    "source": "recruiter_hiring_workflow",
                    "job_title": job_title,
                    "status": "analyzed"
                }

                cv_id = await save_recruiter_application(cv_record)

                uploaded_applications.append({
                    "id": cv_id,
                    "filename": file.filename,
                    "parsed_data": parsed_data
                })
                successful += 1
                print(f"✅ Processed: {candidate_name} ({file.filename})")

            finally:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)

        except Exception as e:
            print(f"❌ {file.filename}: {str(e)}")
            failed += 1

    print(f"\n📊 Upload Summary: {successful} successful, {failed} failed\n")

    if not uploaded_applications:
        return {
            "success": False,
            "message": "No CVs could be processed. Please check file formats (PDF only).",
            "job_title": job_title,
            "upload_summary": {
                "total_files": len(cvs),
                "successful": 0,
                "failed": failed
            }
        }

    print(f"🔄 Running hiring pipeline...")

    from datetime import datetime
    
    result = run_hiring_pipeline(
        job_title=job_title,
        number_of_positions=number_of_positions,
        job_requirements=job_requirements,
        candidates=uploaded_applications
    )

    result["success"] = True
    result["upload_summary"] = {
        "total_files": len(cvs),
        "successful": successful,
        "failed": failed
    }
    result["message"] = f"Hiring workflow completed! {successful} CVs analyzed, {result['selection_summary']['approved_count']} approved for interview."

    session_data = {
        "user_id": current_user["id"],
        "user_role": current_user.get("role", "recruiter"),
        "job_title": job_title,
        "number_of_positions": number_of_positions,
        "job_requirements": job_requirements,
        "job_summary": result.get("job_summary", {}),
        "selection_summary": result.get("selection_summary", {}),
        "approved_candidates": result.get("approved_candidates", []),
        "rejected_candidates": result.get("rejected_candidates", []),
        "hiring_recommendations": result.get("hiring_recommendations", []),
        "upload_summary": result["upload_summary"],
        "created_at": datetime.utcnow().isoformat()
    }
    
    try:
        session_id = await save_hiring_session(session_data)
        result["session_id"] = session_id
        print(f"💾 Session saved with ID: {session_id}")
    except Exception as e:
        print(f"⚠️ Could not save session: {e}")

    print(f"\n{'='*60}")
    print(f"✅ WORKFLOW COMPLETE")
    print(f"   Approved: {result['selection_summary']['approved_count']}")
    print(f"   Rejected: {result['selection_summary']['rejected_count']}")
    print(f"{'='*60}\n")

    return result

# ============ APPLICATION MANAGEMENT ============

@router.get("/applications")
async def list_recruiter_applications(current_user: dict = Depends(require_role("recruiter"))):
    """List only the authenticated user's uploaded CVs from recruiter sessions."""
    try:
        applications = await get_user_recruiter_applications(current_user["id"])
        return {
            "success": True,
            "count": len(applications),
            "applications": [
                {
                    "id": app.get("id"),
                    "filename": app.get("filename"),
                    "candidate_name": app.get("parsed_data", {}).get("candidate_info", {}).get("name", "Unknown"),
                    "skills": app.get("parsed_data", {}).get("skills", []),
                    "experience_years": app.get("parsed_data", {}).get("experience_years", 0),
                    "job_title": app.get("job_title"),
                    "status": app.get("status")
                }
                for app in applications
            ]
        }
    except Exception as e:
        print(f"⚠️ Database error: {e}")
        return {
            "success": True,
            "count": 0,
            "applications": [],
            "warning": "Database not connected"
        }

@router.delete("/applications")
async def clear_all_applications(current_user: dict = Depends(get_current_user)):
    """Clear all recruiter applications (start fresh). Requires authentication."""
    try:
        count = await clear_all_recruiter_applications()
        return {
            "success": True,
            "message": f"Cleared {count} applications",
            "deleted_count": count
        }
    except Exception as e:
        print(f"❌ Error clearing applications: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============ JOB MANAGEMENT ============

@router.get("/jobs")
async def list_jobs(current_user: dict = Depends(require_role("recruiter"))):
    """List only the authenticated user's saved job postings."""
    try:
        jobs = await get_user_jobs(current_user["id"])
        return {
            "success": True,
            "jobs": jobs,
            "count": len(jobs)
        }
    except Exception as e:
        print(f"⚠️ Database error: {e}")
        return {
            "success": True,
            "jobs": [],
            "count": 0,
            "warning": "Database not connected"
        }

@router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Get a specific job posting by ID."""
    try:
        job = await get_job_by_id(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"success": True, "job": job}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/jobs/{job_id}")
async def update_job_posting(job_id: str, job_data: dict, current_user: dict = Depends(get_current_user)):
    """Update a job posting. Requires authentication."""
    try:
        existing = await get_job_by_id(job_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Job not found")
        
        updated = await update_job(job_id, job_data)
        if updated:
            return {
                "success": True,
                "message": "Job updated successfully",
                "job_id": job_id
            }
        else:
            return {
                "success": True,
                "message": "No changes made",
                "job_id": job_id
            }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/jobs/{job_id}")
async def delete_job_posting(job_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a job posting. Requires authentication."""
    try:
        deleted = await delete_job(job_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Job not found")
        return {
            "success": True,
            "message": "Job deleted successfully",
            "job_id": job_id
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============ HIRING SESSIONS (Complete Workflow History) ============

@router.get("/sessions")
async def list_hiring_sessions(current_user: dict = Depends(require_role("recruiter"))):
    """List only the authenticated user's hiring sessions with complete results."""
    try:
        sessions = await get_user_hiring_sessions(current_user["id"])
        return {
            "success": True,
            "count": len(sessions),
            "sessions": [
                {
                    "id": s.get("id"),
                    "job_title": s.get("job_title"),
                    "number_of_positions": s.get("number_of_positions"),
                    "created_at": s.get("created_at"),
                    "approved_count": s.get("selection_summary", {}).get("approved_count", 0),
                    "rejected_count": s.get("selection_summary", {}).get("rejected_count", 0),
                    "total_candidates": s.get("upload_summary", {}).get("successful", 0)
                }
                for s in sessions
            ]
        }
    except Exception as e:
        print(f"⚠️ Database error: {e}")
        return {
            "success": True,
            "sessions": [],
            "count": 0,
            "warning": "Database not connected"
        }

@router.get("/sessions/{session_id}")
async def get_hiring_session(session_id: str):
    """Get a complete hiring session with all results."""
    try:
        session = await get_hiring_session_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"success": True, "session": session}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/sessions/{session_id}")
async def delete_hiring_session_endpoint(session_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a hiring session. Requires authentication."""
    try:
        deleted = await delete_hiring_session(session_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Session not found")
        return {
            "success": True,
            "message": "Session deleted successfully",
            "session_id": session_id
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/sessions")
async def clear_all_sessions(current_user: dict = Depends(get_current_user)):
    """Clear all hiring sessions. Requires authentication."""
    try:
        count = await clear_all_hiring_sessions()
        return {
            "success": True,
            "message": f"Cleared {count} sessions",
            "deleted_count": count
        }
    except Exception as e:
        print(f"❌ Error clearing sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/sessions/{session_id}/notes")
async def update_session_notes(
    session_id: str,
    notes_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Add or update notes on a hiring session or specific candidate."""
    from config.database import get_hiring_session_by_id, update_hiring_session_notes
    from bson.objectid import ObjectId

    session = await get_hiring_session_by_id(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        await update_hiring_session_notes(session_id, notes_data)
        return {"success": True, "message": "Notes saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save notes: {str(e)}")
