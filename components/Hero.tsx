import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-[90vh] flex items-center justify-center px-6"
    >
      <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">

        {/* Left Content */}
        <div>

          <span className="mb-6 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400">
            🚀 AI Powered Mock Interviews
          </span>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight lg:text-7xl">
            Ace Your
            <span className="gradient-text"> Dream Interview </span>
            with AI
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-8 text-gray-400">
            Practice technical and HR interviews using an intelligent AI
            interviewer. Receive instant feedback, confidence analysis,
            communication scores, and personalized improvement tips after
            every session.
          </p>

          <div className="flex flex-wrap gap-4">

            <Link
              href="/interview"
              className="primary-btn"
            >
              Start Interview →
            </Link>

            <a
              href="#features"
              className="secondary-btn"
            >
              Explore Features
            </a>

          </div>

          {/* Stats */}

          <div className="mt-14 grid grid-cols-3 gap-8">

            <div>
              <h2 className="text-3xl font-bold text-indigo-400">
                500+
              </h2>
              <p className="mt-2 text-gray-400">
                Questions
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-indigo-400">
                AI
              </h2>
              <p className="mt-2 text-gray-400">
                Evaluation
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-indigo-400">
                Instant
              </h2>
              <p className="mt-2 text-gray-400">
                Feedback
              </p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex justify-center">

          <div className="relative flex h-[500px] w-full max-w-md items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 shadow-2xl">

            <div className="absolute h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative z-10 w-[85%] rounded-2xl border border-white/10 bg-[#0d1117] p-8 shadow-xl">

              <div className="mb-6 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>

              <div className="space-y-4">

                <div className="rounded-lg bg-indigo-500/20 p-4">
                  <p className="text-sm text-gray-300">
                    AI: Tell me about yourself.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-800 p-4">
                  <p className="text-sm text-gray-400">
                    Candidate is answering...
                  </p>
                </div>

                <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <p className="text-sm text-green-400">
                    Confidence Score: 91%
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}