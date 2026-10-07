from ai.question_generator import generate_question
from ai.text_to_speech import text_to_speech
from ai.speech_to_text import speech_to_text
from ai.answer_evaluator import evaluate_answer
def process_interview_question(
    skills,
    question_number,
    previous_question=None,
    previous_answer=None,
    candidate_audio=None
):
    question = generate_question(
        skills=skills,
        question_number=question_number,
        previous_question=previous_question,
        previous_answer=previous_answer
    )
    question_audio = text_to_speech(
        text=question,
        output_file=f"question_{question_number}.wav"
    )
    result = {
        "question_number": question_number,
        "question": question,
        "question_audio": question_audio,
        "candidate_answer": None,
        "evaluation": None
    }
    if candidate_audio is not None:
        answer = speech_to_text(
            candidate_audio
        )
        evaluation = evaluate_answer(
            question=question,
            answer=answer
        )
        result["candidate_answer"] = answer
        result["evaluation"] = evaluation
    return result
if __name__ == "__main__":
    skills = [
        "Java",
        "Python",
        "OOP",
        "DSA",
        "SQL"
    ]
    result = process_interview_question(
        skills=skills,
        question_number=1
    )
    print("\nQuestion:")
    print(result["question"])
    print("\nQuestion Audio:")
    print(result["question_audio"])