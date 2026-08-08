import React from 'react';
import { Award, CheckCircle2, AlertTriangle, ArrowLeft, ShieldCheck, Layers, Star, Sparkles, Check, Copy, TrendingUp, Brain, Target, BarChart2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedbackReport({ feedbackData, onBackToInterview }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (feedbackData?.hiring_recommendation === "Strong Hire" || feedbackData?.hiring_recommendation === "Hire") {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  }, [feedbackData]);

  if (!feedbackData) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(feedbackData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getBadgeClass = (rec) => {
    switch (rec) {
      case 'Strong Hire': return 'rec-strong-hire';
      case 'Hire': return 'rec-hire';
      case 'Lean Hire': return 'rec-lean-hire';
      default: return 'rec-needs-work';
    }
  };

  const r = feedbackData;
  const or = r.overall_result; // generalized overall result

  return (
    <div className="feedback-report-container animate-fade-in">
      <div className="report-header-bar">
        <button className="btn btn-secondary btn-sm" onClick={onBackToInterview}>
          <ArrowLeft size={16} />
          <span>Back to Transcript</span>
        </button>
        <div className="report-actions">
          <button className="btn btn-outline btn-sm" onClick={handleCopyJson}>
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            <span>{copied ? 'Copied JSON!' : 'Copy API JSON'}</span>
          </button>
        </div>
      </div>

      <div className="report-card main-report-card">

        {/* ── Hero ── */}
        <div className="report-hero">
          <div className="hero-left">
            <span className="candidate-tag font-mono">CANDIDATE EVALUATION REPORT</span>
            <h1 className="candidate-title">{r.candidate_name}</h1>
            <p className="summary-text">{r.assessment_summary}</p>
          </div>
          <div className="hero-right">
            <div className="score-ring-box">
              <div className="score-val font-mono">{r.overall_score}</div>
              <div className="score-label">OVERALL SCORE</div>
            </div>
            <div className={`recommendation-badge ${getBadgeClass(r.hiring_recommendation)}`}>
              <Award size={18} />
              <span>{r.hiring_recommendation}</span>
            </div>
          </div>
        </div>

        {/* ── NEW: Generalised Overall Result ── */}
        {or && (
          <div
            className="overall-result-block mt-4"
            style={{ borderColor: or.dominant_level_color + '44' }}
          >
            <div className="or-header">
              <Brain size={20} style={{ color: or.dominant_level_color }} />
              <h3 className="or-title">Overall Candidate Assessment</h3>
              <div
                className="or-level-badge"
                style={{ background: or.dominant_level_color + '22', borderColor: or.dominant_level_color + '66', color: or.dominant_level_color }}
              >
                {or.dominant_level_emoji} {or.dominant_level_label}
              </div>
            </div>

            <p className="or-narrative">{or.narrative}</p>

            <div className="or-stats-row">
              <div className="or-stat">
                <div className="or-stat-val font-mono" style={{ color: or.dominant_level_color }}>
                  {or.average_answer_score}/10
                </div>
                <div className="or-stat-lbl">Avg Answer Score</div>
              </div>

              <div className="or-stat">
                <div className="or-stat-val font-mono">
                  {or.trend_emoji} {or.performance_trend.charAt(0).toUpperCase() + or.performance_trend.slice(1)}
                </div>
                <div className="or-stat-lbl">Performance Trend</div>
              </div>

              <div className="or-stat">
                <div className="or-stat-val font-mono">{r.curriculum_coverage.total_questions_asked}</div>
                <div className="or-stat-lbl">Total Questions</div>
              </div>

              <div className="or-stat">
                <div className="or-stat-val font-mono">{r.curriculum_coverage.covered_days_count}</div>
                <div className="or-stat-lbl">Cohort Days Covered</div>
              </div>
            </div>

            {/* Per-Question Level Journey */}
            <div className="or-level-journey mt-3">
              <div className="sub-label mb-1">Question-by-Question Level Journey:</div>
              <div className="journey-pills">
                {(or.per_question_levels || []).map((q, i) => (
                  <div key={i} className="journey-pill" title={`Q${q.q}: ${q.level} (${q.score}/10)`}>
                    <span className="journey-q font-mono">Q{q.q}</span>
                    <span className="journey-emoji">{q.emoji}</span>
                    <span className="journey-level">{q.level}</span>
                    <span className="journey-score font-mono" style={{ opacity: 0.7 }}>{q.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Distribution */}
            {or.level_distribution && (
              <div className="level-dist-section mt-3">
                <div className="sub-label mb-1">Level Distribution:</div>
                <div className="level-dist-bar-wide">
                  {Object.entries({ EXPERT: '#00F2FE', ADVANCED: '#10B981', INTERMEDIATE: '#F59E0B', BEGINNER: '#F43F5E' }).map(([key, color]) => {
                    const count = or.level_distribution[key] || 0;
                    const total = Object.values(or.level_distribution).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return pct > 0 ? (
                      <div
                        key={key}
                        className="dist-segment-wide"
                        style={{ width: `${pct}%`, background: color }}
                        title={`${key}: ${count} answers (${Math.round(pct)}%)`}
                      />
                    ) : null;
                  })}
                </div>
                <div className="dist-legend mt-1">
                  {Object.entries({ EXPERT: { emoji: '🧠', color: '#00F2FE' }, ADVANCED: { emoji: '🚀', color: '#10B981' }, INTERMEDIATE: { emoji: '⚙️', color: '#F59E0B' }, BEGINNER: { emoji: '📘', color: '#F43F5E' } }).map(([key, v]) => {
                    const count = or.level_distribution[key] || 0;
                    return count > 0 ? (
                      <span key={key} className="dist-legend-item" style={{ color: v.color }}>
                        {v.emoji} {key.charAt(0) + key.slice(1).toLowerCase()}: {count}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Consistent Strengths & Gaps */}
            <div className="or-sg-row mt-3">
              {or.consistent_strengths && or.consistent_strengths.length > 0 && (
                <div className="or-sg-box strength-box">
                  <div className="or-sg-title text-emerald">✅ Consistent Strengths</div>
                  <div className="chip-grid">
                    {or.consistent_strengths.map((s, i) => (
                      <span key={i} className="tag tag-emerald">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {or.identified_gaps && or.identified_gaps.length > 0 && (
                <div className="or-sg-box gap-box">
                  <div className="or-sg-title text-amber">⚠️ Identified Gaps</div>
                  <div className="chip-grid">
                    {or.identified_gaps.map((g, i) => (
                      <span key={i} className="tag tag-amber">{g}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Requirements Audit ── */}
        <div className="audit-grid mt-4">
          <div className="audit-card">
            <div className="audit-icon text-cyan"><CheckCircle2 size={20} /></div>
            <div>
              <div className="audit-val font-mono">{r.curriculum_coverage.total_questions_asked} Questions</div>
              <div className="audit-lbl">Min 8 Req. ({r.curriculum_coverage.min_questions_met ? 'Met ✅' : 'Failed ❌'})</div>
            </div>
          </div>
          <div className="audit-card">
            <div className="audit-icon text-violet"><Layers size={20} /></div>
            <div>
              <div className="audit-val font-mono">{r.curriculum_coverage.covered_days_count} Cohort Days</div>
              <div className="audit-lbl">Min 4 Days Req. ({r.curriculum_coverage.min_days_met ? 'Met ✅' : 'Failed ❌'})</div>
            </div>
          </div>
        </div>

        {/* ── Competency Metrics ── */}
        <div className="section-block mt-5">
          <h3 className="section-heading">
            <Star size={18} className="text-amber" />
            <span>Technical Competency Breakdown</span>
          </h3>
          <div className="metrics-grid">
            {[
              { label: 'Conceptual Depth', val: r.metrics.conceptual_depth, cls: 'fill-cyan', color: '#00F2FE' },
              { label: 'Trade-off Awareness', val: r.metrics.tradeoff_awareness, cls: 'fill-amber', color: '#F59E0B' },
              { label: 'Engineering Clarity', val: r.metrics.engineering_clarity, cls: 'fill-emerald', color: '#10B981' },
              { label: 'Production Realism', val: r.metrics.production_realism, cls: 'fill-violet', color: '#8B5CF6' },
            ].map(m => (
              <div className="metric-box" key={m.label}>
                <div className="metric-meta">
                  <span>{m.label}</span>
                  <span className="font-mono" style={{ color: m.color }}>{m.val}%</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${m.cls}`} style={{ width: `${m.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Strengths & Improvements ── */}
        <div className="columns-grid mt-5">
          <div className="column-card strength-card">
            <h4 className="column-title text-emerald">
              <CheckCircle2 size={18} />
              <span>Key Strengths</span>
            </h4>
            <ul className="bullet-list">
              {r.key_strengths.map((str, i) => <li key={i}>{str}</li>)}
            </ul>
          </div>
          <div className="column-card improve-card">
            <h4 className="column-title text-amber">
              <AlertTriangle size={18} />
              <span>Areas for Improvement</span>
            </h4>
            <ul className="bullet-list">
              {r.areas_for_improvement.map((imp, i) => <li key={i}>{imp}</li>)}
            </ul>
          </div>
        </div>

        {/* ── Topic Evaluation Table ── */}
        <div className="section-block mt-5">
          <h3 className="section-heading">
            <Layers size={18} className="text-cyan" />
            <span>Question-by-Question Evaluation Logs</span>
          </h3>
          <div className="table-responsive">
            <table className="eval-table">
              <thead>
                <tr>
                  <th>Q#</th>
                  <th>Day & Topic</th>
                  <th>Understanding Level</th>
                  <th>Response Preview</th>
                  <th>Score</th>
                  <th>Agent Notes</th>
                </tr>
              </thead>
              <tbody>
                {r.topic_evaluations.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-mono font-bold">Q{item.questionNumber}</td>
                    <td>
                      <span className="day-tag">Day {item.day}</span>
                      <div className="topic-name">{item.topic}</div>
                    </td>
                    <td>
                      <span
                        className="level-pill"
                        style={{ background: (item.levelColor || '#3B82F6') + '22', color: item.levelColor || '#3B82F6', borderColor: (item.levelColor || '#3B82F6') + '55' }}
                      >
                        {item.levelEmoji} {item.level}
                      </span>
                    </td>
                    <td className="response-snippet">"{item.candidateResponseSnippet}"</td>
                    <td>
                      <span className={`score-pill ${item.score >= 8 ? 'score-high' : item.score >= 6 ? 'score-mid' : 'score-low'}`}>
                        {typeof item.score === 'number' ? item.score.toFixed(1) : item.score}/10
                      </span>
                    </td>
                    <td className="eval-feedback">{item.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Actionable Next Steps ── */}
        <div className="next-steps-box mt-5">
          <h4 className="box-title text-cyan">
            <Sparkles size={18} />
            <span>Actionable Next Steps & Post-Cohort Growth Roadmap</span>
          </h4>
          <ol className="step-number-list">
            {r.actionable_next_steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>

      </div>
    </div>
  );
}
