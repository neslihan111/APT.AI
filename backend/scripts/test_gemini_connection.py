import os
import sys
from dotenv import load_dotenv

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Load dotenv explicitly
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("GEMINI_API_KEY exists in env:", bool(GEMINI_API_KEY))
if GEMINI_API_KEY:
    print("GEMINI_API_KEY length:", len(GEMINI_API_KEY))
    print("GEMINI_API_KEY prefix:", GEMINI_API_KEY[:8])

try:
    from google import genai
    print("Successfully imported google.genai")
except Exception as e:
    print("Failed to import google.genai:", e)
    sys.exit(1)

models_to_test = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-flash"]
for model_id in models_to_test:
    print(f"\nTesting connection with model: {model_id}")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model=model_id,
            contents="Merhaba, kendini kısa tanıtır mısın?"
        )
        print(f"[{model_id}] Response successful!")
        print("Response text:", response.text)
    except Exception as e:
        print(f"[{model_id}] Connection failed!")
        print("Exception type:", type(e).__name__)
        print("Exception message:", e)
        if hasattr(e, "code"):
            print("Code:", e.code)

