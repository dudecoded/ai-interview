from ai.question_generator import generate_question as ai_generate_question
from ai.answer_evaluator import evaluate_answer as ai_evaluate_answer
from ai.performance_analyzer import analyze_performance


def generate_question(
    resume_context: str = "",
    skills=None,
    question_number: int = 1,
    role: str = "Software Developer",
    experience_level: str = "Beginner",
    difficulty: str = "Medium",
    duration_minutes: int = 30,
    previous_question: str | None = None,
    previous_answer: str | None = None,
) -> str:
    """Generate a question using the selected interview configuration."""

    if skills is None:
        skills = []

    return ai_generate_question(
        skills=skills,
        question_number=question_number,
        role=role,
        experience_level=experience_level,
        difficulty=difficulty,
        duration_minutes=duration_minutes,
        previous_question=previous_question,
        previous_answer=previous_answer,
    )


def evaluate_answer(question: str, answer: str) -> dict:
    """Evaluate a candidate's answer."""

    return ai_evaluate_answer(
        question=question,
        answer=answer,
    )


def generate_followup(
    question: str,
    answer: str,
    skills=None,
    question_number: int = 2,
    role: str = "Software Developer",
    experience_level: str = "Beginner",
    difficulty: str = "Medium",
    duration_minutes: int = 30,
) -> str:
    """Generate an adaptive follow-up within the selected role."""

    if skills is None:
        skills = []

    return ai_generate_question(
        skills=skills,
        question_number=question_number,
        role=role,
        experience_level=experience_level,
        difficulty=difficulty,
        duration_minutes=duration_minutes,
        previous_question=question,
        previous_answer=answer,
    )


def generate_final_report(interview_results: list) -> dict:
    """Generate the final AI performance report."""

    return analyze_performance(interview_results)