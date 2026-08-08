import React from 'react';
import { Bot, Sparkles, Terminal, Code2, RotateCcw, UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeCandidate, onOpenCandidateModal, onOpenApiModal, onResetSession, currentPhase, isComplete }) {
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
            <span className="live-dot"></span>
            <span>Phase: <strong className="text-amber">{currentPhase}</strong></span>
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
