import json

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Resume, User
from ..security import get_current_user
from ..services.resume_service import extract_profile, extract_text

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        text = extract_text(file.filename, file_bytes)
        profile = extract_profile(text)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not process resume: {exc}"
        ) from exc

    resume = Resume(
        user_id=current_user_id,
        filename=file.filename,
        raw_text=text,
        skills=json.dumps(profile["skills"])
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume.id,
        "filename": resume.filename,
        "skills": profile["skills"]
    }