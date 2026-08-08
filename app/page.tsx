"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  ChevronRight,
  Layers3,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Interviewer",
    description:
      "Practice realistic technical and HR interviews with an AI interviewer that adapts to your answers.",
  },
  {
    icon: Layers3,
    title: "Adaptive Questions",
    description:
      "Questions adjust in difficulty based on how you perform throughout the interview.",
  },
  {
    icon: MessageSquare,
    title: "Instant Feedback",
    description:
      "Understand what was strong, what was weak, and how you can improve your next answer.",
  },
  {
    icon: BarChart3,
    title: "Performance Analysis",
    description:
      "Review your overall score across technical skills, communication, confidence and problem solving.",
  },
  {
    icon: Target,
    title: "Technical & HR",
    description:
      "Prepare for coding, computer science, behavioral and general HR interview questions.",
  },
  {
    icon: Sparkles,
    title: "Personalized Results",
    description:
      "Finish every session with structured feedback and practical recommendations.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your interview",
    description:
      "Select your interview type, difficulty and number of questions.",
  },
  {
    number: "02",
    title: "Answer naturally",
    description:
      "Have a focused text-based conversation with your AI interviewer.",
  },
  {
    number: "03",
    title: "Review your performance",
    description:
      "Get scores, strengths, weaknesses and recommendations after the interview.",
  },
];

const scores = [
  ["Technical Skills", 88],
  ["Communication", 81],
  ["Problem Solving", 86],
  ["Confidence", 82],
] as const;

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050816] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-[-300px] h-[650px] w-[650px] rounded-full bg-[#6d4aff]/10 blur-[150px]" />

        <div className="absolute right-[-250px] top-[550px] h-[600px] w-[600px] rounded-full bg-[#7c3aed]/[0.07] blur-[150px]" />

        <div className="absolute left-[35%] top-[1400px] h-[500px] w-[500px] rounded-full bg-[#4f46e5]/[0.05] blur-[140px]" />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6d4aff] to-[#8b5cf6] shadow-lg shadow-[#6d4aff]/20 transition group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="text-[17px] font-semibold tracking-tight">
              AI Interview
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-[#8d93a8] transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-[#8d93a8] transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#results"
              className="text-sm text-[#8d93a8] transition hover:text-white"
            >
              Results
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/interview"
              className="hidden items-center gap-2 rounded-lg bg-[#6d4aff] px-4 py-2.5 text-sm font-semibold shadow-lg shadow-[#6d4aff]/20 transition hover:-translate-y-0.5 hover:bg-[#7b5aff] sm:flex"
            >
              Start Interview
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-[#8d93a8] transition hover:bg-white/5 hover:text-white md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/[0.07] bg-[#080b18] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#features"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-[#9aa0b4] transition hover:bg-white/5 hover:text-white"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-[#9aa0b4] transition hover:bg-white/5 hover:text-white"
              >
                How it works
              </a>

              <a
                href="#results"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-[#9aa0b4] transition hover:bg-white/5 hover:text-white"
              >
                Results
              </a>

              <Link
                href="/interview"
                onClick={closeMenu}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#6d4aff] px-4 py-3 font-semibold"
              >
                Start Interview
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:py-24">
          {/* LEFT */}
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#755dff]/20 bg-[#755dff]/[0.07] px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8b7cff] shadow-[0_0_10px_#8b7cff]" />

              <span className="text-xs font-medium text-[#aaa1ff] sm:text-sm">
                AI-powered interview simulator
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
              Practice like the
              <br />
              <span className="bg-gradient-to-r from-[#a99cff] via-[#806bff] to-[#5b7cff] bg-clip-text text-transparent">
                interview is real.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#9298aa] sm:text-lg">
              Simulate technical and HR interviews with an AI interviewer that
              evaluates your answers and shows you exactly where to improve.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/interview"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#6d4aff] px-6 py-3.5 text-sm font-semibold shadow-xl shadow-[#6d4aff]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#7b5aff]"
              >
                Start an Interview
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-semibold text-[#d5d7df] transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                See how it works
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#73798b] sm:text-sm">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#927dff]" />
                Technical + HR
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#927dff]" />
                10-question sessions
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#927dff]" />
                AI evaluation
              </span>
            </div>
          </div>

          {/* RIGHT - PRODUCT PREVIEW */}
          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="absolute -inset-10 rounded-[50px] bg-[#6546e8]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0b0f1d] shadow-2xl shadow-black/50">
              {/* Browser top bar */}
              <div className="flex h-12 items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>

                <span className="text-[11px] text-[#60677a]">
                  AI Interview
                </span>

                <span className="w-10" />
              </div>

              <div className="p-5 sm:p-7">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#60677a]">
                      Technical Interview
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Data Structures
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg border border-[#755dff]/20 bg-[#755dff]/10 px-3 py-1.5 text-xs text-[#a99cff]">
                    04 / 10
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-[#242838]">
                  <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-[#6950ff] to-[#8b5cf6]" />
                </div>

                {/* Question */}
                <div className="rounded-xl border border-white/[0.07] bg-[#080b16] p-5">
                  <div className="mb-4 flex gap-2">
                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-[#9197aa]">
                      Medium
                    </span>

                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-[#9197aa]">
                      DSA
                    </span>
                  </div>

                  <p className="text-base font-medium leading-7 text-[#f3f4f8] sm:text-lg">
                    What is the difference between a stack and a queue, and
                    when would you use each?
                  </p>
                </div>

                {/* Answer */}
                <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#080b16] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-[#73798b]">
                      Your answer
                    </span>

                    <span className="text-[11px] text-[#4f5568]">
                      182 characters
                    </span>
                  </div>

                  <p className="min-h-[90px] text-sm leading-6 text-[#9298aa]">
                    A stack follows LIFO, while a queue follows FIFO. A stack
                    is useful when the most recently added item should be
                    processed first...
                  </p>

                  <div className="mt-4 flex justify-end">
                    <span className="rounded-lg bg-[#6d4aff] px-4 py-2 text-xs font-semibold">
                      Submit Answer
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-5 flex items-center justify-between gap-4 text-[11px] text-[#666c7e]">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    AI interviewer active
                  </span>

                  <span>Adaptive evaluation enabled</span>
                </div>
              </div>
            </div>

            {/* Floating score */}
            <div className="absolute -bottom-6 -left-5 hidden w-48 rounded-xl border border-white/10 bg-[#0c1020]/95 p-4 shadow-2xl backdrop-blur-xl sm:block">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-[#60677a]">
                  Current score
                </span>

                <Zap className="h-3.5 w-3.5 text-[#927dff]" />
              </div>

              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-bold">8.4</span>
                <span className="mb-1 text-xs text-[#60677a]">/10</span>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#242838]">
                <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#6950ff] to-[#8b5cf6]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST / VALUE STRIP
      ========================================================= */}

      <section className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
          {[
            ["AI", "Adaptive interviewer"],
            ["Technical + HR", "Multiple interview modes"],
            ["10", "Questions per session"],
            ["Instant", "Performance feedback"],
          ].map(([title, subtitle], index) => (
            <div
              key={title}
              className={`px-5 py-7 text-center ${
                index !== 0 ? "border-l border-white/[0.07]" : ""
              }`}
            >
              <p className="text-lg font-semibold tracking-tight sm:text-xl">
                {title}
              </p>

              <p className="mt-1 text-xs text-[#666c7e]">{subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8170ff]">
            Built for better preparation
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to prepare.
          </h2>

          <p className="mt-4 text-base leading-7 text-[#858b9f]">
            A focused interview environment designed to help you practice,
            understand your mistakes and improve with every session.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.07] bg-[#0b1020]/70 p-7 transition duration-300 hover:-translate-y-1 hover:border-[#755dff]/25 hover:bg-[#10152a]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-[#8b75ff] transition group-hover:border-[#755dff]/20 group-hover:bg-[#755dff]/10">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#858b9f]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        id="how-it-works"
        className="border-y border-white/[0.07] bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8170ff]">
              Simple by design
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From practice to progress.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#858b9f]">
              Start an interview, answer the questions and get a clear picture
              of your performance.
            </p>
          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute left-[16%] right-[16%] top-5 hidden h-px bg-gradient-to-r from-transparent via-[#755dff]/30 to-transparent md:block" />

            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#755dff]/30 bg-[#0b1020] text-xs font-bold text-[#a99cff]">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-[#858b9f]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          RESULTS
      ========================================================= */}

      <section
        id="results"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          {/* LEFT */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8170ff]">
              Know where you stand
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Feedback that actually helps you improve.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#858b9f]">
              After the interview, review a structured evaluation instead of
              simply getting a pass or fail.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Overall interview score",
                "Question-by-question evaluation",
                "Strengths and improvement areas",
                "Personalized recommendations",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#d0d3dc]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6d4aff]/10 text-[#927dff]">
                    <Check className="h-3.5 w-3.5" />
                  </span>

                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/results"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#927dff] transition hover:text-white"
            >
              View results dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* RIGHT - RESULTS PREVIEW */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0a0e1c] p-4 shadow-2xl shadow-black/30 sm:p-6">
            <div className="rounded-xl border border-white/[0.07] bg-[#050816] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#60677a]">
                    Interview Results
                  </p>

                  <p className="mt-1 font-semibold">Performance Overview</p>
                </div>

                <span className="rounded-full border border-emerald-400/10 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold text-emerald-400">
                  COMPLETED
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[180px_1fr]">
                {/* Overall score */}
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-[#60677a]">
                    Overall score
                  </p>

                  <p className="mt-3 text-5xl font-bold tracking-tight">
                    8.4
                    <span className="text-lg text-[#60677a]">/10</span>
                  </p>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#242838]">
                    <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#6950ff] to-[#8b5cf6]" />
                  </div>

                  <p className="mt-3 text-[10px] text-[#60677a]">
                    Strong performance
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  {scores.map(([name, score]) => (
                    <div
                      key={name}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9298aa]">{name}</span>

                        <span className="font-semibold text-white">
                          {(score / 10).toFixed(1)}
                        </span>
                      </div>

                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#242838]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#6950ff] to-[#8b5cf6]"
                          style={{
                            width: `${score}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Feedback */}
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#927dff]" />

                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#60677a]">
                    AI feedback
                  </p>
                </div>

                <p className="mt-2 text-xs leading-6 text-[#858b9f]">
                  Strong understanding of core concepts. Focus on giving more
                  structured examples when explaining technical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#755dff]/15 bg-[#0b1020] px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-[#6546e8]/15 blur-[100px]" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8170ff]">
              Start practicing
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Ready for your next interview?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#858b9f] sm:text-base">
              Test your knowledge, identify weak areas and improve with
              structured AI feedback.
            </p>

            <Link
              href="/interview"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#6d4aff] px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[#6d4aff]/20 transition hover:-translate-y-0.5 hover:bg-[#7b5aff]"
            >
              Start Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="font-semibold">
              AI Interview
            </Link>

            <p className="mt-1 text-xs text-[#60677a]">
              Practice smarter. Interview better.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-[#60677a]">
            <a
              href="#features"
              className="transition hover:text-[#c4c7d0]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-[#c4c7d0]"
            >
              How it works
            </a>

            <Link
              href="/results"
              className="transition hover:text-[#c4c7d0]"
            >
              Results
            </Link>

            <Link
              href="/interview"
              className="transition hover:text-[#c4c7d0]"
            >
              Start Interview
            </Link>
          </div>
        </div>

        <div className="border-t border-white/[0.05] py-5 text-center text-xs text-[#50566a]">
          © 2026 AI Interview Agent
        </div>
      </footer>
    </main>
  );
}