from ai.question_generator import generate_question
from ai.answer_evaluator import evaluate_answer
def run_interview(skills, answers, total_questions=5):
    interview_results = []
    previous_question = None
    previous_answer = None
    for question_number in range(1, total_questions + 1):
        question = generate_question(
            skills=skills,
            question_number=question_number,
            previous_question=previous_question,
            previous_answer=previous_answer
        )
        if question_number in answers:
            answer = answers[question_number]
            evaluation = evaluate_answer(
                question=question,
                answer=answer
            )
            interview_results.append({
                "question_number": question_number,
                "question": question,
                "answer": answer,
                "evaluation": evaluation
            })
            previous_question = question
            previous_answer = answer
        else:
            interview_results.append({
                "question_number": question_number,
                "question": question,
                "answer": None,
                "evaluation": None
            })
            break
    return interview_results
if __name__ == "__main__":
    skills = [
        "Java",
        "Python",
        "OOP",
        "DSA",
        "SQL"
    ]
    answers = {
        1: """
        Inheritance allows a child class to acquire
        properties and methods from a parent class.
        """
    }
    results = run_interview(
        skills=skills,
        answers=answers,
        total_questions=5
    )
    for result in results:
        print("\nQuestion:")
        print(result["question"])
        if result["answer"] is not None:
            print("\nCandidate Answer:")
            print(result["answer"])
            print("\nEvaluation:")
            print(result["evaluation"])