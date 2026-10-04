from dotenv import load_dotenv
from google import genai
import os
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
keywords=["Java","Python","OOP","DSA","SQL"]
prompt=f"""
You are a technical interviewer.
The candidate has these skills:
{keywords} 
Generate 5 technical interview questions based on these skills.
Start with easy questions and gradually increase the difficulty.
Return only the questions.
"""
response = client.interactions.create(
    model="gemini-3.8-flash",
    input=prompt
)
print(response.output_text)