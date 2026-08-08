import React from 'react';
import { CANDIDATE_PROFILES } from '../data/candidateProfiles';
import { UserCheck, CheckCircle2, AlertTriangle, Cpu, X, Sparkles, ArrowRight } from 'lucide-react';

export default function CandidateSelector({ isOpen, onClose, activeCandidateId, onSelectCandidate }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-lg animate-scale-in">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Select Candidate Profile</h2>
            <p className="modal-desc">
              The Interview Agent tailors questions specifically to completed cohort missions and probes skipped topics.
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="candidate-grid">
          {CANDIDATE_PROFILES.map((cand) => {
            const isSelected = cand.id === activeCandidateId;
            return (
              <div 
                key={cand.id} 
                className={`candidate-card ${isSelected ? 'active-card' : ''}`}
                onClick={() => {
                  onSelectCandidate(cand.id);
                  onClose();
                }}
              >
                <div className="card-top">
                  <img src={cand.avatar} alt={cand.name} className="cand-avatar" />
                  <div>
                    <h3 className="cand-name">{cand.name}</h3>
                    <div className="cand-role">{cand.role}</div>
                  </div>
                  {isSelected && <span className="selected-badge"><CheckCircle2 size={14} /> Active</span>}
                </div>

                <div className="progress-bar-container">
                  <div className="progress-meta">
                    <span>Cohort Completion</span>
                    <span className="text-cyan font-mono">{cand.cohortProgress}</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(cand.completedDays.length / 31) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <p className="cand-bio">{cand.bio}</p>

                <div className="signal-tags">
                  <div className="signal-group">
                    <div className="signal-label text-emerald"><CheckCircle2 size={12} /> Strong Areas:</div>
                    <div className="tag-list">
                      {cand.learningSignals.strongAreas.slice(0, 2).map((st, i) => (
                        <span key={i} className="tag tag-emerald">{st}</span>
                      ))}
                    </div>
                  </div>

                  {cand.skippedDays.length > 0 && (
                    <div className="signal-group mt-2">
                      <div className="signal-label text-amber"><AlertTriangle size={12} /> Skipped Topics:</div>
                      <div className="tag-list">
                        {cand.skippedDays.map((sd) => (
                          <span key={sd} className="tag tag-amber">Day {sd}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button className={`btn btn-block mt-4 ${isSelected ? 'btn-primary' : 'btn-secondary'}`}>
                  <span>{isSelected ? 'Currently Selected' : 'Start Interview as ' + cand.name.split(' ')[0]}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <div className="info-callout">
            <Sparkles size={16} className="text-cyan" />
            <span>Note: Changing candidate will reset the active interview session.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
