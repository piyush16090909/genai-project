import os
try:
    from mistralai import Mistral
except ImportError:
    from mistralai.client import Mistral
from prompts.prompts import INTERVIEW_PROMPT, EVALUATION_PROMPT, FINAL_PROMPT

client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
MODEL = "mistral-large-2512"

def generate_question(history, resume_data):
    prompt = INTERVIEW_PROMPT.format(
        history=history,
        skills=resume_data.get("skills", []),
        projects=resume_data.get("projects", []),
        tech_stack=resume_data.get("tech_stack", [])
    )

    response = client.chat.complete(
        model=MODEL,
        messages=[
            {"role": "system", "content": prompt}
        ]
    )

    return response.choices[0].message.content

def evaluate_answer(question, answer):
    prompt = EVALUATION_PROMPT.format(
        question=question,
        answer=answer
    )

    response = client.chat.complete(
        model=MODEL,
        messages=[
            {"role": "system", "content": prompt}
        ]
    )

    return response.choices[0].message.content
