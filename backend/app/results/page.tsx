"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type InterviewResults = {
  overall_score?: number | string;
  overallScore?: number | string;
  score?: number | string;

  summary?: string;
  overall_feedback?: string;
  overallFeedback?: string;
  feedback?: string;

  strengths?: string[];
  improvements?: string[];
  weaknesses?: string[];
  recommendations?: string[];

  technical_score?: number | string;
  technicalScore?: number | string;

  communication_score?: number | string;
  communicationScore?: number | string;

  problem_solving_score?: number | string;
  problemSolvingScore?: number | string;

  confidence_score?: number | string;
  confidenceScore?: number | string;

  question_scores?: Array<{
    question?: string;
    score?: number | string;
    feedback?: string;
  }>;

  questionScores?: Array<{
    question?: string;
    score?: number | string;
    feedback?: string;
  }>;

  [key: string]: unknown;
};

function getScore(
  value: unknown
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function formatScore(
  value: unknown,
  suffix = "/10"
) {
  const score = getScore(value);

  if (score === null) {
    return "—";
  }

  return `${score}${suffix}`;
}

function normalizeList(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (
        item &&
        typeof item === "object"
      ) {
        const obj =
          item as Record<string, unknown>;

        return String(
          obj.text ??
            obj.description ??
            obj.feedback ??
            obj.title ??
            ""
        );
      }

      return "";
    })
    .filter(Boolean);
}

export default function ResultsPage() {
  const router = useRouter();

  const [results, setResults] =
    useState<InterviewResults | null>(null);

  const [candidateName, setCandidateName] =
    useState("Candidate");

  const [interviewType, setInterviewType] =
    useState("Technical");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    try {
      const storedResults =
        sessionStorage.getItem(
          "interviewResults"
        );

      const storedCandidate =
        sessionStorage.getItem(
          "candidateName"
        );

      const storedType =
        sessionStorage.getItem(
          "interviewType"
        );

      if (storedCandidate) {
        setCandidateName(
          storedCandidate
        );
      }

      if (storedType) {
        setInterviewType(
          storedType
        );
      }

      if (storedResults) {
        const parsed =
          JSON.parse(storedResults);

        /*
         * The backend stores the final
         * evaluation in data.results.
         *
         * Sometimes the frontend may store
         * the whole response instead.
         */
        const finalResults =
          parsed?.results &&
          typeof parsed.results ===
            "object"
            ? parsed.results
            : parsed;

        setResults(finalResults);
      }
    } catch (error) {
      console.error(
        "Failed to load interview results:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const overallScore = useMemo(() => {
    if (!results) {
      return null;
    }

    return (
      getScore(
        results.overall_score
      ) ??
      getScore(
        results.overallScore
      ) ??
      getScore(results.score)
    );
  }, [results]);

  const summary =
    results?.summary ||
    results?.overall_feedback ||
    results?.overallFeedback ||
    results?.feedback ||
    "";

  const strengths =
    normalizeList(
      results?.strengths
    );

  const improvements =
    normalizeList(
      results?.improvements
    ).length > 0
      ? normalizeList(
          results?.improvements
        )
      : normalizeList(
          results?.weaknesses
        );

  const recommendations =
    normalizeList(
      results?.recommendations
    );

  const questionScores =
    Array.isArray(
      results?.question_scores
    )
      ? results.question_scores
      : Array.isArray(
            results?.questionScores
          )
        ? results.questionScores
        : [];

  const skills = [
    {
      name: "Technical Skills",
      value:
        getScore(
          results?.technical_score
        ) ??
        getScore(
          results?.technicalScore
        ),
    },
    {
      name: "Communication",
      value:
        getScore(
          results?.communication_score
        ) ??
        getScore(
          results?.communicationScore
        ),
    },
    {
      name: "Problem Solving",
      value:
        getScore(
          results?.problem_solving_score
        ) ??
        getScore(
          results?.problemSolvingScore
        ),
    },
    {
      name: "Confidence",
      value:
        getScore(
          results?.confidence_score
        ) ??
        getScore(
          results?.confidenceScore
        ),
    },
  ].filter(
    (skill) => skill.value !== null
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500" />

          <p className="text-lg font-semibold">
            Preparing your results...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-sm font-medium text-indigo-400">
              AI INTERVIEW AGENT
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Interview Results
            </h1>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Candidate
            </p>

            <p className="font-semibold text-white">
              {candidateName}
            </p>
          </div>

        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-6 py-10">

        {/* Hero result */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl">

          <div className="grid gap-8 p-8 md:grid-cols-[260px_1fr] md:p-10">

            {/* Score */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-8 text-center">

              <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Overall Score
              </p>

              <div className="mt-4">

                <span className="text-6xl font-black tracking-tight text-white">
                  {overallScore !== null
                    ? overallScore
                    : "—"}
                </span>

                {overallScore !== null && (
                  <span className="ml-2 text-xl text-gray-500">
                    /10
                  </span>
                )}

              </div>

              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{
                    width:
                      overallScore !== null
                        ? `${Math.min(
                            Math.max(
                              overallScore *
                                10,
                              0
                            ),
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

              <p className="mt-4 text-sm capitalize text-gray-500">
                {interviewType} interview
              </p>

            </div>

            {/* Summary */}
            <div className="flex flex-col justify-center">

              <div className="mb-4 inline-flex w-fit items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                INTERVIEW COMPLETED
              </div>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Performance Overview
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-gray-400">
                {summary ||
                  "Your interview evaluation has been completed. Detailed feedback from the AI evaluator is shown below."}
              </p>

            </div>

          </div>

        </section>

        {/* Skill breakdown */}
        {skills.length > 0 && (
          <section className="mb-8">

            <div className="mb-5">
              <p className="text-sm font-medium text-indigo-400">
                PERFORMANCE
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Skill Breakdown
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
                >

                  <div className="mb-4 flex items-center justify-between">

                    <span className="font-medium text-gray-200">
                      {skill.name}
                    </span>

                    <span className="font-bold text-white">
                      {skill.value}/10
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            (skill.value ??
                              0) * 10,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* Strengths + improvements */}
        {(strengths.length > 0 ||
          improvements.length > 0) && (
          <section className="mb-8 grid gap-6 md:grid-cols-2">

            {/* Strengths */}
            {strengths.length > 0 && (
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-7">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      What went well
                    </p>

                    <h2 className="text-xl font-bold">
                      Strengths
                    </h2>
                  </div>

                </div>

                <div className="space-y-3">

                  {strengths.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex gap-3 rounded-xl border border-white/5 bg-black/10 p-4"
                      >
                        <span className="mt-0.5 text-emerald-400">
                          ✓
                        </span>

                        <p className="leading-6 text-gray-300">
                          {item}
                        </p>
                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* Improvements */}
            {improvements.length > 0 && (
              <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.035] p-7">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    ↑
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Focus areas
                    </p>

                    <h2 className="text-xl font-bold">
                      Improvements
                    </h2>
                  </div>

                </div>

                <div className="space-y-3">

                  {improvements.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex gap-3 rounded-xl border border-white/5 bg-black/10 p-4"
                      >
                        <span className="mt-0.5 text-amber-400">
                          →
                        </span>

                        <p className="leading-6 text-gray-300">
                          {item}
                        </p>
                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.035] p-7">

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                NEXT STEPS
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Recommendations
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">

              {recommendations.map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-xl border border-white/5 bg-black/10 p-4 text-gray-300"
                  >
                    <span className="mr-3 font-semibold text-indigo-400">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {item}
                  </div>
                )
              )}

            </div>

          </section>
        )}

        {/* Question history */}
        {questionScores.length > 0 && (
          <section className="mb-8">

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                QUESTION REVIEW
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Question History
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">

              {questionScores.map(
                (item, index) => (
                  <div
                    key={index}
                    className="border-b border-white/10 bg-white/[0.025] p-5 last:border-b-0"
                  >

                    <div className="flex gap-5">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-bold text-indigo-400">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <p className="font-medium leading-6 text-gray-200">
                            {item.question ||
                              `Question ${
                                index + 1
                              }`}
                          </p>

                          {getScore(
                            item.score
                          ) !== null && (
                            <span className="shrink-0 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-300">
                              {item.score}/10
                            </span>
                          )}

                        </div>

                        {item.feedback && (
                          <p className="mt-3 leading-6 text-gray-500">
                            {item.feedback}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>
        )}

        {/* Empty result data warning */}
        {!results && (
          <section className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">

            <h2 className="font-bold text-amber-300">
              Results data not found
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              The results page loaded correctly, but
              no interview evaluation was saved in
              this browser session. Complete another
              interview to generate a report.
            </p>

          </section>
        )}

        {/* Actions */}
        <section className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3 font-semibold text-gray-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Back to Home
          </button>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(
                "interviewResults"
              );

              sessionStorage.removeItem(
                "interviewCompleted"
              );

              router.push("/interview");
            }}
            className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Take Another Interview
          </button>

        </section>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-gray-600">
          AI Interview Agent · Results generated
          from your completed interview
        </p>

      </div>
    </main>
  );
}