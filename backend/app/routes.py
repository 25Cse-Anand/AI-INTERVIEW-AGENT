from fastapi import APIRouter
from pydantic import BaseModel

from app.interview import interview_engine

router = APIRouter()


class StartInterviewRequest(BaseModel):
    candidate_name: str
    interview_type: str
    total_questions: int = 10


class AnswerRequest(BaseModel):
    answer: str


@router.get("/")
def api_status():
    return {
        "status": "AI Interview API Running"
    }


@router.post("/start")
def start_interview(request: StartInterviewRequest):
    return interview_engine.start_interview(
        candidate_name=request.candidate_name,
        interview_type=request.interview_type,
        total_questions=request.total_questions,
    )


@router.post("/answer")
def answer_question(request: AnswerRequest):
    return interview_engine.answer_question(
        answer=request.answer,
    )