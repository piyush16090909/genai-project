import os
import json
try:
    from mistralai import Mistral
except ImportError:
    from mistralai.client import Mistral

client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))

MODEL = "mistral-large-2512"


def extract_resume_data(resume_text):
    prompt = f"""
Extract structured data from this resume.

Return JSON:
{{
  "skills": [],
  "projects": [],
  "tech_stack": []
}}

Resume:
{resume_text}
"""

    response = client.chat.complete(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.choices[0].message.content

    if isinstance(raw, dict):
        return raw

    if not isinstance(raw, str):
        return {"skills": [], "projects": [], "tech_stack": []}

    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass

    return {"skills": [], "projects": [], "tech_stack": []}