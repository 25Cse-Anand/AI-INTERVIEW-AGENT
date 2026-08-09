import React, { useEffect, useState } from 'react';
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

  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    if ((safeFeedback.overallScore || 75) >= 70) {
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.55 } });
    }

    // Save to history in localStorage
    try {
      const historyStr = localStorage.getItem('interview_history') || '[]';
      const history = JSON.parse(historyStr);
      
      const currentSessionId = safeFeedback.session_id || `sess_${safeFeedback.overallScore}_${(safeFeedback.topicEvaluations || []).length}_${Date.now()}`;
      const alreadyExists = history.some(h => h.session_id === currentSessionId);
      
      if (!alreadyExists && safeFeedback.overallScore !== undefined) {
        const historyEntry = {
          session_id: currentSessionId,
          timestamp: new Date().toISOString(),
          overallScore: safeFeedback.overallScore,
          recommendation: safeFeedback.recommendation,
          dominantLevel: safeFeedback.dominantLevel,
          roundType: safeFeedback.roundType || 'General',
          strengths: safeFeedback.keyStrengths || [],
          gaps: safeFeedback.areasForImprovement || []
        };
        history.push(historyEntry);
        localStorage.setItem('interview_history', JSON.stringify(history));
        setHistoryList(history);
      } else {
        setHistoryList(history);
      }
    } catch (e) {
      console.warn("Failed to save/load interview history:", e);
    }
  }, [safeFeedback]);

  const sortedHistory = [...historyList].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const points = sortedHistory.map((h, i) => {
    const x = sortedHistory.length > 1 
      ? (i / (sortedHistory.length - 1)) * 400 + 50 
      : 250;
    const y = 130 - ((h.overallScore || 0) / 100) * 110;
    return { x, y, ...h };
  });

  return (
    <div className="sf-shell animate-fade-in">
      <div className="sf-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${lm.color}15 0%, transparent 55%)` }} />

      <div className="sf-container">

        {/* ── Hero Card ── */}
        <div className="sf-hero-card">
          <div className="sf-hero-left">
            <div className="sf-emoji-large">{lm.emoji}</div>
            <div>
              <div className="sf-sub-label font-mono">
                {safeFeedback.roundType ? safeFeedback.roundType.toUpperCase() : 'STRUCTURED TECHNICAL EVALUATION'}
              </div>
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
            { icon: <Award size={20} className="text-cyan" />, val: safeFeedback.totalQuestions ?? 0, label: 'Questions Answered' },
            { icon: <Layers size={20} className="text-violet" />, val: (safeFeedback.coveredDays ?? []).length, label: 'Topics Covered' },
            { icon: <BarChart2 size={20} className="text-amber" />, val: `${safeFeedback.avgAnswerScore ?? '0.0'}/10`, label: 'Avg Answer Score' },
            { icon: <TrendingUp size={20} className="text-emerald" />, val: `${safeFeedback.overallScore ?? 0}%`, label: 'Overall Score' },
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
          <h3 className="sf-section-title"><Target size={17} className="text-amber" /><span>AI Interview Analysis Metrics</span></h3>
          <div className="sf-metrics-grid">
            {[
              { label: 'Confidence', val: safeFeedback.scores?.confidence ?? 0, color: '#00F2FE', cls: 'fill-cyan' },
              { label: 'Technical Depth', val: safeFeedback.scores?.technicalDepth ?? 0, color: '#10B981', cls: 'fill-emerald' },
              { label: 'Reasoning', val: safeFeedback.scores?.reasoning ?? 0, color: '#F59E0B', cls: 'fill-amber' },
              { label: 'Communication', val: safeFeedback.scores?.communication ?? 0, color: '#8B5CF6', cls: 'fill-violet' },
            ].map(m => (
              <div key={m.label} className="sf-metric-box">
                <div className="sf-metric-row">
                  <span>{m.label}</span>
                  <span className="font-mono font-bold" style={{ color: m.color }}>{m.val}%</span>
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

        {/* ── Interview Progress & History Dashboard ── */}
        {historyList.length > 0 && (
          <div className="sf-section mt-4" style={{
            background: 'rgba(25, 20, 35, 0.4)',
            border: '1px solid rgba(0, 242, 254, 0.15)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)'
          }}>
            <h3 className="sf-section-title">
              <TrendingUp size={17} style={{ color: '#00F2FE' }} />
              <span>Interview Progress & History Dashboard</span>
            </h3>

            {historyList.length > 1 && (
              <div className="sf-chart-container" style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                <h4 style={{ color: '#E2D7CD', fontSize: '0.95rem', marginBottom: '1.2rem', fontWeight: 600 }}>Overall Score Progression Trend</h4>
                <div style={{ position: 'relative', width: '100%', height: '180px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '10px' }}>
                  <svg viewBox="0 0 500 150" width="100%" height="100%" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="460" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="40" y1="75" x2="460" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="40" y1="130" x2="460" y2="130" stroke="rgba(255,255,255,0.06)" />

                    <text x="15" y="24" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">100</text>
                    <text x="15" y="79" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">50</text>
                    <text x="15" y="134" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">0</text>

                    {/* Area fill */}
                    {points.length > 1 && (
                      <path
                        d={`M ${points[0].x} 130 ${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} 130 Z`}
                        fill="url(#chart-grad)"
                      />
                    )}

                    {/* Line path */}
                    {points.length > 1 && (
                      <path
                        d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                        fill="none"
                        stroke="#00F2FE"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Circles & Labels */}
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#00F2FE" strokeWidth="2.5" />
                        <text x={p.x} y={p.y - 10} fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                          {p.overallScore}%
                        </text>
                        <text x={p.x} y="144" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace" textAnchor="middle">
                          {p.roundType || 'General'}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* Strong and Weak Skills Aggregation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
                  <Star size={15} /> Verified Strong Skills (Across Rounds)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {Array.from(new Set(historyList.flatMap(h => h.strengths || []))).slice(0, 6).map((s, i) => (
                    <span key={i} className="tag tag-emerald" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      {s.length > 35 ? s.substring(0, 35) + '...' : s}
                    </span>
                  ))}
                  {historyList.length === 0 && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Complete interviews to aggregate skills.</span>}
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
                  <TrendingUp size={15} /> Key Areas for Improvement
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {Array.from(new Set(historyList.flatMap(h => h.gaps || []))).slice(0, 6).map((g, i) => (
                    <span key={i} className="tag tag-amber" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {g.length > 35 ? g.substring(0, 35) + '...' : g}
                    </span>
                  ))}
                  {historyList.length === 0 && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Complete interviews to aggregate gaps.</span>}
                </div>
              </div>
            </div>

            {/* List of past sessions */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ color: '#E2D7CD', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>Past Interview Sessions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {[...historyList].reverse().map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.6rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#A0A0B0', fontFamily: 'monospace' }}>
                        {new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>{h.roundType || 'General'}</span>
                      <span style={{ fontSize: '0.75rem', color: '#A0A0B0' }}>{h.dominantLevel}</span>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#00F2FE', fontFamily: 'monospace' }}>{h.overallScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
