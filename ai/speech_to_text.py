from pathlib import Path
from google import genai
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
def text_to_speech(text, output_file="question_audio.wav"):
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=text,
        config={
            "response_modalities": ["AUDIO"],
            "speech_config": {
                "voice_config": {
                    "prebuilt_voice_config": {
                        "voice_name": "Kore"
                    }
                }
            }
        }
    )
    audio_data = response.candidates[0].content.parts[0].inline_data.data
    output_path = Path(output_file)
    output_path.write_bytes(audio_data)
    return str(output_path)
if __name__ == "__main__":
    test_question = "What is inheritance in Java?"
    audio_file = text_to_speech(
        text=test_question,
        output_file="question_audio.wav"
    )
    print("Audio generated successfully.")
    print("File:", audio_file)