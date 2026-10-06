def generate_question(resume_context: str = "") -> str:
    if resume_context:
        return "Tell me about one project or technical skill mentioned in your resume."

    return "Tell me about yourself and your technical background."


def evaluate_answer(question: str, answer: str) -> dict:
    if not answer.strip():
        return {
            "score": 0.0,
            "feedback": "No answer was provided."
        }

    word_count = len(answer.split())

    if word_count < 10:
        return {
            "score": 5.0,
            "feedback": "The answer is understandable but needs more detail and examples."
        }

    return {
        "score": 8.0,
        "feedback": "Good answer. Add specific examples and measurable results for a stronger response."
    }


def generate_followup(question: str, answer: str) -> str:
    return "Can you explain that further and give a specific example?"


def generate_final_report(scores: list[float]) -> dict:
    if not scores:
        overall = 0.0
    else:
        overall = round(sum(scores) / len(scores), 2)

    return {
        "overall_score": overall,
        "technical_score": overall,
        "communication_score": overall,
        "problem_solving_score": overall,
        "confidence_score": overall,
        "strengths": [
            "Completed the interview responses."
        ],
        "improvements": [
            "Provide more specific examples and measurable outcomes."
        ],
        "suggestions": [
            "Use a structured answer format such as STAR when appropriate."
        ]
    }