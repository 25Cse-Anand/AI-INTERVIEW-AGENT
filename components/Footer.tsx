import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-white/10 bg-[#050816] py-16"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:justify-between">

        {/* Left */}

        <div className="max-w-md">

          <h2 className="text-3xl font-extrabold text-white">
            AI<span className="text-indigo-500">.</span>Interview
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            Practice technical and HR interviews with an AI interviewer.
            Improve your communication, confidence, and problem-solving
            skills through personalized feedback.
          </p>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li>
              <Link href="/">Home</Link>
            </li>

            <li>
              <Link href="/interview">
                Start Interview
              </Link>
            </li>

            <li>
              <Link href="/results">
                Results
              </Link>
            </li>

          </ul>

        </div>

        {/* Features */}

        <div>

          <h3 className="mb-4 text-lg font-semibold text-white">
            Features
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li>AI Interviewer</li>

            <li>Voice Recognition</li>

            <li>Instant Feedback</li>

            <li>Performance Analytics</li>

          </ul>

        </div>

      </div>

      <div className="mt-14 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AI Interview Agent. Built with Next.js,
        Gemini AI, and FastAPI.
      </div>

    </footer>
  );
}