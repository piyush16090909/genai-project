import os
from typing import List, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from langchain_mistralai import ChatMistralAI


ENV_PATH = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(ENV_PATH)

app = FastAPI(title="AI Service", version="1.0.0")


class InterviewReportRequest(BaseModel):
    resume: str
    selfDescription: str
    jobDescription: str


class TechnicalQuestion(BaseModel):
    question: str
    intention: str
    answer: str


class BehavioralQuestion(BaseModel):
    question: str
    intention: str
    answer: str


class SkillGap(BaseModel):
    skill: str
    severity: Literal["low", "medium", "high"]


class PreparationPlanDay(BaseModel):
    day: int
    focus: str
    tasks: List[str]


class InterviewReport(BaseModel):
    matchScore: float = Field(ge=0, le=100)
    technicalQuestions: List[TechnicalQuestion]
    behavioralQuestions: List[BehavioralQuestion]
    skillGaps: List[SkillGap]
    preparationPlan: List[PreparationPlanDay]
    title: str


class ResumeHtmlRequest(BaseModel):
    resume: str
    selfDescription: str
    jobDescription: str


class ResumeHtmlResponse(BaseModel):
    html: str


def get_llm() -> ChatMistralAI:
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise RuntimeError("MISTRAL_API_KEY is not set")

    model_name = os.getenv("MISTRAL_MODEL", "mistral-large-2512")
    return ChatMistralAI(api_key=api_key, model=model_name, temperature=0)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/interview-report", response_model=InterviewReport)
def interview_report(payload: InterviewReportRequest) -> InterviewReport:
    prompt = (
        "Generate an interview report for a candidate with the following details:\n"
        f"Resume: {payload.resume}\n"
        f"Self Description: {payload.selfDescription}\n"
        f"Job Description: {payload.jobDescription}\n"
    )

    try:
        llm = get_llm()
        chain = llm.with_structured_output(InterviewReport)
        result = chain.invoke(prompt)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/resume-html", response_model=ResumeHtmlResponse)
def resume_html(payload: ResumeHtmlRequest) -> ResumeHtmlResponse:
    prompt = (
        "Generate resume for a candidate with the following details:\n"
        f"Resume: {payload.resume}\n"
        f"Self Description: {payload.selfDescription}\n"
        f"Job Description: {payload.jobDescription}\n\n"
        "The response should be a JSON object with a single field 'html' containing well-"
        "formatted resume HTML. The resume should be tailored for the job description,"
        " ATS friendly, and 1-2 pages when converted to PDF."
    )

    try:
        llm = get_llm()
        chain = llm.with_structured_output(ResumeHtmlResponse)
        result = chain.invoke(prompt)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
