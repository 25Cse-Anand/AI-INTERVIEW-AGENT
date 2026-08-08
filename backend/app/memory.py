from typing import Dict, List


class InterviewMemory:
    def __init__(self):
        self.reset()

    def reset(self):
        self.candidate_name = ""
        self.interview_type = "technical"

        self.current_question = 0
        self.total_questions = 10

        self.history: List[Dict[str, str]] = []

    def configure(
        self,
        candidate_name: str,
        interview_type: str,
        total_questions: int,
    ):
        self.reset()

        self.candidate_name = candidate_name
        self.interview_type = interview_type

        self.total_questions = max(1, total_questions)

    def add_ai_message(self, message: str):
        self.history.append(
            {
                "role": "assistant",
                "content": message,
            }
        )

    def add_candidate_message(self, message: str):
        self.history.append(
            {
                "role": "user",
                "content": message,
            }
        )

    def next_question(self):
        self.current_question += 1

    def interview_finished(self):
        return self.current_question >= self.total_questions

    def get_progress(self):
        return {
            "current_question": self.current_question,
            "total_questions": self.total_questions,
        }

    def get_history(self):
        return self.history


memory = InterviewMemory()