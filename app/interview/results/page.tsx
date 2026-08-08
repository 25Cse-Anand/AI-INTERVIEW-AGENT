"use client";

import Link from "next/link";

const skills = [
  {
    title: "Technical Knowledge",
    score: 90,
  },
  {
    title: "Communication",
    score: 82,
  },
  {
    title: "Problem Solving",
    score: 88,
  },
  {
    title: "Confidence",
    score: 76,
  },
  {
    title: "System Design",
    score: 84,
  },
];

const questions = [
  { id: 1, status: "Correct", difficulty: "Easy" },
  { id: 2, status: "Correct", difficulty: "Medium" },
  { id: 3, status: "Correct", difficulty: "Hard" },
  { id: 4, status: "Incorrect", difficulty: "Medium" },
  { id: 5, status: "Correct", difficulty: "Hard" },
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <div className="mx-auto max-w-7xl p-10">

        <h1 className="text-5xl font-bold mb-2">
          Interview Report
        </h1>

        <p className="text-zinc-400 mb-10">
          AI Generated Performance Analysis
        </p>

        {/* Top Cards */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="rounded-xl bg-zinc-900 p-8 border border-zinc-800">

            <p className="text-zinc-400">
              Overall Score
            </p>

            <h2 className="text-6xl font-bold mt-4">
              92
            </h2>

            <p className="text-green-400 mt-2">
              Excellent Performance
            </p>

          </div>

          <div className="rounded-xl bg-zinc-900 p-8 border border-zinc-800">

            <p className="text-zinc-400">
              Interview Status
            </p>

            <h2 className="text-5xl font-bold mt-4 text-green-400">
              PASSED
            </h2>

            <p className="mt-2 text-zinc-400">
              Ready for technical interviews
            </p>

          </div>

        </div>

        {/* Performance */}

        <section className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Performance Overview
          </h2>

          <div className="space-y-6">

            {skills.map((skill) => (

              <div key={skill.title}>

                <div className="flex justify-between mb-2">

                  <span>{skill.title}</span>

                  <span>{skill.score}%</span>

                </div>

                <div className="h-3 rounded-full bg-zinc-800">

                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{
                      width: `${skill.score}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* Question Analysis */}

        <section className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Question Breakdown
          </h2>

          <div className="space-y-4">

            {questions.map((q) => (

              <div
                key={q.id}
                className="flex justify-between items-center bg-zinc-800 rounded-lg p-4"
              >

                <span>
                  Question {q.id}
                </span>

                <span>
                  {q.difficulty}
                </span>

                <span
                  className={
                    q.status === "Correct"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {q.status}
                </span>

              </div>

            ))}

          </div>

        </section>

        {/* Bottom */}

        <div className="grid md:grid-cols-2 gap-8">

          <section className="rounded-xl bg-zinc-900 border border-zinc-800 p-8">

            <h2 className="text-2xl font-bold mb-6">
              Strengths
            </h2>

            <ul className="space-y-3 text-green-400">
              <li>✓ Strong DSA knowledge</li>
              <li>✓ Good communication</li>
              <li>✓ Clear explanations</li>
              <li>✓ Logical thinking</li>
            </ul>

          </section>

          <section className="rounded-xl bg-zinc-900 border border-zinc-800 p-8">

            <h2 className="text-2xl font-bold mb-6">
              Improvements
            </h2>

            <ul className="space-y-3 text-yellow-400">
              <li>• Improve confidence</li>
              <li>• Mention edge cases</li>
              <li>• Explain time complexity</li>
              <li>• Keep answers concise</li>
            </ul>

          </section>

        </div>

        {/* Summary */}

        <section className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            AI Summary
          </h2>

          <p className="text-zinc-300 leading-8">
            You demonstrated strong technical knowledge and
            consistently approached problems logically. Your
            communication was clear, and your explanations were
            easy to follow. Focus on discussing edge cases,
            confidence during difficult questions, and mentioning
            time complexity to reach an excellent interview level.
          </p>

        </section>

        {/* Buttons */}

        <div className="flex flex-wrap gap-4 mt-10">

          <Link
            href="/"
            className="rounded-lg bg-zinc-800 px-6 py-3"
          >
            Home
          </Link>

          <Link
            href="/interview"
            className="rounded-lg bg-blue-600 px-6 py-3"
          >
            Retry Interview
          </Link>

          <button className="rounded-lg bg-green-600 px-6 py-3">
            Download PDF
          </button>

          <button className="rounded-lg bg-purple-600 px-6 py-3">
            Share Result
          </button>

        </div>

      </div>

    </main>
  );
}