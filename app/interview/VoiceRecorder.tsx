"use client";

type VoiceRecorderProps = {
  recording: boolean;
  onToggle: () => void;
};

export default function VoiceRecorder({
  recording,
  onToggle,
}: VoiceRecorderProps) {
  return (
    <div className="rounded-2xl bg-[#111827] p-6 shadow-lg">

      <h2 className="mb-5 text-xl font-bold">
        Voice Interview
      </h2>

      <button
        onClick={onToggle}
        className={`w-full rounded-xl py-4 font-semibold transition ${
          recording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {recording
          ? "Stop Recording"
          : "Start Recording"}
      </button>

    </div>
  );
}