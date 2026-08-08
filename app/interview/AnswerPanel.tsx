"use client";

import { useState } from "react";

type AnswerPanelProps = {
  answer: string;
  loading: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
};

export default function AnswerPanel({
  answer,
  loading,
  onAnswerChange,
  onSubmit,
}: AnswerPanelProps) {
  const [recording, setRecording] = useState(false);

  function toggleRecording() {
    setRecording((prev) => !prev);
  }

  return (
    <div className="rounded-2xl bg-[#111827] p-8 shadow-lg">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Your Answer
        </h2>

        <span className="text-sm text-gray-400">
          {answer.length} characters
        </span>

      </div>

      <textarea
        rows={8}
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full rounded-xl border border-white/10 bg-[#1B2333] p-5 text-white outline-none transition focus:border-indigo-500"
      />

      <div className="mt-6 flex flex-wrap gap-4">

        <button
          type="button"
          onClick={toggleRecording}
          className={`rounded-xl px-6 py-3 font-semibold transition ${
            recording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {recording ? "⏹ Stop Recording" : "🎤 Start Recording"}
        </button>

        <button
          type="button"
          onClick={() => onAnswerChange("")}
          className="rounded-xl bg-gray-700 px-6 py-3 font-semibold hover:bg-gray-600"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </button>

      </div>

    </div>
  );
}