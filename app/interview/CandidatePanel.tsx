type CandidatePanelProps = {
  name: string;
  interviewType: string;
  status: string;
};

export default function CandidatePanel({
  name,
  interviewType,
  status,
}: CandidatePanelProps) {
  return (
    <div className="rounded-2xl bg-[#111827] p-6 shadow-lg">

      <div className="flex flex-col items-center">

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-4xl font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>

        <h2 className="mt-5 text-2xl font-bold">
          {name}
        </h2>

        <p className="mt-1 text-gray-400 capitalize">
          {interviewType}
        </p>

      </div>

      <div className="my-6 border-t border-gray-700" />

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-400">
            Status
          </span>

          <span className="font-semibold text-green-400">
            {status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">
            AI Model
          </span>

          <span className="font-semibold">
            Gemini 2.5 Flash
          </span>
        </div>

      </div>

    </div>
  );
}