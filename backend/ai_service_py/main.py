import os
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_mistralai import ChatMistralAI


ENV_PATH = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(ENV_PATH)

app = FastAPI(title="AI Service", version="1.0.0")


class InterviewReportRequest(BaseModel):
    resume: str
    selfDescription: str
    jobDescription: str
    roadmapDays: Optional[int] = None


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


def _coerce_roadmap_length(plan: List[PreparationPlanDay], target_days: int) -> List[PreparationPlanDay]:
    if target_days <= 0:
        return []

    normalized = list(plan)
    if len(normalized) > target_days:
        normalized = normalized[:target_days]
    elif len(normalized) < target_days:
        for i in range(len(normalized) + 1, target_days + 1):
            normalized.append(
                PreparationPlanDay(
                    day=i,
                    focus="Additional preparation",
                    tasks=[
                        "Review key gaps from earlier days.",
                        "Practice 2-3 mixed problems or questions.",
                        "Summarize takeaways and plan next steps."
                    ]
                )
            )

    for index, entry in enumerate(normalized, start=1):
        entry.day = index

    return normalized


class ResumeHtmlRequest(BaseModel):
    resume: str
    selfDescription: str
    jobDescription: str
    templateType: Optional[str] = None
    templateText: Optional[str] = None


class ResumeHtmlResponse(BaseModel):
    html: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    reply: str


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
    roadmap_line = (
        "Return an empty preparationPlan list.\n"
        if not payload.roadmapDays
        else (
            "The preparationPlan must contain exactly "
            f"{payload.roadmapDays} days, numbered 1..{payload.roadmapDays}.\n"
        )
    )
    base_prompt = (
        "Generate an interview report for a candidate with the following details:\n"
        f"Resume: {payload.resume}\n"
        f"Self Description: {payload.selfDescription}\n"
        f"Job Description: {payload.jobDescription}\n"
        f"{roadmap_line}"
    )

    try:
        llm = get_llm()
        chain = llm.with_structured_output(InterviewReport)
        result = chain.invoke(base_prompt)

        if payload.roadmapDays and len(result.preparationPlan) != payload.roadmapDays:
            retry_prompt = (
                base_prompt
                + "You returned an incorrect number of days. "
                + "Return exactly the requested number of days.\n"
            )
            result = chain.invoke(retry_prompt)

        if payload.roadmapDays:
            result.preparationPlan = _coerce_roadmap_length(
                result.preparationPlan,
                payload.roadmapDays
            )

        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/resume-html", response_model=ResumeHtmlResponse)
def resume_html(payload: ResumeHtmlRequest) -> ResumeHtmlResponse:
    template_line = ""
    if payload.templateType:
        template_line = f"Template style: {payload.templateType}\n"
    if payload.templateText:
        template_line += (
            "Template reference (structure and tone to follow):\n"
            f"{payload.templateText}\n"
        )
    prompt = (
        "Generate resume for a candidate with the following details:\n"
        f"Resume: {payload.resume}\n"
        f"Self Description: {payload.selfDescription}\n"
        f"Job Description: {payload.jobDescription}\n\n"
        f"{template_line}"
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


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    try:
        llm = get_llm()
        messages = []

        if payload.context:
            title = payload.context.get("title", "")
            resume = payload.context.get("resume", "")
            self_description = payload.context.get("selfDescription", "")
            job_description = payload.context.get("jobDescription", "")
            system_prompt = (
                "You are a career interview assistant. Use the candidate information below to answer. "
                "If a question is outside this data, respond with a gentle message saying it is out of scope "
                "and invite the user to ask something related to their resume, self description, or job description.\n"
                f"Role Title: {title}\n"
                f"Resume: {resume}\n"
                f"Self Description: {self_description}\n"
                f"Job Description: {job_description}\n"
            )
            messages.append(SystemMessage(content=system_prompt))

        if payload.history:
            for item in payload.history:
                if item.role == "system":
                    messages.append(SystemMessage(content=item.content))
                elif item.role == "assistant":
                    messages.append(AIMessage(content=item.content))
                else:
                    messages.append(HumanMessage(content=item.content))

        messages.append(HumanMessage(content=payload.message))
        result = llm.invoke(messages)

        return ChatResponse(reply=result.content)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
