const BASE_URL = "http://127.0.0.1:8000/api";

async function apiRequest(
  endpoint: string,
  options: RequestInit
) {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Backend returned invalid JSON: ${text}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `API ${response.status}: ${
        data?.detail ||
        data?.message ||
        text ||
        "Unknown backend error"
      }`
    );
  }

  return data;
}

export async function startInterview(
  candidateName: string,
  interviewType: string,
  totalQuestions: number
) {
  return apiRequest("/start", {
    method: "POST",
    body: JSON.stringify({
      candidate_name: candidateName,
      interview_type: interviewType,
      total_questions: totalQuestions,
    }),
  });
}

export async function submitAnswer(
  answer: string
) {
  return apiRequest("/answer", {
    method: "POST",
    body: JSON.stringify({
      answer,
    }),
  });
}