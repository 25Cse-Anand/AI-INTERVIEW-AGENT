import json
import re

from google import genai
from google.genai import types


MODEL_NAME = "gemini-3.5-flash-lite"


def extract_json(text: str):
    """
    Extract JSON from Gemini response.

    Handles:
    - ```json ... ```
    - ``` ... ```
    - Plain JSON
    """

    text = text.strip()

    # Remove markdown code fences
    text = re.sub(r"^```json", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)

    text = text.strip()

    # Find first JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        text = match.group()

    return json.loads(text)


def safe_generate(client: genai.Client, prompt: str):
    """
    Generate JSON content using Gemini 3.5 Flash-Lite.
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            thinking_config=types.ThinkingConfig(
                thinking_level="minimal"
            ),
        ),
    )

    if not response.text:
        raise Exception("Gemini returned an empty response.")

    return extract_json(response.text)