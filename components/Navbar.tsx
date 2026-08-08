"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white"
        >
          AI<span className="text-indigo-500">.</span>Interview
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#home"
            className="text-gray-300 transition hover:text-white"
          >
            Home
          </a>

          <a
            href="#features"
            className="text-gray-300 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-gray-300 transition hover:text-white"
          >
            About
          </a>
        </nav>

        {/* CTA */}
        <Link
          href="/interview"
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Start Interview
        </Link>
      </div>
    </header>
  );
}