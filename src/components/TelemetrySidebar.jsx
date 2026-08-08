import React from 'react';
import { Target, CalendarCheck2, ShieldCheck, Activity, Award, HelpCircle, Zap, Brain, TrendingUp } from 'lucide-react';
import { UNDERSTANDING_LEVELS } from '../services/interviewEngine';

export default function TelemetrySidebar({ sessionState, onShowFeedback }) {
  const {
    questionNumber, minQuestionsRequired, coveredDaysList, scores,
    currentPhase, isComplete, topicEvaluations, currentLevel, levelHistory
  } = sessionState;

  const questionProgress = Math.min(100, Math.round(((questionNumber - 1) / minQuestionsRequired) * 100));
  const daysProgress = Math.min(100, Math.round((coveredDaysList.length / 4) * 100));

  // Compute level distribution bar widths
  const totalAnswers = (levelHistory || []).length;
  const levelCounts = { EXPERT: 0, ADVANCED: 0, INTERMEDIATE: 0, BEGINNER: 0 };
  (levelHistory || []).forEach(l => { if (l.key) levelCounts[l.key]++; });

  return (
    <aside className="telemetry-sidebar">

      {/* Live Level Assessment Card — NEW */}
      {currentLevel && (
        <div
          className="telemetry-card level-card mb-3"
          style={{ borderColor: currentLevel.color + '55', boxShadow: `0 0 18px ${currentLevel.color}18` }}
        >
          <h3 className="card-title" style={{ color: currentLevel.color }}>
            <Brain size={18} />
            <span>Last Response Level</span>
          </h3>

          <div className="level-badge-row">
            <span className="level-emoji">{currentLevel.emoji}</span>
            <div>
              <div className="level-label-big" style={{ color: currentLevel.color }}>
                {currentLevel.label}
              </div>
              <div className="level-score-line font-mono">
                Score: <strong>{currentLevel.score}</strong>/10 &nbsp;·&nbsp; {currentLevel.wordCount} words
              </div>
            </div>
          </div>

          <p className="level-summary">{currentLevel.agentSummary}</p>

          {currentLevel.signals && currentLevel.signals.length > 0 && (
            <div className="signals-box">
              <div className="sub-label">✅ Detected signals:</div>
              <div className="chip-grid">
                {currentLevel.signals.map((s, i) => (
                  <span key={i} className="signal-chip" style={{ borderColor: currentLevel.color + '55', color: currentLevel.color }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Milestones */}
      <div className="telemetry-card main-stats-card">
        <h3 className="card-title">
          <Activity size={18} className="text-cyan" />
          <span>Interview Telemetry</span>
        </h3>

        <div className="milestone-box">
          <div className="milestone-header">
            <span className="milestone-name">
              <HelpCircle size={15} className="text-cyan" /> Questions Asked
            </span>
            <span className="milestone-val font-mono">
              {questionNumber - 1} / {minQuestionsRequired} (Min)
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill fill-cyan" style={{ width: `${questionProgress}%` }}></div>
          </div>
          {questionNumber - 1 >= minQuestionsRequired && (
            <div className="milestone-met text-emerald">
              <ShieldCheck size={14} /> Requirement Met (8+ Questions)
            </div>
          )}
        </div>

        <div className="milestone-box mt-3">
          <div className="milestone-header">
            <span className="milestone-name">
              <CalendarCheck2 size={15} className="text-violet" /> Curriculum Days Covered
            </span>
            <span className="milestone-val font-mono">
              {coveredDaysList.length} / 4 (Min)
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill fill-violet" style={{ width: `${daysProgress}%` }}></div>
          </div>
          {coveredDaysList.length >= 4 && (
            <div className="milestone-met text-emerald">
              <ShieldCheck size={14} /> Requirement Met (4+ Days)
            </div>
          )}
        </div>

        <div className="covered-days-box mt-3">
          <div className="sub-label">Covered Cohort Days:</div>
          <div className="chip-grid">
            {coveredDaysList.map((dayNum) => (
              <span key={dayNum} className="day-chip">Day {dayNum}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Level History Mini-Sparkline */}
      {levelHistory && levelHistory.length > 0 && (
        <div className="telemetry-card mt-3">
          <h4 className="card-title-sm">
            <TrendingUp size={15} className="text-amber" />
            <span>Level History per Question</span>
          </h4>
          <div className="level-sparkline">
            {levelHistory.map((l, i) => (
              <div
                key={i}
                className="spark-bar"
                style={{
                  height: `${(l.score / 10) * 100}%`,
                  background: l.color,
                  boxShadow: `0 0 6px ${l.color}88`
                }}
                title={`Q${l.questionNumber}: ${l.label} (${l.score}/10)`}
              >
                <span className="spark-q">Q{l.questionNumber}</span>
              </div>
            ))}
          </div>

          {/* Level Distribution */}
          {totalAnswers > 0 && (
            <div className="level-dist-bar mt-2">
              {Object.entries(UNDERSTANDING_LEVELS).map(([key, lvl]) => {
                const pct = totalAnswers > 0 ? Math.round((levelCounts[key] / totalAnswers) * 100) : 0;
                return pct > 0 ? (
                  <div
                    key={key}
                    className="dist-segment"
                    style={{ width: `${pct}%`, background: lvl.color }}
                    title={`${lvl.label}: ${pct}%`}
                  />
                ) : null;
              })}
            </div>
          )}

          <div className="dist-legend mt-1">
            {Object.entries(UNDERSTANDING_LEVELS).map(([key, lvl]) => (
              levelCounts[key] > 0 && (
                <span key={key} className="dist-legend-item" style={{ color: lvl.color }}>
                  {lvl.emoji} {lvl.label}: {levelCounts[key]}
                </span>
              )
            ))}
          </div>
        </div>
      )}

      {/* Competency Gauges */}
      <div className="telemetry-card competency-card mt-3">
        <h4 className="card-title-sm">
          <Target size={16} className="text-amber" />
          <span>Competency Evaluation</span>
        </h4>

        {[
          { label: 'Conceptual Depth', val: scores.conceptualDepth, cls: 'fill-cyan', colorCls: 'text-cyan' },
          { label: 'Trade-off Awareness', val: scores.tradeoffAwareness, cls: 'fill-amber', colorCls: 'text-amber' },
          { label: 'Engineering Clarity', val: scores.engineeringClarity, cls: 'fill-emerald', colorCls: 'text-emerald' },
          { label: 'Production Realism', val: scores.productionRealism, cls: 'fill-violet', colorCls: 'text-violet' },
        ].map(m => (
          <div className="meter-group" key={m.label}>
            <div className="meter-row">
              <span>{m.label}</span>
              <span className={`font-mono ${m.colorCls}`}>{m.val || 0}%</span>
            </div>
            <div className="progress-track">
              <div className={`progress-fill ${m.cls}`} style={{ width: `${m.val || 0}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Stream Log */}
      <div className="telemetry-card logs-card mt-3">
        <h4 className="card-title-sm">
          <Zap size={15} className="text-emerald" />
          <span>Live Evaluation Stream</span>
        </h4>
        <div className="log-list">
          {(topicEvaluations || []).slice(-4).reverse().map((ev, i) => (
            <div key={i} className="log-item" style={{ borderLeftColor: ev.levelColor || '#00F2FE' }}>
              <div className="log-meta">
                <span className="log-q font-mono">
                  Q{ev.questionNumber} · Day {ev.day}
                </span>
                <span style={{ color: ev.levelColor || '#10B981', fontSize: '0.72rem', fontWeight: 700 }}>
                  {ev.levelEmoji} {ev.level} ({ev.score?.toFixed(1)}/10)
                </span>
              </div>
              <p className="log-text">{ev.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {isComplete && (
        <button className="btn btn-primary btn-block btn-lg mt-3 animate-pulse" onClick={onShowFeedback}>
          <Award size={18} />
          <span>View Final Feedback Report</span>
        </button>
      )}
    </aside>
  );
}
