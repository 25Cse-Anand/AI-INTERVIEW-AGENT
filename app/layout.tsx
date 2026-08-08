import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview Agent",
  description:
    "Practice technical and HR interviews with an AI-powered interviewer. Get instant feedback, scores, and personalized improvement suggestions.",
  keywords: [
    "AI Interview",
    "Interview Practice",
    "Mock Interview",
    "Gemini AI",
    "Career",
    "Technical Interview",
  ],
  authors: [
    {
      name: "AI Interview Agent",
    },
  ],
  openGraph: {
    title: "AI Interview Agent",
    description:
      "Prepare for your dream job using AI-powered mock interviews.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}