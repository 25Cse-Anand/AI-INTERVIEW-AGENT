import React from 'react';
import { Bot, Code2, RotateCcw, UserCheck, ShieldCheck } from 'lucide-react';
import { getAiProvider } from '../services/geminiService';

export default function Navbar({ activeCandidate, onOpenCandidateModal, onOpenApiModal, onResetSession, currentPhase, isComplete }) {
  const activeEngine = getAiProvider() === 'groq' ? '⚡ Groq Llama 3' : '♊ Gemini 2.5';
  const engineColor = getAiProvider() === 'groq' ? '#FBBF24' : '#22D3EE';
  const dotColor = getAiProvider() === 'groq' ? '#EAB308' : '#06B6D4';

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="logo-badge">
            <Bot size={22} className="logo-icon" />
          </div>
          <div>
            <div className="brand-title">
              INTERVIEW<span className="brand-highlight">AGENT</span>.AI
            </div>
            <div className="brand-subtitle">31-Day Enterprise AI Cohort Assessor</div>
          </div>
        </div>

        <div className="nav-status-pills">
          <div className="status-pill candidate-pill" onClick={onOpenCandidateModal}>
            <UserCheck size={15} className="pill-icon text-cyan" />
            <span>Candidate: <strong>{activeCandidate.name}</strong></span>
            <span className="badge-mini">{activeCandidate.completedDays.length}/31 Days</span>
          </div>

          <div className="status-pill phase-pill">
            <span className="live-dot" style={{ backgroundColor: dotColor }}></span>
            <span>Engine: <strong style={{ color: engineColor }}>{activeEngine}</strong></span>
          </div>

          {isComplete && (
            <div className="status-pill complete-pill">
              <ShieldCheck size={15} className="text-emerald" />
              <span>Interview Complete</span>
            </div>
          )}
        </div>

        <div className="nav-actions">
          <button className="btn btn-secondary btn-sm" onClick={onOpenApiModal}>
            <Code2 size={16} />
            <span>API Specs & Contract</span>
          </button>
          
          <button className="btn btn-outline btn-sm" onClick={onResetSession} title="Reset Interview Session">
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
