"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InterviewSetupPage() {
  const router = useRouter();

  const [candidateName, setCandidateName] = useState("");
  const [interviewType, setInterviewType] = useState("technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState(10);

  function startInterview() {
    if (!candidateName.trim()) {
      alert("Please enter your name.");
      return;
    }

    const params = new URLSearchParams({
      name: candidateName,
      type: interviewType,
      difficulty,
      questions: questions.toString(),
    });

    router.push(`/interview/session?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-[#101624] p-8 shadow-xl">

        <h1 className="text-4xl font-bold mb-8">
          Interview Setup
        </h1>

        <div className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Candidate Name
            </label>

            <input
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-lg bg-[#1b2333] p-3 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Interview Type
            </label>

            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full rounded-lg bg-[#1b2333] p-3"
            >
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
              <option value="dsa">DSA</option>
              <option value="system_design">System Design</option>
              <option value="resume">Resume Based</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg bg-[#1b2333] p-3"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Number of Questions
            </label>

            <input
              type="number"
              min={5}
              max={20}
              value={questions}
              onChange={(e) =>
                setQuestions(Number(e.target.value))
              }
              className="w-full rounded-lg bg-[#1b2333] p-3"
            />
          </div>

          <button
            onClick={startInterview}
            className="w-full rounded-lg bg-indigo-600 py-4 text-lg font-semibold transition hover:bg-indigo-700"
          >
            Start AI Interview
          </button>

        </div>
      </div>
    </main>
  );
}