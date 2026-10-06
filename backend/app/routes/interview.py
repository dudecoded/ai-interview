import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Answer, Interview, Resume, Result, User
from ..security import get_current_user
from ..services.ai_service import (
    evaluate_answer,
    generate_final_report,
    generate_followup,
    generate_question,
)

router = APIRouter(prefix="/interview", tags=["Interview"])


@router.post("/start")
def start_interview(
    resume_id: int | None = None,
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

    resume = None
    resume_context = ""

    if resume_id:
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == current_user_id
        ).first()

        if not resume:
            raise HTTPException(
                status_code=404,
                detail="Resume not found"
            )

        resume_context = resume.raw_text or ""

    interview = Interview(
        user_id=current_user_id,
        resume_id=resume_id,
        status="started"
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    question = generate_question(resume_context)

    return {
        "interview_id": interview.id,
        "status": interview.status,
        "question": question
    }


@router.post("/answer")
def submit_answer(
    interview_id: int,
    question: str,
    answer_text: str,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user_id
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if interview.status != "started":
        raise HTTPException(
            status_code=400,
            detail="Interview is not active"
        )

    evaluation = evaluate_answer(
        question,
        answer_text
    )

    answer = Answer(
        interview_id=interview.id,
        question=question,
        answer_text=answer_text,
        score=evaluation["score"],
        feedback=evaluation["feedback"]
    )

    db.add(answer)
    db.commit()
    db.refresh(answer)

    next_question = generate_followup(
        question,
        answer_text
    )

    return {
        "answer_id": answer.id,
        "score": answer.score,
        "feedback": answer.feedback,
        "next_question": next_question
    }


@router.post("/{interview_id}/finish")
def finish_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if interview.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Interview already completed"
        )

    answers = db.query(Answer).filter(
        Answer.interview_id == interview_id
    ).all()

    scores = [
        answer.score
        for answer in answers
        if answer.score is not None
    ]

    report = generate_final_report(scores)

    interview.status = "completed"
    interview.ended_at = datetime.utcnow()

    if interview.started_at:
        interview.duration = int(
            (
                interview.ended_at -
                interview.started_at
            ).total_seconds()
        )

    result = Result(
        interview_id=interview.id,
        overall_score=report["overall_score"],
        technical_score=report["technical_score"],
        communication_score=report["communication_score"],
        problem_solving_score=report["problem_solving_score"],
        confidence_score=report["confidence_score"],
        strengths=json.dumps(report["strengths"]),
        improvements=json.dumps(report["improvements"]),
        suggestions=json.dumps(report["suggestions"])
    )

    db.add(result)
    db.commit()

    return {
        "message": "Interview completed successfully",
        "interview_id": interview.id,
        "result": report
    }


@router.get("/{interview_id}/result")
def get_result(
    interview_id: int,
    db: Session = Depends(get_db)
):
    result = db.query(Result).filter(
        Result.interview_id == interview_id
    ).first()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found"
        )

    return {
        "interview_id": interview_id,
        "overall_score": result.overall_score,
        "technical_score": result.technical_score,
        "communication_score": result.communication_score,
        "problem_solving_score": result.problem_solving_score,
        "confidence_score": result.confidence_score,
        "strengths": json.loads(
            result.strengths or "[]"
        ),
        "improvements": json.loads(
            result.improvements or "[]"
        ),
        "suggestions": json.loads(
            result.suggestions or "[]"
        )
    }
