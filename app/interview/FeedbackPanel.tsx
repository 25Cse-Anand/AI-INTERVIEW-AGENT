type FeedbackPanelProps = {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

export default function FeedbackPanel({
  score,
  feedback,
  strengths,
  improvements,
}: FeedbackPanelProps) {
  return (
    <div className="rounded-2xl bg-[#111827] p-8 shadow-lg">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          AI Feedback
        </h2>

        <div className="rounded-full bg-indigo-600 px-5 py-2 text-xl font-bold">
          {score}/10
        </div>

      </div>

      <div className="mt-8">

        <h3 className="mb-3 text-lg font-semibold text-green-400">
          Strengths
        </h3>

        <ul className="space-y-2">

          {strengths.map((item, index) => (
            <li
              key={index}
              className="rounded-lg bg-green-500/10 p-3"
            >
              ✅ {item}
            </li>
          ))}

        </ul>

      </div>

      <div className="mt-8">

        <h3 className="mb-3 text-lg font-semibold text-red-400">
          Improvements
        </h3>

        <ul className="space-y-2">

          {improvements.map((item, index) => (
            <li
              key={index}
              className="rounded-lg bg-red-500/10 p-3"
            >
              🔴 {item}
            </li>
          ))}

        </ul>

      </div>

      <div className="mt-8 rounded-xl bg-[#1B2333] p-5">

        <h3 className="mb-3 text-lg font-semibold">
          Detailed Feedback
        </h3>

        <p className="leading-8 text-gray-300">
          {feedback}
        </p>

      </div>

    </div>
  );
}