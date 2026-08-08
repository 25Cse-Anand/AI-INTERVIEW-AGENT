import React, { useEffect } from 'react';
import { Award, CheckCircle2, XCircle, Clock, BookOpen, BarChart2, ArrowRight, Sparkles, RotateCcw, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UNDERSTANDING_LEVELS } from '../services/interviewEngine';

export default function QuizResults({ result, onRestart }) {
  const { user, answers, totalTime, questions } = result;

  // Calculate stats
  const mcqQuestions = questions.filter(q => q.type === 'mcq');
  const textQuestions = questions.filter(q => q.type === 'text');
  const mcqAnswers = mcqQuestions.map(q => answers[q.id]).filter(Boolean);
  const textAnswers = textQuestions.map(q => answers[q.id]).filter(Boolean);

  const correctCount = mcqAnswers.filter(a => a.isCorrect).length;
  const mcqAccuracy = mcqQuestions.length > 0 ? Math.round((correctCount / mcqQuestions.length) * 100) : 0;
  const avgWordCount = textAnswers.length > 0
    ? Math.round(textAnswers.reduce((s, a) => s + (a.wordCount || 0), 0) / textAnswers.length)
    : 0;

  const totalMinutes = Math.floor(totalTime / 60);
  const totalSeconds = totalTime % 60;

  // Overall score (mcq accuracy 60% + text quality 40%)
  const textScore = Math.min(100, Math.round((avgWordCount / 50) * 100)); // 50+ words = max
  const overallScore = Math.round(mcqAccuracy * 0.6 + textScore * 0.4);

  // Determine level
  let levelKey = 'BEGINNER';
  if (overallScore >= 85) levelKey = 'EXPERT';
  else if (overallScore >= 68) levelKey = 'ADVANCED';
  else if (overallScore >= 45) levelKey = 'INTERMEDIATE';
  const level = UNDERSTANDING_LEVELS[levelKey];

  // Category performance breakdown
  const categoryScores = {};
  questions.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    if (!categoryScores[q.category]) categoryScores[q.category] = { color: q.categoryColor, scores: [] };
    if (ans.type === 'mcq') {
      categoryScores[q.category].scores.push(ans.isCorrect ? 100 : 0);
    } else {
      categoryScores[q.category].scores.push(Math.min(100, Math.round(((ans.wordCount || 0) / 40) * 100)));
    }
  });

  const categoryResults = Object.entries(categoryScores).map(([cat, data]) => ({
    category: cat,
    color: data.color,
    score: Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length)
  }));

  useEffect(() => {
    if (overallScore >= 70) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.55 } });
    }
  }, []);

  const recommendations = {
    EXPERT: [
      "You're ready for advanced RAG architecture and production AI system design roles.",
      "Explore building custom MCP servers and deploying vLLM clusters at scale.",
      "Consider contributing to open-source AI tooling in the cohort ecosystem."
    ],
    ADVANCED: [
      "Deep-dive into Corrective RAG (CRAG) and Self-RAG adaptive pipelines.",
      "Build a full LangGraph multi-agent system with human-in-the-loop checkpoints.",
      "Practice explaining system trade-offs using quantitative latency benchmarks."
    ],
    INTERMEDIATE: [
      "Re-visit Days 6–12 (Vector DBs & RAG pipelines) with a hands-on project.",
      "Build a small ReAct agent from scratch using raw Python — no frameworks.",
      "Focus on understanding HNSW indexing and BM25 hybrid search parameters."
    ],
    BEGINNER: [
      "Start from Day 1 — Transformer mechanics and tokenization fundamentals.",
      "Complete all daily missions before moving to the next module.",
      "Use the #ABtalks card game prompts daily to build learning habits."
    ]
  };

  return (
    <div className="results-shell animate-fade-in">
      <div className="results-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${level.color}18 0%, transparent 60%)` }} />

      <div className="results-container">
        {/* Header Hero */}
        <div className="results-hero">
          <div className="results-level-glow" style={{ color: level.color }}>
            <span className="results-emoji">{level.emoji}</span>
          </div>
          <div>
            <div className="results-greeting">
              Great work, <strong>{user.name.split(' ')[0]}!</strong> Your assessment is complete.
            </div>
            <div
              className="results-level-title"
              style={{ color: level.color }}
            >
              {level.label} Level
            </div>
            <p className="results-level-desc">{level.description}</p>
          </div>

          <div className="results-score-ring" style={{ borderColor: level.color + '66', boxShadow: `0 0 30px ${level.color}33` }}>
            <div className="results-score-num font-mono" style={{ color: level.color }}>
              {overallScore}
            </div>
            <div className="results-score-lbl">/ 100</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="results-stats-row">
          <div className="results-stat-card">
            <CheckCircle2 size={22} className="text-emerald" />
            <div className="rsc-val font-mono">{correctCount}/{mcqQuestions.length}</div>
            <div className="rsc-lbl">MCQ Correct</div>
            <div className="mini-progress-track">
              <div className="mini-progress-fill" style={{ width: `${mcqAccuracy}%`, background: '#10B981' }} />
            </div>
          </div>

          <div className="results-stat-card">
            <BookOpen size={22} className="text-violet" />
            <div className="rsc-val font-mono">{avgWordCount}</div>
            <div className="rsc-lbl">Avg Words (Open Q)</div>
            <div className="mini-progress-track">
              <div className="mini-progress-fill" style={{ width: `${Math.min(100, (avgWordCount / 60) * 100)}%`, background: '#8B5CF6' }} />
            </div>
          </div>

          <div className="results-stat-card">
            <BarChart2 size={22} className="text-cyan" />
            <div className="rsc-val font-mono">{mcqAccuracy}%</div>
            <div className="rsc-lbl">MCQ Accuracy</div>
            <div className="mini-progress-track">
              <div className="mini-progress-fill" style={{ width: `${mcqAccuracy}%`, background: '#00F2FE' }} />
            </div>
          </div>

          <div className="results-stat-card">
            <Clock size={22} className="text-amber" />
            <div className="rsc-val font-mono">{totalMinutes}m {totalSeconds}s</div>
            <div className="rsc-lbl">Total Time</div>
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <div className="results-section mt-4">
          <h3 className="results-section-title">
            <Brain size={18} className="text-cyan" />
            <span>Question-by-Question Breakdown</span>
          </h3>

          <div className="qna-review-list">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              const isMcq = q.type === 'mcq';
              const isCorrect = isMcq ? ans?.isCorrect : null;

              return (
                <div key={q.id} className={`qna-item ${isMcq ? (isCorrect ? 'qna-correct' : 'qna-wrong') : 'qna-text'}`}>
                  <div className="qna-left">
                    <div className="qna-num font-mono">Q{idx + 1}</div>
                    {isMcq
                      ? (isCorrect
                          ? <CheckCircle2 size={18} className="text-emerald" />
                          : <XCircle size={18} className="text-danger" />)
                      : <BookOpen size={18} className="text-violet" />
                    }
                  </div>

                  <div className="qna-body">
                    <div className="qna-q-text">{q.question}</div>

                    {isMcq && (
                      <div className="qna-mcq-result">
                        <span className={`ans-pill ${isCorrect ? 'ans-correct' : 'ans-wrong'}`}>
                          Your answer: {q.options[ans?.value]}
                        </span>
                        {!isCorrect && (
                          <span className="ans-pill ans-correct ml-2">
                            Correct: {q.options[q.correctIndex]}
                          </span>
                        )}
                      </div>
                    )}

                    {!isMcq && ans?.value && (
                      <div className="qna-text-preview">
                        "{ans.value.substring(0, 140)}{ans.value.length > 140 ? '...' : ''}"
                        <span className="font-mono" style={{ color: '#8B5CF6', marginLeft: '0.5rem' }}>
                          ({ans.wordCount} words)
                        </span>
                      </div>
                    )}

                    {isMcq && q.explanation && (
                      <div className="qna-explanation">{q.explanation}</div>
                    )}
                  </div>

                  <div className="qna-cat-tag" style={{ color: q.categoryColor }}>
                    {q.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Performance */}
        <div className="results-section mt-4">
          <h3 className="results-section-title">
            <BarChart2 size={18} className="text-amber" />
            <span>Topic Category Performance</span>
          </h3>
          <div className="cat-perf-list">
            {categoryResults.map((c, i) => (
              <div key={i} className="cat-perf-row">
                <div className="cat-name" style={{ color: c.color }}>{c.category}</div>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: `${c.score}%`, background: c.color }} />
                </div>
                <div className="cat-score font-mono" style={{ color: c.color }}>{c.score}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="results-section mt-4">
          <h3 className="results-section-title">
            <Sparkles size={18} className="text-cyan" />
            <span>Recommended Next Steps for {user.name.split(' ')[0]}</span>
          </h3>
          <div className="rec-list">
            {recommendations[levelKey].map((r, i) => (
              <div key={i} className="rec-item">
                <span className="rec-num" style={{ background: level.color + '22', color: level.color }}>{i + 1}</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="results-cta-row mt-4">
          <button className="btn btn-secondary" onClick={onRestart}>
            <RotateCcw size={16} />
            <span>Retake Assessment</span>
          </button>
          <button className="btn btn-primary btn-lg">
            <span>Explore Full AI Interview</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
