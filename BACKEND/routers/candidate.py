import os
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services.extractor import read_pdf
from services.agent import parse_cv_with_ai
from config.database import save_cv

router = APIRouter(prefix="/candidate", tags=["Candidate"])

ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file: UploadFile):
    """Validate uploaded file."""
    file_ext = Path(file.filename).suffix.lower()

    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    return file_ext

@router.post("/analyze")
async def analyze_cv(file: UploadFile = File(...)):
    """
    Upload and analyze a CV using AI.
    """
    print(f"📥 Upload received: {file.filename}")

    try:
        # 1. Validate file
        file_ext = validate_file(file)
        content = await file.read()

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB"
            )

        # 2. Save temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        try:
            # 3. Extract text
            if file_ext == '.pdf':
                text = read_pdf(tmp_path)
            else:
                # For Word docs, you'd need python-docx
                text = f"[{file_ext} files not yet supported for text extraction]"

            if not text:
                raise HTTPException(status_code=400, detail="Could not extract text from file")

            # 4. Parse with AI
            parsed_data = parse_cv_with_ai(text)

            # 5. Save to database
            cv_record = {
                "filename": file.filename,
                "raw_text": text[:5000],  # Limit stored text
                "parsed_data": parsed_data,
                "status": "analyzed"
            }

            try:
                cv_id = await save_cv(cv_record)
                parsed_data["cv_id"] = cv_id
            except Exception as e:
                print(f"⚠️ Database save failed (continuing): {e}")
                parsed_data["cv_id"] = None

            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "CV analyzed successfully",
                    "data": parsed_data
                }
            )

        finally:
            # Cleanup temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_cvs():
    """List all analyzed CVs."""
    from config.database import get_all_cvs
    try:
        cvs = await get_all_cvs()
        return {"success": True, "cvs": cvs}
    except Exception as e:
        print(f"⚠️ Database error: {e}")
        return {"success": True, "cvs": [], "warning": "Database not connected"}

@router.get("/{cv_id}")
async def get_cv(cv_id: str):
    """Get a specific CV by ID."""
    from config.database import get_cv_by_id
    try:
        cv = await get_cv_by_id(cv_id)
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")
        return {"success": True, "cv": cv}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{cv_id}")
async def delete_cv(cv_id: str):
    """Delete a CV by ID."""
    from config.database import delete_cv_by_id
    try:
        deleted = await delete_cv_by_id(cv_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="CV not found")
        return {"success": True, "message": "CV deleted successfully", "cv_id": cv_id}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))