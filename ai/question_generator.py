from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=api_key)


def generate_question(
    skills,
    question_number,
    role="Software Developer",
    experience_level="Beginner",
    difficulty="Medium",
    duration_minutes=30,
    previous_question=None,
    previous_answer=None,
):
    skills_text = ", ".join(skills) if skills else "General programming"

    prompt = f"""
You are a professional technical interviewer.

INTERVIEW CONFIGURATION
Target role: {role}
Candidate experience level: {experience_level}
Requested difficulty: {difficulty}
Total interview time: {duration_minutes} minutes

CANDIDATE SKILLS
{skills_text}

QUESTION NUMBER
{question_number}

STRICT RULES
1. Ask questions primarily relevant to the selected target role.
2. Use resume skills only when they are relevant to that role.
3. Do not switch to another role merely because the resume lists
   skills from multiple domains.
4. Match the requested experience level and difficulty.
5. Ask exactly ONE interview question.
6. Do not provide the answer or any explanation.
7. Keep the question concise and suitable for the available
   interview time.
"""

    if question_number > 1:
        prompt += f"""

PREVIOUS QUESTION
{previous_question}

CANDIDATE'S PREVIOUS ANSWER
{previous_answer}

FOLLOW-UP RULES
- If the answer is correct, probe deeper within the selected role.
- If partially correct, test the missing concept.
- If incorrect, simplify the question while staying on-role.
- Maintain the requested experience level and difficulty.
"""

    response = client.interactions.create(
        model="gemini-3.5-flash-lite",
        input=prompt,
    )

    return response.output_text.strip()


if __name__ == "__main__":
    question = generate_question(
        skills=["React", "Python", "FastAPI", "SQL"],
        question_number=1,
        role="Backend Developer",
        experience_level="Intermediate",
        difficulty="Medium",
        duration_minutes=2,
    )

    print("\nAI Interviewer:")
    print(question)