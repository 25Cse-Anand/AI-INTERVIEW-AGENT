type CandidateCardProps = {
  name: string;
  role: string;
  status: "Waiting" | "Interviewing" | "Completed";
  time: string;
};

export default function CandidateCard({
  name,
  role,
  status,
  time,
}: CandidateCardProps) {
  const statusColor = {
    Waiting: "bg-yellow-500",
    Interviewing: "bg-green-500 animate-pulse",
    Completed: "bg-blue-500",
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#101624] p-6 shadow-xl">

      {/* Header */}
      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
          {name.charAt(0)}
        </div>

        <div className="flex-1">

          <h2 className="text-xl font-bold text-white">
            {name}
          </h2>

          <p className="text-gray-400">
            {role}
          </p>

        </div>

      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-white/10" />

      {/* Status */}

      <div className="flex items-center justify-between">

        <span className="text-gray-400">
          Interview Status
        </span>

        <div className="flex items-center gap-2">

          <div
            className={`h-3 w-3 rounded-full ${statusColor[status]}`}
          />

          <span className="font-medium text-white">
            {status}
          </span>

        </div>

      </div>

      {/* Timer */}

      <div className="mt-5 flex items-center justify-between">

        <span className="text-gray-400">
          Elapsed Time
        </span>

        <span className="font-semibold text-indigo-400">
          {time}
        </span>

      </div>

      {/* Bottom */}

      <div className="mt-8 rounded-xl bg-indigo-500/10 p-4">

        <p className="text-sm text-indigo-300">
          Stay calm, answer clearly, and think before responding.
        </p>

      </div>

    </div>
  );
}