import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if GEMINI_API_KEY:
    from google import genai
    client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_ID = "gemini-2.0-flash"


def analyze_complaint(title: str, description: str):
    if not client:
        return {"category": "Diğer", "priority": "medium", "summary": "AI kapalı.", "suggestion": "AI kapalı olduğundan çözüm önerisi sunulamıyor."}

    prompt = f"""
Lütfen aşağıdaki apartman/site şikayetini analiz et.
Bana sadece geçerli bir JSON objesi dön. JSON dışında hiçbir metin yazma.
İstenen format:
{{
  "category": "Teknik" | "Güvenlik" | "Temizlik" | "Diğer",
  "priority": "low" | "medium" | "high",
  "summary": "1-2 cümlelik kısa şikayet özeti",
  "suggestion": "Yönetici için bu şikayeti çözmeye yönelik 1-2 cümlelik çözüm önerisi"
}}

Şikayet Başlığı: {title}
Şikayet Detayı: {description}
"""
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        text = (response.text or "").strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()

        return json.loads(text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {"category": "Diğer", "priority": "medium", "summary": "AI analizi yapılamadı.", "suggestion": "Öneri oluşturulamadı."}


def summarize_announcement(content: str):
    if not client:
        return "AI kapalı."

    prompt = f"""
Aşağıdaki apartman duyurusunu site sakinleri için çok kısa ve net bir şekilde (maksimum 1-2 cümle) özetle.
Duyuru: {content}
"""
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        return (response.text or "").strip()
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "Özet oluşturulamadı."

def generate_insights(complaints_data: str):
    if not client:
        return {
            "summary": "AI kapalı, özet gösterilemiyor.",
            "repeating_issues": [],
            "suggestions": []
        }

    prompt = f"""
Sen bir apartman yöneticisi asistanısın. Aşağıdaki son şikayet verilerini incele.
Yöneticiye JSON formatında bir rapor sun. Sadece JSON dön, başka bir şey yazma.
İstenen format:
{{
  "summary": "Genel durumun 1-2 cümlelik özeti",
  "repeating_issues": ["Tekrar eden sorun 1", "Tekrar eden sorun 2"],
  "suggestions": ["Çözüm önerisi 1", "Çözüm önerisi 2"]
}}

Şikayetler:
{complaints_data}
"""
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        text = (response.text or "").strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()

        return json.loads(text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {
            "summary": "Analiz başarısız.",
            "repeating_issues": [],
            "suggestions": []
        }
