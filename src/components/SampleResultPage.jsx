import React from 'react';
import { ArrowLeft, ArrowRight, Award, Brain, CheckCircle2, Layers, Sparkles, TrendingUp, XCircle, Zap, ShieldCheck, Download, Share2 } from 'lucide-react';

export default function SampleResultPage({ onBackToLanding, onStartInterview }) {
  const sampleData = {
    candidateName: "Arjun Mehta (Sample)",
    totalQuestions: 12,
    coveredDays: ["RAG & Vector DBs", "Agentic AI", "MCP Protocol", "vLLM / LoRA Fine-Tuning"],
    overallScore: 88,
    avgAnswerScore: "8.8",
    recommendation: "Strong Hire",
    dominantLevel: "EXPERT",
    scores: {
      conceptualDepth: 92,
      tradeoffAwareness: 85,
      engineeringClarity: 90,
      productionRealism: 82
    },
    topicEvaluations: [
      {
        questionNumber: 1,
        day: 7,
        topic: "In an HNSW vector index, what is the primary operational trade-off when increasing the 'M' parameter?",
        snippet: "Selected: Higher search recall and accuracy at the cost of higher memory footprint and index build time",
        level: "Advanced",
        levelEmoji: "🚀",
        levelColor: "#10B981",
        score: 9.0,
        feedback: "Correct selection! Increasing 'M' adds bi-directional link density per vector node, improving search recall while increasing RAM consumption."
      },
      {
        questionNumber: 2,
        day: 8,
        topic: "Walk me through your document chunking strategy for complex PDFs containing tables and text.",
        snippet: "Used Parent-Child Chunking splitter with markdown tables serialized as JSON context...",
        level: "Expert",
        levelEmoji: "🧠",
        levelColor: "#00F2FE",
        score: 9.5,
        feedback: "Exceptional explanation! Clear understanding of semantic boundary retention and tabular JSON serialization."
      },
      {
        questionNumber: 3,
        day: 20,
        topic: "What key advantage does the Model Context Protocol (MCP) offer over standard REST API tool calling?",
        snippet: "Selected: Standardized protocol transport (STDIO/SSE) with capability negotiation and resource scoping",
        level: "Advanced",
        levelEmoji: "🚀",
        levelColor: "#10B981",
        score: 8.8,
        feedback: "Correct! Standardized capability negotiation ensures clean multi-agent tool discovery."
      },
      {
        questionNumber: 4,
        day: 25,
        topic: "Why does vLLM's PagedAttention architecture achieve up to 2-4x higher throughput?",
        snippet: "Selected: Manages Key-Value (KV) cache memory in non-contiguous virtual memory blocks",
        level: "Expert",
        levelEmoji: "🧠",
        levelColor: "#00F2FE",
        score: 9.2,
        feedback: "Spot on! Partitioning KV cache into virtual blocks eliminates VRAM fragmentation."
      }
    ],
    keyStrengths: [
      "Deep command of HNSW vector index parameters (M, ef_construction) & RAM footprint calculation",
      "Articulated clean Parent-Child chunking strategies for PDF table serialization",
      "Solid command of vLLM PagedAttention KV cache virtual block memory allocation"
    ],
    areasForImprovement: [
      "Incorporate more quantitative benchmarks (e.g. p95 latency targets under 500 QPS)",
      "Elaborate on multi-stage fallback gates when cross-encoder reranking fails",
      "Discuss OpenTelemetry span context propagation across async agent workers"
    ],
    actionableSteps: [
      "Build a production RAG pipeline using HNSW vector indexing and cross-encoder re-ranking.",
      "Implement an MCP server with custom tools and STDIO/SSE transport protocol.",
      "Instrument OpenTelemetry tracing across multi-agent workflows."
    ]
  };

  return (
    <div className="sample-result-shell animate-fade-in">

      {/* Top Navbar */}
      <header className="srp-topbar">
        <div className="srp-topbar-inner">
          <button className="btn btn-secondary srp-back-btn" onClick={onBackToLanding}>
            <ArrowLeft size={16} />
            <span>Back to Landing Page</span>
          </button>

          <div className="srp-brand">
            <Sparkles size={18} className="text-cyan" />
            <span className="font-bold">SAMPLE ASSESSMENT REPORT</span>
          </div>

          <button className="btn btn-primary srp-start-btn" onClick={onStartInterview}>
            <span>Start Your Own Assessment</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="srp-container">

        {/* Hero Banner */}
        <div className="srp-hero-card">
          <div className="srp-hero-top">
            <div>
              <div className="srp-candidate-tag font-mono text-cyan">CANDIDATE ASSESSMENT PROFILE</div>
              <h1 className="srp-candidate-name">{sampleData.candidateName}</h1>
              <p className="srp-meta-line text-sm text-muted">
                31-Day Enterprise AI Cohort · Evaluated live step-by-step by Enterprise AI Engine
              </p>
            </div>

            <div className="srp-score-badge-group">
              <div className="srp-overall-score-circle">
                <span className="score-big text-cyan">{sampleData.overallScore}%</span>
                <span className="score-lbl text-xs text-dim">MATCH SCORE</span>
              </div>
              <div className="srp-recommendation-box">
                <span className="badge-hire text-emerald">RECOMMENDATION: {sampleData.recommendation.toUpperCase()}</span>
                <span className="srp-dominant-level font-mono text-xs">Dominant Level: {sampleData.dominantLevel} 🧠</span>
              </div>
            </div>
          </div>

          {/* Competency Metric Cards */}
          <div className="srp-metrics-grid mt-4">
            {[
              { label: 'Conceptual Depth', val: sampleData.scores.conceptualDepth, color: '#00F2FE' },
              { label: 'Trade-off Awareness', val: sampleData.scores.tradeoffAwareness, color: '#F59E0B' },
              { label: 'Engineering Clarity', val: sampleData.scores.engineeringClarity, color: '#10B981' },
              { label: 'Production Realism', val: sampleData.scores.productionRealism, color: '#8B5CF6' }
            ].map((m, i) => (
              <div key={i} className="srp-metric-card">
                <div className="srp-mc-row">
                  <span className="text-xs text-muted">{m.label}</span>
                  <span className="font-mono font-bold" style={{ color: m.color }}>{m.val}%</span>
                </div>
                <div className="srp-mc-track">
                  <div className="srp-mc-fill" style={{ width: `${m.val}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic-by-Topic Evaluations */}
        <section className="srp-section mt-4">
          <h3 className="srp-section-title">
            <Layers size={18} className="text-cyan" />
            <span>Question-by-Question Technical Evaluation</span>
          </h3>

          <div className="srp-eval-list">
            {sampleData.topicEvaluations.map((ev, i) => (
              <div key={i} className="srp-eval-item" style={{ borderLeftColor: ev.levelColor }}>
                <div className="srp-eval-item-header">
                  <span className="font-mono srp-qnum">Q{ev.questionNumber}</span>
                  <span className="srp-qtitle">Day {ev.day} — {ev.topic}</span>
                  <span className="srp-level-pill" style={{ background: ev.levelColor + '18', color: ev.levelColor, borderColor: ev.levelColor + '44' }}>
                    {ev.levelEmoji} {ev.level}
                  </span>
                  <span className="srp-score-pill font-mono">{ev.score.toFixed(1)}/10</span>
                </div>
                <div className="srp-eval-snippet">"{ev.snippet}"</div>
                <div className="srp-eval-feedback">{ev.feedback}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Strengths & Gaps */}
        <div className="srp-two-col mt-4">
          <div className="srp-col-card srp-card-strengths">
            <h4 className="srp-col-title text-emerald"><CheckCircle2 size={18} /> Verified Technical Strengths</h4>
            <ul className="srp-bullet-list">
              {sampleData.keyStrengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div className="srp-col-card srp-card-gaps">
            <h4 className="srp-col-title text-amber"><XCircle size={18} /> Identified Growth Areas</h4>
            <ul className="srp-bullet-list">
              {sampleData.areasForImprovement.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
        </div>

        {/* Actionable Roadmap */}
        <section className="srp-section mt-4 srp-roadmap-box">
          <h3 className="srp-section-title">
            <TrendingUp size={18} className="text-cyan" />
            <span>Actionable Growth Roadmap</span>
          </h3>
          <div className="srp-roadmap-steps">
            {sampleData.actionableSteps.map((step, i) => (
              <div key={i} className="srp-roadmap-item">
                <div className="srp-step-badge">{i + 1}</div>
                <div className="srp-step-text">{step}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <div className="srp-bottom-cta-banner mt-4">
          <div>
            <h3>Ready to get your own structured report?</h3>
            <p className="text-sm text-muted">Test your AI engineering skills across RAG, Vector DBs, MCP & Agents in minutes.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onStartInterview}>
            <span>Start My Technical Interview</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </main>
    </div>
  );
}
