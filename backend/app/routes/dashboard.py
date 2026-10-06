from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Interview, Resume, Result, User
from ..security import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resume_count = db.query(Resume).filter(
        Resume.user_id == current_user_id
    ).count()

    interview_count = db.query(Interview).filter(
        Interview.user_id == current_user_id
    ).count()

    completed_interviews = db.query(Interview).filter(
        Interview.user_id == current_user_id,
        Interview.status == "completed"
    ).count()

    average_score = (
        db.query(func.avg(Result.overall_score))
        .join(
            Interview,
            Interview.id == Result.interview_id
        )
        .filter(
            Interview.user_id == current_user_id
        )
        .scalar()
    )

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        },
        "resume_count": resume_count,
        "interview_count": interview_count,
        "completed_interviews": completed_interviews,
        "average_score": (
            round(float(average_score), 2)
            if average_score is not None
            else None
        )
    }