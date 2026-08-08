import os

from dotenv import load_dotenv
from google import genai

from app.prompts import (
    SYSTEM_PROMPT,
    INTERVIEW_TYPES,
    EVALUATION_PROMPT,
)

from app.memory import memory
from app.utils import safe_generate


# Load environment variables
load_dotenv()


# Get Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from the .env file."
    )


# Create Gemini client
client = genai.Client(
    api_key=GEMINI_API_KEY
)


class InterviewEngine:

    def start_interview(
        self,
        candidate_name: str,
        interview_type: str,
        total_questions: int,
    ):

        memory.configure(
            candidate_name=candidate_name,
            interview_type=interview_type,
            total_questions=total_questions,
        )

        prompt = f"""
{SYSTEM_PROMPT}

Interview Type:

{INTERVIEW_TYPES.get(
    interview_type,
    INTERVIEW_TYPES["technical"]
)}

Candidate Name:
{candidate_name}

Ask ONLY the first interview question.

Return ONLY valid JSON.

{{
    "question": "...",
    "difficulty": "Easy",
    "category": "Introduction"
}}
"""

        result = safe_generate(
            client,
            prompt
        )

        memory.add_ai_message(
            result["question"]
        )

        memory.next_question()

        progress = memory.get_progress()

        return {
            **result,
            **progress,
            "interview_complete": False,
        }


    def answer_question(
        self,
        answer: str,
    ):

        memory.add_candidate_message(answer)

        # --------------------------
        # Interview Finished?
        # --------------------------

        if memory.interview_finished():

            history = memory.get_history()

            prompt = f"""
{EVALUATION_PROMPT}

Conversation

{history}

Return ONLY valid JSON.
"""

            evaluation = safe_generate(
                client,
                prompt
            )

            return {
                "interview_complete": True,
                "results": evaluation,
            }


        # --------------------------
        # Continue Interview
        # --------------------------

        history = memory.get_history()

        prompt = f"""
{SYSTEM_PROMPT}

Conversation History:

{history}

Candidate's Latest Answer:

{answer}

Evaluate the answer briefly.

Ask ONLY the next interview question.

Return ONLY valid JSON.

{{
    "feedback": "...",
    "next_question": "...",
    "difficulty": "Medium",
    "category": "Programming"
}}
"""

        result = safe_generate(
            client,
            prompt
        )

        memory.add_ai_message(
            result["next_question"]
        )

        memory.next_question()

        progress = memory.get_progress()

        return {
            **result,
            **progress,
            "interview_complete": False,
        }


interview_engine = InterviewEngine()