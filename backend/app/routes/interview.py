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
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    skills = []

    if resume_id:
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == current_user_id,
        ).first()

        if not resume:
            raise HTTPException(
                status_code=404,
                detail="Resume not found",
            )

        try:
            skills = json.loads(resume.skills or "[]")
        except json.JSONDecodeError:
            skills = []

    interview = Interview(
        user_id=current_user_id,
        resume_id=resume_id,
        status="started",
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    question = generate_question(
        skills=skills,
        question_number=1,
    )

    return {
        "interview_id": interview.id,
        "status": interview.status,
        "question_number": 1,
        "question": question,
    }


@router.post("/answer")
def submit_answer(
    interview_id: int,
    question: str,
    answer_text: str,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user_id,
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    if interview.status != "started":
        raise HTTPException(
            status_code=400,
            detail="Interview is not active",
        )

    if not question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )

    if not answer_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty",
        )

    evaluation = evaluate_answer(
        question,
        answer_text,
    )

    answer = Answer(
        interview_id=interview.id,
        question=question,
        answer_text=answer_text,
        score=evaluation.get("score", 0),
        feedback=evaluation.get("feedback", ""),
    )

    db.add(answer)
    db.commit()
    db.refresh(answer)

    answer_count = db.query(Answer).filter(
        Answer.interview_id == interview.id
    ).count()

    next_question_number = answer_count + 1

    skills = []

    if interview.resume_id:
        resume = db.query(Resume).filter(
            Resume.id == interview.resume_id,
            Resume.user_id == current_user_id,
        ).first()

        if resume:
            try:
                skills = json.loads(
                    resume.skills or "[]"
                )
            except json.JSONDecodeError:
                skills = []

    next_question = None

    if answer_count < 5:
        next_question = generate_followup(
            question=question,
            answer=answer_text,
            skills=skills,
            question_number=next_question_number,
        )

    return {
        "answer_id": answer.id,
        "score": answer.score,
        "status": evaluation.get("status"),
        "technical_accuracy": evaluation.get(
            "technical_accuracy"
        ),
        "completeness": evaluation.get(
            "completeness"
        ),
        "feedback": answer.feedback,
        "missing_concepts": evaluation.get(
            "missing_concepts",
            [],
        ),
        "question_number": answer_count,
        "next_question": next_question,
        "answers_submitted": answer_count,
        "total_questions": 5,
        "interview_complete": answer_count >= 5,
    }


@router.post("/{interview_id}/finish")
def finish_interview(
    interview_id: int,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user_id,
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    if interview.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Interview already completed",
        )

    answers = db.query(Answer).filter(
        Answer.interview_id == interview_id
    ).order_by(
        Answer.id.asc()
    ).all()

    # Exactly five questions are required.
    if len(answers) < 5:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Interview cannot be finished yet. "
                f"Only {len(answers)} of 5 answers "
                f"were submitted."
            ),
        )

    # --------------------------------------------------
    # CALCULATE OVERALL SCORE OUT OF 50
    # --------------------------------------------------
    total_score = sum(
        float(answer.score or 0)
        for answer in answers[:5]
    )

    total_score = round(
        min(total_score, 50),
        1,
    )

    interview_results = []

    for index, answer in enumerate(
        answers[:5],
        start=1,
    ):
        interview_results.append(
            {
                "question_number": index,
                "question": answer.question,
                "answer": answer.answer_text,
                "evaluation": {
                    "score": answer.score,
                    "feedback": answer.feedback,
                },
            }
        )

    # Gemini handles qualitative analysis.
    report = generate_final_report(
        interview_results
    )

    interview.status = "completed"
    interview.ended_at = datetime.utcnow()

    if interview.started_at:
        interview.duration = int(
            (
                interview.ended_at
                - interview.started_at
            ).total_seconds()
        )

    old_result = db.query(Result).filter(
        Result.interview_id == interview.id
    ).first()

    if old_result:
        db.delete(old_result)
        db.flush()

    result = Result(
        interview_id=interview.id,

        # IMPORTANT:
        # Overall score is now 0–50.
        overall_score=total_score,

        # These remain AI category scores out of 10.
        technical_score=report.get(
            "technical_score",
            0,
        ),

        communication_score=report.get(
            "communication_score",
            0,
        ),

        problem_solving_score=report.get(
            "technical_score",
            0,
        ),

        confidence_score=report.get(
            "communication_score",
            0,
        ),

        strengths=json.dumps(
            report.get(
                "strengths",
                [],
            )
        ),

        improvements=json.dumps(
            report.get(
                "weaknesses",
                [],
            )
        ),

        suggestions=json.dumps(
            report.get(
                "topics_to_improve",
                [],
            )
        ),
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return {
        "message": "Interview completed successfully",
        "interview_id": interview.id,
        "answers_submitted": len(answers),
        "overall_score": total_score,
        "maximum_score": 50,
        "result": report,
    }


@router.get("/{interview_id}/result")
def get_result(
    interview_id: int,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.user_id == current_user_id,
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    result = db.query(Result).filter(
        Result.interview_id == interview_id
    ).first()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found",
        )

    answers = db.query(Answer).filter(
        Answer.interview_id == interview_id
    ).order_by(
        Answer.id.asc()
    ).all()

    questions = []

    for index, answer in enumerate(
        answers[:5],
        start=1,
    ):
        questions.append(
            {
                "number": index,
                "question": answer.question,
                "answer": answer.answer_text,
                "score": answer.score,
                "feedback": answer.feedback,
                "category": (
                    "Introduction"
                    if index == 1
                    else "AI Interview"
                ),
            }
        )

    return {
        "interview_id": interview_id,

        # Overall is OUT OF 50.
        "overall_score": result.overall_score,

        "maximum_score": 50,

        # Category scores remain 0–10.
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
        ),

        "questions": questions,

        "answers_submitted": len(answers),
        "total_questions": 5,
    }