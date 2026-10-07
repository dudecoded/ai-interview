from ai.question_generator import generate_question
from ai.text_to_speech import text_to_speech
from ai.speech_to_text import speech_to_text
from ai.answer_evaluator import evaluate_answer
from ai.performance_analyzer import analyze_performance
from ai.audio_recorder import record_audio


def run_complete_interview(
    skills,
    total_questions=5
):

    results = []

    previous_question = None
    previous_answer = None

    for question_number in range(1, total_questions + 1):

        question = generate_question(
            skills=skills,
            question_number=question_number,
            previous_question=previous_question,
            previous_answer=previous_answer
        )

        print("\n==============================")
        print("Question", question_number)
        print("==============================")

        print("\nAI Interviewer:")
        print(question)

        question_audio = text_to_speech(
            text=question,
            output_file=f"question_{question_number}.wav"
        )

        print(
            "Question audio:",
            question_audio
        )

        input(
            "\nPress ENTER when you are ready to answer..."
        )

        candidate_audio = record_audio(
            output_file=f"candidate_answer_{question_number}.wav",
            duration=10
        )

        answer = speech_to_text(
            candidate_audio
        )

        print("\nCandidate Answer:")
        print(answer)

        evaluation = evaluate_answer(
            question=question,
            answer=answer
        )

        print("\nEvaluation:")
        print(evaluation)

        results.append({
            "question_number": question_number,
            "question": question,
            "question_audio": question_audio,
            "answer": answer,
            "evaluation": evaluation
        })

        previous_question = question
        previous_answer = answer

    print("\nGenerating final report...")

    report = analyze_performance(
        results
    )

    return {
        "interview_results": results,
        "final_report": report
    }


if __name__ == "__main__":

    skills = [
        "Java",
        "Python",
        "OOP",
        "DSA"
    ]

    result = run_complete_interview(
        skills=skills,
        total_questions=5
    )

    print("\n")
    print("================================")
    print("       FINAL INTERVIEW REPORT")
    print("================================")

    print(result["final_report"])