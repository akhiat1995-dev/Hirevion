import os
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from services.extractor import read_pdf
from services.agent import parse_cv_with_ai
from services.skill_gap import analyze_skill_gap
from config.database import save_cv
from config.settings import settings
from utils.validators import validate_file_extension, validate_file_size, validate_text_content
from utils.response import success_response, error_response
from middleware.auth import get_current_user, require_role

router = APIRouter(prefix="/candidate", tags=["Candidate"])

@router.post("/analyze")
async def analyze_cv(file: UploadFile = File(...), current_user: dict = Depends(require_role("user", "recruiter"))):
    """
    Upload and analyze a CV using AI. Requires authentication.
    """
    print(f"📥 Upload received: {file.filename} by user {current_user['id']}")

    try:
        # 1. Validate file
        file_ext = validate_file_extension(file, settings.allowed_extensions_set)
        content = await file.read()
        validate_file_size(content, settings.MAX_FILE_SIZE)

        # 2. Save temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        try:
            # 3. Extract text
            if file_ext == '.pdf':
                text = read_pdf(tmp_path)
            else:
                text = f"[{file_ext} files not yet supported for text extraction]"

            validate_text_content(text)

            # 4. Parse with AI
            parsed_data = parse_cv_with_ai(text)

            # 5. Save to database WITH user_id
            cv_record = {
                "user_id": current_user["id"],
                "user_role": current_user.get("role", "user"),
                "filename": file.filename,
                "raw_text": text[:5000],
                "parsed_data": parsed_data,
                "status": "analyzed"
            }

            try:
                cv_id = await save_cv(cv_record)
                parsed_data["cv_id"] = cv_id
                
                # Add skill gap analysis
                skills = parsed_data.get("skills", [])
                score = parsed_data.get("analysis", {}).get("overall_score", 0)
                exp_years = parsed_data.get("experience_years", 0)
                parsed_data["skill_gap"] = analyze_skill_gap(skills, score, exp_years)
            except Exception as e:
                print(f"⚠️ Database save failed (continuing): {e}")
                parsed_data["cv_id"] = None

            return success_response(
                message="CV analyzed successfully",
                data=parsed_data
            )

        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_cvs(current_user: dict = Depends(require_role("user", "recruiter"))):
    """List only the authenticated user's analyzed CVs."""
    from config.database import get_user_cvs
    try:
        cvs = await get_user_cvs(current_user["id"])
        return {"success": True, "cvs": cvs}
    except Exception as e:
        print(f"⚠️ Database error: {e}")
        return {"success": True, "cvs": [], "warning": "Database not connected"}

@router.get("/{cv_id}")
async def get_cv(cv_id: str, current_user: dict = Depends(require_role("user", "recruiter"))):
    """Get a specific CV by ID. Only if it belongs to the authenticated user."""
    from config.database import get_cv_by_id
    try:
        cv = await get_cv_by_id(cv_id)
        if not cv or cv.get("user_id") != current_user["id"]:
            raise HTTPException(status_code=404, detail="CV not found")
        return {"success": True, "cv": cv}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{cv_id}")
async def delete_cv(cv_id: str, current_user: dict = Depends(require_role("user", "recruiter"))):
    """Delete a CV by ID. Only if it belongs to the authenticated user."""
    from config.database import delete_cv_by_id, get_cv_by_id
    try:
        cv = await get_cv_by_id(cv_id)
        if not cv or cv.get("user_id") != current_user["id"]:
            raise HTTPException(status_code=404, detail="CV not found")
        deleted = await delete_cv_by_id(cv_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="CV not found")
        return {"success": True, "message": "CV deleted successfully", "cv_id": cv_id}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{cv_id}/skill-gap")
async def get_cv_skill_gap(cv_id: str, current_user: dict = Depends(require_role("user", "recruiter"))):
    """Get skill gap analysis for a specific CV."""
    from config.database import get_cv_by_id
    try:
        cv = await get_cv_by_id(cv_id)
        if not cv or cv.get("user_id") != current_user["id"]:
            raise HTTPException(status_code=404, detail="CV not found")
        
        parsed = cv.get("parsed_data", {})
        skills = parsed.get("skills", [])
        score = parsed.get("analysis", {}).get("overall_score", 0)
        exp_years = parsed.get("experience_years", 0)
        
        gap_analysis = analyze_skill_gap(skills, score, exp_years)
        return {"success": True, "skill_gap": gap_analysis}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error analyzing skill gap: {e}")
        raise HTTPException(status_code=500, detail=str(e))