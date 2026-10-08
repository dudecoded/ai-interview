import json
import os

from google import genai
from dotenv import load_dotenv


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def analyze_performance(interview_results):

    interview_data = json.dumps(
        interview_results,
        indent=4
    )

    prompt = f"""
You are an expert technical interview evaluator.

Analyze the following interview results:

{interview_data}

Generate a final performance report.

Return ONLY valid JSON in this format:

{{
    "overall_score": 0,
    "technical_score": 0,
    "communication_score": 0,
    "strengths": [],
    "weaknesses": [],
    "topics_to_improve": [],
    "overall_feedback": "",
    "recommendation": ""
}}

Rules:

- overall_score must be between 0 and 10.
- technical_score must be between 0 and 10.
- communication_score must be between 0 and 10.
- strengths must contain important strengths.
- weaknesses must contain important weaknesses.
- topics_to_improve must contain technical topics.
- overall_feedback must briefly summarize the interview.
- recommendation should be one of:
  "Strong Candidate",
  "Good Candidate",
  "Needs Improvement",
  "Not Recommended".
- Return ONLY JSON.
"""

    response = client.interactions.create(
     model="gemini-3.5-flash-lite",
        input=prompt
    )

    result = response.output_text.strip()

    try:

        return json.loads(result)

    except json.JSONDecodeError:

        return {
            "overall_score": 0,
            "technical_score": 0,
            "communication_score": 0,
            "strengths": [],
            "weaknesses": [],
            "topics_to_improve": [],
            "overall_feedback": "Unable to generate report.",
            "recommendation": "Needs Improvement"
        }


if __name__ == "__main__":

    test_results = [
        {
            "question_number": 1,
            "question": "What is inheritance in Java?",
            "answer": "Inheritance allows a child class to use properties and methods of a parent class.",
            "evaluation": {
                "score": 8,
                "status": "correct",
                "technical_accuracy": 8,
                "completeness": 7,
                "feedback": "Good basic understanding.",
                "missing_concepts": []
            }
        }
    ]
    report = analyze_performance(test_results)
    print(json.dumps(report, indent=4))