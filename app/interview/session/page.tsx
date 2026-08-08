"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { startInterview, submitAnswer } from "@/lib/api";

type InterviewResponse = {
  question?: string;
  difficulty?: string;
  category?: string;
  score?: number;
  feedback?: string;
  next_question?: string;
  current_question?: number;
  total_questions?: number;
  interview_complete?: boolean;
  results?: unknown;
};

export default function InterviewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [candidateName, setCandidateName] = useState("");
  const [interviewType, setInterviewType] = useState("technical");

  const [totalQuestions, setTotalQuestions] = useState(10);

  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [category, setCategory] = useState("Introduction");

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  /*
   * Load interview information.
   */
  useEffect(() => {
    const storedCandidateName =
      sessionStorage.getItem("candidateName") || "";

    const storedInterviewType =
      sessionStorage.getItem("interviewType") || "technical";

    const storedTotalQuestions =
      sessionStorage.getItem("totalQuestions");

    const queryCandidateName =
      searchParams.get("candidateName") ||
      searchParams.get("name") ||
      "";

    const queryInterviewType =
      searchParams.get("interviewType") ||
      searchParams.get("type") ||
      "";

    const queryQuestions =
      searchParams.get("questions") || "";

    const finalCandidateName =
      queryCandidateName ||
      storedCandidateName ||
      "Candidate";

    const finalInterviewType =
      queryInterviewType ||
      storedInterviewType ||
      "technical";

    const parsedQuestions = Number(
      queryQuestions ||
        storedTotalQuestions ||
        "10"
    );

    const finalTotalQuestions =
      Number.isFinite(parsedQuestions) &&
      parsedQuestions > 0
        ? parsedQuestions
        : 10;

    setCandidateName(finalCandidateName);
    setInterviewType(finalInterviewType);
    setTotalQuestions(finalTotalQuestions);

    sessionStorage.setItem(
      "candidateName",
      finalCandidateName
    );

    sessionStorage.setItem(
      "interviewType",
      finalInterviewType
    );

    sessionStorage.setItem(
      "totalQuestions",
      String(finalTotalQuestions)
    );
  }, [searchParams]);

  /*
   * Start interview after candidate information
   * has been loaded.
   */
  useEffect(() => {
    if (!candidateName) {
      return;
    }

    let cancelled = false;

    async function beginInterview() {
      try {
        setLoading(true);
        setError("");

        const data: InterviewResponse =
          await startInterview(
            candidateName,
            interviewType,
            totalQuestions
          );

        if (cancelled) {
          return;
        }

        setQuestion(data.question || "");
        setDifficulty(
          data.difficulty || "Easy"
        );
        setCategory(
          data.category || "Introduction"
        );

        setCurrentQuestion(
          data.current_question || 1
        );

        setAnswer("");
        setFeedback("");
      } catch (err) {
        console.error(
          "Failed to start interview:",
          err
        );

        if (!cancelled) {
          setError(
            "Failed to start the interview. Make sure the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    beginInterview();

    return () => {
      cancelled = true;
    };
  }, [
    candidateName,
    interviewType,
    totalQuestions,
  ]);

  /*
   * Submit candidate answer.
   */
  async function handleSubmitAnswer() {
    if (submitting) {
      return;
    }

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      setError(
        "Please enter an answer before submitting."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data: InterviewResponse =
        await submitAnswer(trimmedAnswer);

      /*
       * IMPORTANT:
       *
       * The backend returns interview_complete=true
       * after the final answer.
       *
       * It also returns the final evaluation in
       * data.results.
       */
      if (data.interview_complete) {
        sessionStorage.setItem(
          "interviewResults",
          JSON.stringify(data.results || {})
        );

        sessionStorage.setItem(
          "interviewCompleted",
          "true"
        );

        router.push("/results");

        return;
      }

      /*
       * Interview is still continuing.
       */
      setFeedback(data.feedback || "");

      setQuestion(
        data.next_question ||
          data.question ||
          ""
      );

      setDifficulty(
        data.difficulty || "Medium"
      );

      setCategory(
        data.category || "Programming"
      );

      setCurrentQuestion(
        data.current_question ||
          currentQuestion + 1
      );

      setAnswer("");
    } catch (err) {
      console.error(
        "Failed to submit answer:",
        err
      );

      setError(
        "Failed to submit your answer. Check that the backend is running."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * Ctrl + Enter / Cmd + Enter.
   */
  function handleAnswerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {
      event.preventDefault();
      handleSubmitAnswer();
    }
  }

  const progress = Math.min(
    (currentQuestion / totalQuestions) * 100,
    100
  );

  /*
   * Loading screen.
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />

          <h1 className="text-2xl font-bold">
            Preparing your interview...
          </h1>

          <p className="mt-2 text-gray-400">
            Gemini is generating your first question.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Interview UI.
   */
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-xl font-bold">
              AI Interview
            </h1>

            <p className="text-sm capitalize text-gray-400">
              {interviewType}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">
              Candidate
            </p>

            <p className="font-semibold">
              {candidateName}
            </p>
          </div>

        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Progress */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-[#0d1324] p-5">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Interview Progress
              </p>

              <p className="mt-1 text-lg font-bold">
                Question {currentQuestion} /{" "}
                {totalQuestions}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-400">
                {Math.round(progress)}%
              </p>
            </div>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* Question */}
        <section className="rounded-2xl border border-white/10 bg-[#0d1324] p-6 shadow-2xl">

          <div className="mb-6 flex flex-wrap gap-3">

            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
              {category}
            </span>

            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              {difficulty}
            </span>

          </div>

          <h2 className="text-2xl font-bold leading-relaxed md:text-3xl">
            {question}
          </h2>

          {/* Previous feedback */}
          {feedback && (
            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-5">

              <p className="mb-2 text-sm font-semibold text-green-400">
                AI Feedback
              </p>

              <p className="leading-7 text-gray-300">
                {feedback}
              </p>

            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          {/* Answer */}
          <div className="mt-8">

            <label
              htmlFor="answer"
              className="mb-3 block text-sm font-semibold text-gray-300"
            >
              Your Answer
            </label>

            <textarea
              id="answer"
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value)
              }
              onKeyDown={handleAnswerKeyDown}
              disabled={submitting}
              placeholder="Type your answer here..."
              className="min-h-[220px] w-full resize-y rounded-xl border border-white/10 bg-black/30 p-5 text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-gray-500">
                Tip: Press Ctrl + Enter to submit.
              </p>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={
                  submitting ||
                  !answer.trim()
                }
                className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? "Evaluating..."
                  : currentQuestion ===
                    totalQuestions
                  ? "Finish Interview"
                  : "Submit Answer"}
              </button>

            </div>

          </div>

        </section>

        {/* Bottom status */}
        <div className="mt-6 text-center text-sm text-gray-500">

          {currentQuestion >=
          totalQuestions
            ? "This is your final question."
            : `You have ${
                totalQuestions -
                currentQuestion
              } question${
                totalQuestions -
                  currentQuestion ===
                1
                  ? ""
                  : "s"
              } remaining.`}

        </div>

      </div>
    </main>
  );
}