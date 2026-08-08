type QuestionCardProps = {
  questionNo: number;
  totalQuestions: number;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
};

export default function QuestionCard({
  questionNo,
  totalQuestions,
  category,
  difficulty,
  question,
}: QuestionCardProps) {
  const difficultyColor = {
    Easy: "bg-green-500/20 text-green-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    Hard: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101624] p-8 shadow-xl">

      {/* Top */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <div>
          <p className="text-sm text-gray-400">
            Question {questionNo} of {totalQuestions}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            AI Interview
          </h2>
        </div>

        <div className="flex gap-3">

          <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-400">
            {category}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${difficultyColor[difficulty]}`}
          >
            {difficulty}
          </span>

        </div>

      </div>

      {/* AI Indicator */}

      <div className="mb-8 flex items-center gap-3">

        <div className="h-4 w-4 animate-pulse rounded-full bg-green-400" />

        <span className="font-medium text-green-400">
          AI is asking...
        </span>

      </div>

      {/* Question */}

      <div className="rounded-xl border border-white/10 bg-black/30 p-8">

        <p className="text-2xl leading-10 text-white">
          {question}
        </p>

      </div>

      {/* Hint */}

      <div className="mt-8 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-5">

        <p className="text-sm text-indigo-300">
          Answer naturally. Think aloud when solving technical questions.
          The AI evaluates clarity, confidence, and reasoning—not just the final answer.
        </p>

      </div>

    </div>
  );
}