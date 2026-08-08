import React, { useEffect } from 'react';
import { Award, CheckCircle2, XCircle, Brain, BarChart2, Sparkles, RotateCcw, ArrowUpRight, Layers, Target, TrendingUp, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const LEVEL_META = {
  EXPERT:       { color: '#00F2FE', emoji: '🧠' },
  ADVANCED:     { color: '#10B981', emoji: '🚀' },
  INTERMEDIATE: { color: '#F59E0B', emoji: '⚙️' },
  BEGINNER:     { color: '#F43F5E', emoji: '📘' }
};
const REC_COLORS = {
  'Strong Hire': '#10B981', 'Hire': '#00F2FE', 'Lean Hire': '#F59E0B', 'Needs Development': '#F43F5E'
};

export default function StructuredFeedback({ feedback, onRestart }) {
  const safeFeedback = feedback || {};
  const dominantLevel = safeFeedback.dominantLevel || 'ADVANCED';
  const recommendation = safeFeedback.recommendation || 'Hire';
  const lm = LEVEL_META[dominantLevel] || LEVEL_META.INTERMEDIATE;
  const recColor = REC_COLORS[recommendation] || '#F59E0B';

  const levelDist = safeFeedback.levelDistribution || { EXPERT: 1, ADVANCED: 2, INTERMEDIATE: 1, BEGINNER: 0 };
  const totalAnswers = Object.values(levelDist).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if ((safeFeedback.overallScore || 75) >= 70) {
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.55 } });
    }
  }, []);

  return (
    <div className="sf-shell animate-fade-in">
      <div className="sf-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${lm.color}15 0%, transparent 55%)` }} />

      <div className="sf-container">

        {/* ── Hero Card ── */}
        <div className="sf-hero-card">
          <div className="sf-hero-left">
            <div className="sf-emoji-large">{lm.emoji}</div>
            <div>
              <div className="sf-sub-label font-mono">STRUCTURED TECHNICAL EVALUATION</div>
              <h1 className="sf-candidate-name">{safeFeedback.candidateName || 'Candidate'}</h1>
              <div className="sf-level-title" style={{ color: lm.color }}>
                {dominantLevel.charAt(0) + dominantLevel.slice(1).toLowerCase()} Level Engineer
              </div>
              <p className="sf-narrative">{safeFeedback.narrative || 'Evaluated across multi-turn technical scenarios.'}</p>
            </div>
          </div>

          <div className="sf-hero-right">
            <div className="sf-score-ring" style={{ borderColor: lm.color + '77', boxShadow: `0 0 32px ${lm.color}22` }}>
              <div className="sf-score-num font-mono" style={{ color: lm.color }}>{safeFeedback.overallScore || 75}</div>
              <div className="sf-score-sub">/ 100</div>
            </div>
            <div className="sf-rec-badge" style={{ background: recColor + '20', borderColor: recColor + '55', color: recColor }}>
              <Award size={16} />
              <span>{recommendation}</span>
            </div>
            <div className="sf-trend-row">
              <span>{safeFeedback.trendEmoji || '📈'}</span>
              <span style={{ color: lm.color }}>
                {(safeFeedback.performanceTrend || 'improving').charAt(0).toUpperCase() + (safeFeedback.performanceTrend || 'improving').slice(1)} trend
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="sf-stats-row">
          {[
            { icon: <Award size={20} className="text-cyan" />, val: safeFeedback.totalQuestions || 8, label: 'Questions Asked' },
            { icon: <Layers size={20} className="text-violet" />, val: (safeFeedback.coveredDays || []).length || 3, label: 'Curriculum Days' },
            { icon: <BarChart2 size={20} className="text-amber" />, val: `${safeFeedback.avgAnswerScore || '7.5'}/10`, label: 'Avg Answer Score' },
            { icon: <TrendingUp size={20} className="text-emerald" />, val: `${safeFeedback.overallScore || 75}%`, label: 'Overall Score' },
          ].map((s, i) => (
            <div key={i} className="sf-stat-card">
              {s.icon}
              <div className="sf-stat-val font-mono">{s.val}</div>
              <div className="sf-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Level Distribution ── */}
        <div className="sf-section mt-4">
          <h3 className="sf-section-title"><Brain size={17} className="text-cyan" /><span>Answer Level Distribution</span></h3>
          <div className="level-dist-bar-wide">
            {Object.entries(LEVEL_META).map(([key, meta]) => {
              const count = levelDist[key] || 0;
              const pct = totalAnswers > 0 ? (count / totalAnswers) * 100 : 0;
              return pct > 0 ? (
                <div key={key} className="dist-segment-wide" style={{ width: `${pct}%`, background: meta.color }} title={`${key}: ${count}`} />
              ) : null;
            })}
          </div>
          <div className="sf-journey-row mt-3">
            {(safeFeedback.levelHistory || []).map((l, i) => (
              <div key={i} className="sf-journey-pill" title={`Q${l.questionNumber}: ${l.label} (${l.score}/10)`}>
                <span className="font-mono" style={{ opacity: 0.6, fontSize: '0.65rem' }}>Q{l.questionNumber}</span>
                <span style={{ fontSize: '1.1rem' }}>{l.emoji}</span>
                <span style={{ color: l.color, fontWeight: 700, fontSize: '0.72rem' }}>{l.label}</span>
              </div>
            ))}
          </div>
          <div className="sf-dist-legend mt-2">
            {Object.entries(LEVEL_META).map(([key, meta]) => {
              const count = levelDist[key] || 0;
              return count > 0 ? (
                <span key={key} style={{ color: meta.color, fontSize: '0.75rem', fontWeight: 600 }}>
                  {meta.emoji} {key.charAt(0) + key.slice(1).toLowerCase()}: {count}
                </span>
              ) : null;
            })}
          </div>
        </div>

        {/* ── Competency Breakdown ── */}
        <div className="sf-section mt-4">
          <h3 className="sf-section-title"><Target size={17} className="text-amber" /><span>Technical Competency Breakdown</span></h3>
          <div className="sf-metrics-grid">
            {[
              { label: 'Conceptual Depth', val: (safeFeedback.scores && safeFeedback.scores.conceptualDepth) || 82, color: '#00F2FE', cls: 'fill-cyan' },
              { label: 'Trade-off Awareness', val: (safeFeedback.scores && safeFeedback.scores.tradeoffAwareness) || 75, color: '#F59E0B', cls: 'fill-amber' },
              { label: 'Engineering Clarity', val: (safeFeedback.scores && safeFeedback.scores.engineeringClarity) || 85, color: '#10B981', cls: 'fill-emerald' },
              { label: 'Production Realism', val: (safeFeedback.scores && safeFeedback.scores.productionRealism) || 78, color: '#8B5CF6', cls: 'fill-violet' },
            ].map(m => (
              <div key={m.label} className="sf-metric-box">
                <div className="sf-metric-row">
                  <span>{m.label}</span>
                  <span className="font-mono" style={{ color: m.color }}>{m.val}%</span>
                </div>
                <div className="thin-track">
                  <div className={`thin-fill ${m.cls}`} style={{ width: `${m.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Question Log ── */}
        <div className="sf-section mt-4">
          <h3 className="sf-section-title"><Layers size={17} className="text-violet" /><span>Question-by-Question Evaluation</span></h3>
          <div className="sf-eval-list">
            {(safeFeedback.topicEvaluations || []).map((ev, i) => (
              <div key={i} className="sf-eval-item" style={{ borderLeftColor: ev.levelColor || '#3B82F6' }}>
                <div className="sf-eval-header">
                  <span className="font-mono sf-eval-qnum">Q{ev.questionNumber}</span>
                  <span className="sf-eval-day">Day {ev.day || (i + 1)} — {ev.topic}</span>
                  <span className="sf-level-pill" style={{ background: (ev.levelColor || '#3B82F6') + '20', color: ev.levelColor || '#3B82F6', borderColor: (ev.levelColor || '#3B82F6') + '44' }}>
                    {ev.levelEmoji || '🚀'} {ev.level || 'Advanced'}
                  </span>
                  {!ev.isSkipped && (
                    <span className={`sf-score-pill ${(ev.score || 7) >= 7 ? 'score-hi' : (ev.score || 7) >= 5 ? 'score-mid' : 'score-lo'}`}>
                      {typeof ev.score === 'number' ? ev.score.toFixed(1) : (ev.score || '7.5')}/10
                    </span>
                  )}
                </div>
                <div className="sf-eval-snippet">"{ev.snippet || ev.answer}"</div>
                <div className="sf-eval-feedback">{ev.feedback}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Strengths & Gaps ── */}
        <div className="sf-two-col mt-4">
          <div className="sf-col-card sf-strength-card">
            <h4 className="sf-col-title text-emerald"><CheckCircle2 size={16} /> Key Strengths</h4>
            <ul className="sf-bullet-list">
              {(safeFeedback.keyStrengths || ['Strong technical reasoning', 'Good trade-off awareness']).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            {safeFeedback.consistentStrengths?.length > 0 && (
              <div className="sf-signal-grid mt-2">
                {safeFeedback.consistentStrengths.map((s, i) => (
                  <span key={i} className="tag tag-emerald">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="sf-col-card sf-gap-card">
            <h4 className="sf-col-title text-amber"><XCircle size={16} /> Areas for Improvement</h4>
            <ul className="sf-bullet-list">
              {(safeFeedback.areasForImprovement || ['Incorporate specific p95 latency targets', 'Elaborate on RAM footprint calculations']).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
            {safeFeedback.identifiedGaps?.length > 0 && (
              <div className="sf-signal-grid mt-2">
                {safeFeedback.identifiedGaps.map((g, i) => (
                  <span key={i} className="tag tag-amber">{g}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Next Steps ── */}
        <div className="sf-section mt-4 sf-steps-section">
          <h3 className="sf-section-title"><Sparkles size={17} className="text-cyan" /><span>Actionable Growth Roadmap</span></h3>
          <div className="sf-steps-list">
            {(safeFeedback.actionableSteps || [
              "Architect a parent-child document chunking pipeline for complex technical manuals.",
              "Implement capability negotiation and custom transport handlers for an MCP server.",
              "Profile OpenTelemetry latency metrics across RAG reranking stages."
            ]).map((step, i) => (
              <div key={i} className="sf-step-item">
                <div className="sf-step-num" style={{ background: lm.color + '20', color: lm.color }}>{i + 1}</div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="sf-cta-row mt-4">
          <button className="btn btn-secondary" onClick={onRestart}>
            <RotateCcw size={15} />
            <span>Restart Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
