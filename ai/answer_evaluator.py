import os
import json
from google import genai
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
def evaluate_answer(question, answer):
    prompt = f"""
You are an expert technical interviewer.
Interview Question:
{question}
Candidate Answer:
{answer}
Evaluate the candidate's answer.
Return ONLY valid JSON in this exact format:
{{
    "score": 0,
    "status": "correct",
    "technical_accuracy": 0,
    "completeness": 0,
    "feedback": "",
    "missing_concepts": []
}}
Rules:

- score must be between 0 and 10.
- technical_accuracy must be between 0 and 10.
- completeness must be between 0 and 10.
- status must be one of:
  "correct", "partially_correct", "incorrect".
- feedback should briefly explain the quality of the answer.
- missing_concepts should contain concepts the candidate should have mentioned.
- Do not provide a model answer.
- Return ONLY JSON.
"""
    response = client.interactions.create(
       model="gemini-3.5-flash-lite",
        input=prompt
    )
    result = response.output_text.strip()
    try:
        evaluation = json.loads(result)
        return evaluation
    except json.JSONDecodeError:
        return {
            "score": 0,
            "status": "error",
            "technical_accuracy": 0,
            "completeness": 0,
            "feedback": "Unable to evaluate the answer.",
            "missing_concepts": []
        }
if __name__ == "__main__":
    test_question = "What is inheritance in Java?"
    test_answer = """
    Inheritance allows a child class to acquire
    properties and methods from a parent class.
    """
    evaluation = evaluate_answer(
        question=test_question,
        answer=test_answer
    )
    print(json.dumps(evaluation, indent=4))