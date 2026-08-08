from pathlib import Path
from typing import Optional

DATA_DIR = Path("data")


def load_resume(filename: str) -> Optional[str]:
    """
    Load a resume text file from the data directory.
    Returns None if the file doesn't exist.
    """

    file_path = DATA_DIR / filename

    if not file_path.exists():
        return None

    return file_path.read_text(encoding="utf-8")


def save_resume(filename: str, content: str):
    """
    Save extracted resume text.
    """

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    file_path = DATA_DIR / filename

    file_path.write_text(content, encoding="utf-8")


def build_resume_context(resume_text: str) -> str:
    """
    Build context that will be sent to Gemini.
    """

    return f"""
Candidate Resume

----------------------------

{resume_text}

----------------------------

Use the resume above to generate interview questions.

Focus on:

- Projects
- Skills
- Technologies
- Education
- Experience
- Achievements

Ask realistic follow-up questions.
"""