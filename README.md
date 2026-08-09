### 🎥 Watch the Demo

**[▶️ Watch the Full Project Demo](https://youtu.be/YH21yye-NU0)**

---

## 🚀 What is AI-INTERVIEW-AGENT?

AI-INTERVIEW-AGENT is an AI-powered technical interview platform that conducts personalized interviews, evaluates candidate responses, tracks performance, and generates a structured final assessment.

---
# InterviewAgent.AI — Enterprise SaaS Landing Page & AI Technical Interviewer

A high-converting SaaS landing page and dynamic technical interviewing platform powered by **Gemini 3.5 / 2.0 Flash Lite API** built for 31-Day Enterprise AI Engineering Cohorts.

---

## Key Features

- **High-Converting SaaS Landing Page (`LandingPage.jsx`)**:
  - Sticky glassmorphism header with glowing brand logo and navigation links.
  - High-resolution AI technology imagery from Unsplash.
  - Hero section with dual CTAs, live telemetry badges, and micro-trust metrics.
  - 6 interactive feature cards highlighting Adaptive Questioning, Live Gemini Step-by-Step Analysis, Skip Privilege, Strict Foolish Answer Penalties, and Career Roadmaps.
  - 3-step visual timeline ("Select Level" → "Adaptive Assessment" → "Structured Feedback Report").
  - Testimonial grid & enterprise SOC2 security compliance banner.

- **Interactive Result Preview Modal (`ResultPreviewModal.jsx`)**:
  - Triggered by "Login" and "Start Interview" buttons.
  - Dark semi-transparent backdrop overlay with blur and smooth scale-up animation.
  - Full keyboard accessibility (`Escape` key close) and backdrop click handler.
  - Displays a mockup of the final structured assessment report visual, highlights candidate value, and provides a direct **"Proceed to Interview 🚀"** transition button.

- **Adaptive AI Interview Engine (`DynamicInterview.jsx`)**:
  - Warm greeting & self-assessed level picker (**Beginner**, **Intermediate**, **Advanced**, **Expert**).
  - Customizable target interview length slider (10 to 20 questions).
  - Single-question interactive view alternating between **MCQs** and **Open-Ended Text** scenarios.
  - **Skip Question Privilege**: Skip questions anytime and review leftover questions one-by-one at the end.
  - **Step-by-Step Gemini 3.5 / 2.0 Evaluation**:
    - **MCQs**: Evaluated live for correctness (Correct / Incorrect) with concise technical explanations (no numerical ratings).
    - **Text Answers**: Deeply verified by Gemini Flash Lite. Foolish or wrong answers receive a strict **1.0 or 2.0 out of 10** rating.
  - **Senseless & Off-Topic Guardrail**: Detects random gibberish/nonsense, flags it with a warning screen, and prompts the user to re-answer correctly.

---

## Updated Repository File Structure

```
ai-interview-agent/
├── .gitignore                      # Git ignore rules (ignores node_modules & dist)
├── index.html                      # HTML template with Google Fonts
├── package.json                    # Dependencies (@google/generative-ai, react, lucide-react)
├── package-lock.json               # Lockfile
├── README.md                       # Documentation
├── vite.config.js                  # Vite configuration
└── src/
    ├── App.jsx                     # Main screen router: 'landing' -> 'login' -> 'interview' -> 'feedback'
    ├── main.jsx                    # React entrypoint
    ├── index.css                   # Complete CSS styling (Landing page, Modal, Dark theme, Animations)
    ├── components/
    │   ├── LandingPage.jsx         # High-converting SaaS Landing Page
    │   ├── ResultPreviewModal.jsx  # Interactive Result Preview Modal overlay
    │   ├── LoginPage.jsx           # Dynamic entrance login UI with pre-integrated API key
    │   ├── DynamicInterview.jsx    # Core adaptive question engine, Skip & Review flow
    │   ├── StructuredFeedback.jsx  # Final structured assessment report dashboard
    │   └── TelemetrySidebar.jsx    # Live score & level telemetry
    ├── data/
    │   ├── curriculumData.js       # 31-day cohort topics (RAG, Vector DBs, MCP, Agents, LoRA, vLLM)
    │   ├── candidateProfiles.js    # Sample candidate profiles
    │   └── quizQuestions.js        # Question bank
    └── services/
        ├── geminiService.js        # Pre-integrated Gemini 3.5 API client & strict evaluator
        └── conversationalEngine.js # Interview state machine manager
```

---

## Quick Start (Local Setup)

```bash
# 1. Clone your repository
git clone https://github.com/YOUR_USERNAME/ai-interview-agent.git
cd ai-interview-agent

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open `http://localhost:3000/` in your browser.

---

## Push to GitHub (Commands)

```bash
cd C:\Users\HP\.gemini\antigravity\scratch\ai-interview-agent

git init
git add .
git commit -m "Add high-converting SaaS Landing Page and Result Preview Modal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-interview-agent.git
git push -u origin main
```

---

## License
MIT License. Built for the 31-Day Enterprise AI Engineering Cohort.
