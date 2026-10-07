from dotenv import load_dotenv
from google import genai
import os
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
def generate_question(
    skills,
    question_number,
    previous_question=None,
    previous_answer=None
):
    if question_number == 1:
        prompt = f"""
You are a professional technical interviewer.

Candidate skills:
{skills}

This is question 1 of the interview.

Generate ONE easy technical interview question
based on the candidate's skills.

Start with a basic concept.

Return ONLY the question.
Do not provide the answer.
"""
    else:
        prompt = f"""
You are a professional technical interviewer.

Candidate skills:
{skills}

This is question {question_number} of the interview.

Previous question:
{previous_question}

Candidate's previous answer:
{previous_answer}

Generate ONE follow-up technical interview question.

Rules:
- Base the question on the previous answer.
- If the answer is correct, increase the difficulty.
- If the answer is partially correct, test the missing concept.
- If the answer is incorrect, ask a simpler question.
- Keep the question relevant to the candidate's skills.
- Do not give the answer.
- Return ONLY the question.
"""
    response = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )
    return response.output_text.strip()
if __name__ == "__main__":
    skills = ["Java", "Python", "OOP", "DSA", "SQL"]
    question = generate_question(
        skills=skills,
        question_number=1
    )
    print("\nAI Interviewer:")
    print(question)