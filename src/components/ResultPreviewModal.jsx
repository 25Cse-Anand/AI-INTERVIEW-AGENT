import React, { useEffect } from 'react';
import { X, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Award, Layers, TrendingUp, Cpu, Brain, Zap } from 'lucide-react';

export default function ResultPreviewModal({ isOpen, onClose, onProceed }) {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-container animate-scale-up" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-badge font-mono">
            <Sparkles size={14} className="text-cyan" />
            <span>FINAL REPORT PREVIEW & VALUE PROPOSITION</span>
          </div>
          <h2 className="modal-title">What Your Final Report Will Look Like</h2>
          <p className="modal-subtitle">
            After completing your 8–20 adaptive question session, you will receive an enterprise-grade structured assessment powered by <strong>Enterprise AI Engine</strong>.
          </p>
        </div>

        {/* Modal Body Grid */}
        <div className="modal-body-grid">

          {/* Left: Mock Visual of the Structured Feedback Report */}
          <div className="modal-mockup-card">
            <div className="mockup-top-bar">
              <div className="mockup-dots">
                <span className="dot dot-red" />
                <span className="dot dot-amber" />
                <span className="dot dot-green" />
              </div>
              <span className="mockup-title font-mono">ASSESSMENT_REPORT_ARJUN_MEHTA.PDF</span>
            </div>

            <div className="mockup-content">
              {/* Score Header */}
              <div className="mockup-score-hero">
                <div className="msh-score">
                  <span className="score-val text-cyan">88%</span>
                  <span className="score-lbl text-xs text-dim">OVERALL MATCH</span>
                </div>
                <div className="msh-recommendation">
                  <span className="badge-hire text-emerald">STRONG HIRE</span>
                  <span className="msh-level text-xs">Dominant Level: EXPERT 🧠</span>
                </div>
              </div>

              {/* Skill Bars */}
              <div className="mockup-skills-list">
                {[
                  { label: 'RAG & Vector DB Architecture', pct: 92, color: '#00F2FE' },
                  { label: 'Agentic Workflow & HITL', pct: 85, color: '#10B981' },
                  { label: 'MCP Protocol & Security', pct: 90, color: '#8B5CF6' },
                  { label: 'vLLM / LoRA Fine-Tuning', pct: 82, color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} className="mockup-skill-item">
                    <div className="ms-row">
                      <span className="ms-label">{s.label}</span>
                      <span className="ms-pct font-mono" style={{ color: s.color }}>{s.pct}%</span>
                    </div>
                    <div className="ms-track">
                      <div className="ms-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Topic Evaluation snippet */}
              <div className="mockup-topic-box">
                <div className="mtb-header">
                  <span className="mtb-q font-mono text-cyan">Q3 (RAG & Vector DBs): HNSW Indexing</span>
                  <span className="mtb-badge text-emerald">🚀 Advanced Level</span>
                </div>
                <p className="mtb-feedback">
                  "Exceptional response! Correctly cited M and ef_construction parameters with memory trade-off calculations."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Value Deliverables & Bullet Points */}
          <div className="modal-value-info">
            <h3 className="value-info-title">What you get upon completion:</h3>

            <div className="value-feature-list">
              <div className="value-feature-item">
                <div className="vfi-icon bg-cyan-subtle">
                  <Award size={18} className="text-cyan" />
                </div>
                <div>
                  <h4>Detailed Hire Recommendation</h4>
                  <p>Clear score classification (Strong Hire, Hire, Lean Hire) matched against senior engineering standards.</p>
                </div>
              </div>

              <div className="value-feature-item">
                <div className="vfi-icon bg-emerald-subtle">
                  <TrendingUp size={18} className="text-emerald" />
                </div>
                <div>
                  <h4>Step-by-Step AI Analysis</h4>
                  <p>Factual accuracy checks on every question with specific technical strengths & gaps highlighted.</p>
                </div>
              </div>

              <div className="value-feature-item">
                <div className="vfi-icon bg-violet-subtle">
                  <Brain size={18} className="text-violet" />
                </div>
                <div>
                  <h4>Skill Radar & Level Distribution</h4>
                  <p>Visual map of your mastery across 31-day AI cohort topics (RAG, Vector DBs, MCP, Agents, LoRA).</p>
                </div>
              </div>

              <div className="value-feature-item">
                <div className="vfi-icon bg-amber-subtle">
                  <Zap size={18} className="text-amber" />
                </div>
                <div>
                  <h4>Actionable Career Growth Roadmap</h4>
                  <p>3 concrete, practical engineering steps to refine your weaknesses and ace real interview loops.</p>
                </div>
              </div>
            </div>

            <div className="modal-cta-box">
              <button className="btn btn-primary btn-block btn-lg modal-proceed-btn" onClick={onProceed}>
                <span>Proceed to Interview</span>
                <ArrowRight size={20} />
              </button>
              <p className="text-xs text-dim text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck size={13} className="text-emerald" /> Free Assessment · Pre-Integrated AI Engine · No Credit Card Required
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
