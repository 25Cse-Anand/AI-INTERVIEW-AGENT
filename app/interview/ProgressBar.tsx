type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {

  const percentage = (current / total) * 100;

  return (
    <div className="rounded-2xl bg-[#111827] p-6">

      <div className="mb-3 flex justify-between">

        <span className="font-semibold">
          Interview Progress
        </span>

        <span>
          {current} / {total}
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-700">

        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}