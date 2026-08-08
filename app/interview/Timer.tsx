"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  initialMinutes: number;
};

export default function Timer({ initialMinutes }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="rounded-2xl bg-[#111827] p-6 shadow-lg">

      <h2 className="mb-4 text-xl font-bold">
        Interview Timer
      </h2>

      <div className="text-center text-5xl font-bold text-indigo-400">
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </div>

    </div>
  );
}