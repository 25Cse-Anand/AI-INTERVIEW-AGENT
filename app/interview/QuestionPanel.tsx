type QuestionPanelProps = {
  question: string;
  difficulty: string;
  category: string;
  questionNumber: number;
  totalQuestions: number;
};

export default function QuestionPanel({
  question,
  difficulty,
  category,
  questionNumber,
  totalQuestions,
}: QuestionPanelProps) {
  const difficultyColor = {
    Easy: "bg-green-500/20 text-green-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    Hard: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="rounded-2xl bg-[#111827] p-8 shadow-lg">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            Question {questionNumber} / {totalQuestions}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            AI Interview
          </h2>

        </div>

        <div className="flex gap-3">

          <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-400">
            {category}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              difficultyColor[
                difficulty as keyof typeof difficultyColor
              ] ?? "bg-gray-500/20 text-gray-300"
            }`}
          >
            {difficulty}
          </span>

        </div>

      </div>

      <div className="mb-6 flex items-center gap-3">

        <div className="h-4 w-4 animate-pulse rounded-full bg-green-400" />

        <p className="font-medium text-green-400">
          Gemini 2.5 Flash is asking...
        </p>

      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-8">

        <p className="text-2xl leading-10 text-white">
          {question}
        </p>

      </div>

    </div>
  );
}