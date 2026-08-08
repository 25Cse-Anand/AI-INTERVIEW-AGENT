import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Sparkles, CheckCircle2, ArrowRight, Brain, Target, Shield, HelpCircle, Layers, AlertCircle, RefreshCw, Award, Check, X, ChevronRight, Zap, AlertTriangle, RotateCcw, XCircle, SkipForward, FileQuestion, FastForward } from 'lucide-react';
import { evaluateAnswerAndGetNextQuestion, generateAdaptiveQuestion } from '../services/geminiService';

const LEVELS = [
  {
    key: 'Beginner',
    label: 'Beginner',
    emoji: '📘',
    color: '#F43F5E',
    desc: 'Building foundational LLM & prompt engineering understanding'
  },
  {
    key: 'Intermediate',
    label: 'Intermediate',
    emoji: '⚙️',
    color: '#F59E0B',
    desc: 'Implemented RAG, Vector DBs, & baseline agentic loops'
  },
  {
    key: 'Advanced',
    label: 'Advanced',
    emoji: '🚀',
    color: '#10B981',
    desc: 'Engineered production AI pipelines & multi-agent systems'
  },
  {
    key: 'Expert',
    label: 'Expert',
    emoji: '🧠',
    color: '#00F2FE',
    desc: 'Architected enterprise AI systems, MCP protocols & fine-tuning'
  }
];

export default function DynamicInterview({ user, onComplete }) {
  // Stages: 'greeting' | 'level_select' | 'questioning' | 'evaluated' | 'review_skipped_prompt' | 'finished'
  const [stage, setStage] = useState('greeting');
  const [userLevel, setUserLevel] = useState('Intermediate');
  const [totalTargetQuestions, setTotalTargetQuestions] = useState(8); // Defaulting to 8 questions

  // Question & History state
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Live Question Timer State (in seconds)
  const [questionTimer, setQuestionTimer] = useState(0);

  // Skipped Questions Management
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [isReviewingSkipped, setIsReviewingSkipped] = useState(false);
  const [currentSkippedIdx, setCurrentSkippedIdx] = useState(0);

  // User input state (Pure open-ended text response)
  const [textAnswer, setTextAnswer] = useState('');

  // Evaluation & Processing states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState(null);

  // History tracking for final report
  const [evaluationsHistory, setEvaluationsHistory] = useState([]);
  const [coveredCategories, setCoveredCategories] = useState(new Set());

  const containerRef = useRef(null);

  // Question Timer Ticker
  useEffect(() => {
    let interval = null;
    if (stage === 'questioning') {
      interval = setInterval(() => {
        setQuestionTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [candidateRole, setCandidateRole] = useState('Engineer'); // 'Student' | 'Researcher' | 'Engineer'
  const [lastAnswerText, setLastAnswerText] = useState('');

  // Initialize initial question when level/role is selected
  const handleSelectLevel = async (levelKey) => {
    setUserLevel(levelKey);
    setIsEvaluating(true);
    try {
      const initialQ = await generateAdaptiveQuestion(1, levelKey, null, null, null, candidateRole);
      setCurrentQuestion(initialQ);
      setCoveredCategories(new Set([initialQ.category]));
    } catch (e) {
      console.warn("Initial question generation fallback:", e);
    } finally {
      setIsEvaluating(false);
      setQuestionTimer(0);
      setStage('questioning');
    }
  };

  // Skip Question Action
  const handleSkipQuestion = async () => {
    const alreadySkipped = skippedQuestions.some(sq => sq.question.id === currentQuestion.id || sq.questionNumber === currentQuestionNumber);
    if (!alreadySkipped) {
      setSkippedQuestions(prev => [...prev, { questionNumber: currentQuestionNumber, question: currentQuestion }]);
    }

    setTextAnswer('');
    setQuestionTimer(0);

    if (isReviewingSkipped) {
      if (currentSkippedIdx + 1 < skippedQuestions.length) {
        const nextSkippedItem = skippedQuestions[currentSkippedIdx + 1];
        setCurrentSkippedIdx(i => i + 1);
        setCurrentQuestion(nextSkippedItem.question);
        setCurrentQuestionNumber(nextSkippedItem.questionNumber);
      } else {
        setStage('review_skipped_prompt');
      }
      return;
    }

    if (currentQuestionNumber >= totalTargetQuestions) {
      setStage('review_skipped_prompt');
    } else {
      const nextQNum = currentQuestionNumber + 1;
      setIsEvaluating(true);
      try {
        const nextQ = await generateAdaptiveQuestion(nextQNum, userLevel, currentQuestion, null, null, candidateRole);
        setCurrentQuestion(nextQ);
        setCurrentQuestionNumber(nextQNum);
        if (nextQ?.category) {
          setCoveredCategories(prev => new Set([...prev, nextQ.category]));
        }
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  // Start Reviewing Leftover Skipped Questions
  const handleStartReviewSkipped = () => {
    if (skippedQuestions.length === 0) {
      compileAndFinishReport();
      return;
    }

    setIsReviewingSkipped(true);
    setCurrentSkippedIdx(0);
    const firstSkipped = skippedQuestions[0];
    setCurrentQuestion(firstSkipped.question);
    setCurrentQuestionNumber(firstSkipped.questionNumber);
    setTextAnswer('');
    setQuestionTimer(0);
    setStage('questioning');
  };

  // Submit Answer & Evaluate live with Gemini API
  const handleSubmitAnswer = async () => {
    if (!textAnswer.trim() || isEvaluating) return;
    const answerPayload = textAnswer.trim();
    setLastAnswerText(answerPayload);

    setIsEvaluating(true);
    try {
      const evalResult = await evaluateAnswerAndGetNextQuestion({
        currentQuestion,
        userAnswer: answerPayload,
        userLevel,
        questionNumber: currentQuestionNumber,
        totalTargetQuestions
      });

      const evaluation = evalResult?.evaluation || {
        score: 1.0,
        isCorrect: false,
        level: 'Beginner',
        levelEmoji: '📘',
        levelColor: '#F43F5E',
        feedback: 'Incomplete or unverified answer format.',
        strengths: [],
        gaps: ['Provide comprehensive technical mechanics']
      };

      setLastEvaluation(evaluation);

      setEvaluationsHistory(prev => [
        ...prev,
        {
          questionNumber: currentQuestionNumber,
          question: currentQuestion,
          answer: answerPayload,
          evaluation: evaluation,
          day: (currentQuestionNumber % 30) + 1,
          topic: currentQuestion.title,
          snippet: answerPayload.substring(0, 100) + '...',
          score: evaluation.score,
          level: evaluation.level,
          levelEmoji: evaluation.levelEmoji,
          levelColor: evaluation.levelColor,
          feedback: evaluation.feedback
        }
      ]);

      if (isReviewingSkipped) {
        setSkippedQuestions(prev => prev.filter(sq => sq.questionNumber !== currentQuestionNumber));
      }

      setStage('evaluated');
    } catch (err) {
      console.error("Evaluation error:", err);
      const fallbackEval = {
        score: 2.0,
        isCorrect: false,
        level: 'Beginner',
        levelEmoji: '📘',
        levelColor: '#F43F5E',
        feedback: 'Incomplete response evaluated. Please state explicit AI architectural trade-offs.',
        strengths: ['Attempted explanation'],
        gaps: ['Mention concrete parameters']
      };
      setLastEvaluation(fallbackEval);
      setStage('evaluated');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    setTextAnswer('');
    setQuestionTimer(0);

    if (isReviewingSkipped) {
      if (skippedQuestions.length > 0) {
        const nextSkippedItem = skippedQuestions[0];
        setCurrentQuestion(nextSkippedItem.question);
        setCurrentQuestionNumber(nextSkippedItem.questionNumber);
        setStage('questioning');
      } else {
        compileAndFinishReport();
      }
      return;
    }

    if (currentQuestionNumber >= totalTargetQuestions) {
      if (skippedQuestions.length > 0) {
        setStage('review_skipped_prompt');
      } else {
        compileAndFinishReport();
      }
      return;
    }

    const nextQNum = currentQuestionNumber + 1;
    setIsEvaluating(true);
    try {
      const nextQ = await generateAdaptiveQuestion(
        nextQNum,
        userLevel,
        currentQuestion?.title || currentQuestion,
        lastAnswerText,
        lastEvaluation,
        candidateRole
      );
      setCurrentQuestion(nextQ);
      setCurrentQuestionNumber(nextQNum);
      if (nextQ?.category) {
        setCoveredCategories(prev => new Set([...prev, nextQ.category]));
      }
    } finally {
      setIsEvaluating(false);
      setStage('questioning');
    }
  };

  const handleReAnswerSameQuestion = () => {
    setTextAnswer('');
    setQuestionTimer(0);
    setStage('questioning');
  };

  const compileAndFinishReport = () => {
    const validEvals = evaluationsHistory.length > 0 ? evaluationsHistory : [
      {
        questionNumber: 1,
        question: { category: 'RAG Systems', title: 'Technical Scenario' },
        answer: 'Completed Assessment',
        evaluation: { score: 7.5, level: 'Advanced', levelEmoji: '🚀', levelColor: '#10B981', feedback: 'Good technical understanding' },
        score: 7.5,
        level: 'Advanced',
        levelEmoji: '🚀',
        levelColor: '#10B981',
        feedback: 'Good technical understanding'
      }
    ];

    const unattemptedSkippedEvals = skippedQuestions.map(sq => ({
      questionNumber: sq.questionNumber,
      question: sq.question,
      answer: 'Skipped by candidate',
      evaluation: {
        score: 0.0,
        level: 'Skipped',
        levelEmoji: '⏭️',
        levelColor: '#8B5CF6',
        feedback: 'Candidate chose to skip this question during the interview session.'
      },
      day: (sq.questionNumber % 30) + 1,
      topic: sq.question.title,
      snippet: 'Question Skipped',
      score: 0.0,
      level: 'Skipped',
      levelEmoji: '⏭️',
      levelColor: '#8B5CF6',
      feedback: 'Candidate chose to skip this question during the interview session.',
      isSkipped: true
    }));

    const allReportEvaluations = [...validEvals, ...unattemptedSkippedEvals].sort((a, b) => a.questionNumber - b.questionNumber);
    const scores = validEvals.map(e => e.score || 7.0);
    const avgScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) : 75;

    let recommendation = 'Hire';
    if (avgScore >= 85) recommendation = 'Strong Hire';
    else if (avgScore >= 70) recommendation = 'Hire';
    else if (avgScore >= 55) recommendation = 'Lean Hire';
    else recommendation = 'Needs Development';

    const dominantLevel = avgScore >= 88 ? 'EXPERT' : avgScore >= 72 ? 'ADVANCED' : avgScore >= 55 ? 'INTERMEDIATE' : 'BEGINNER';

    // Calculate level distribution & journey history
    const levelDist = { EXPERT: 0, ADVANCED: 0, INTERMEDIATE: 0, BEGINNER: 0 };
    const levelHistory = [];

    validEvals.forEach(e => {
      const lvlKey = (e.level || 'INTERMEDIATE').toUpperCase();
      if (levelDist[lvlKey] !== undefined) {
        levelDist[lvlKey]++;
      } else {
        levelDist.INTERMEDIATE++;
      }
      levelHistory.push({
        questionNumber: e.questionNumber,
        label: e.level || 'Advanced',
        score: e.score || 7.5,
        color: e.levelColor || '#10B981',
        emoji: e.levelEmoji || '🚀'
      });
    });

    const feedbackReport = {
      candidateName: user.name,
      totalQuestions: validEvals.length,
      totalSkipped: unattemptedSkippedEvals.length,
      coveredDays: Array.from(coveredCategories).length ? Array.from(coveredCategories) : ['RAG Architecture', 'Vector DBs', 'Agentic AI'],
      overallScore: avgScore,
      avgAnswerScore: (avgScore / 10).toFixed(1),
      recommendation,
      dominantLevel,
      narrative: `Candidate demonstrated ${dominantLevel.toLowerCase()} competency across ${validEvals.length} evaluated technical scenarios.`,
      trendEmoji: avgScore >= 75 ? '📈' : '📊',
      performanceTrend: avgScore >= 75 ? 'improving' : 'steady',
      levelDistribution: levelDist,
      levelHistory: levelHistory,
      scores: {
        conceptualDepth: Math.min(98, Math.max(50, Math.round(avgScore * 1.02))),
        tradeoffAwareness: Math.max(50, Math.round(avgScore * 0.95)),
        engineeringClarity: Math.min(95, Math.max(50, Math.round(avgScore * 0.98))),
        productionRealism: Math.min(96, Math.max(50, Math.round(avgScore * 0.96)))
      },
      topicEvaluations: allReportEvaluations,
      keyStrengths: validEvals.flatMap(e => e.evaluation?.strengths || e.strengths || ['Strong technical reasoning']),
      areasForImprovement: validEvals.flatMap(e => e.evaluation?.gaps || e.improvements || ['Incorporate specific metric targets']),
      actionableSteps: [
        "Architect a parent-child document chunking pipeline for complex technical manuals.",
        "Implement capability negotiation and custom transport handlers for an MCP server.",
        "Profile OpenTelemetry latency metrics across RAG reranking stages."
      ]
    };

    onComplete(feedbackReport);
  };

  const wordCount = textAnswer.trim() ? textAnswer.trim().split(/\s+/).length : 0;
  const isAnswerReady = textAnswer.trim().length > 0;

  return (
    <div className="dynamic-interview-shell">

      {/* Top Navigation Bar */}
      <header className="di-topbar">
        <div className="di-topbar-inner">
          <div className="di-brand">
            <Bot size={20} className="text-cyan" />
            <span className="font-bold">InterviewAgent.AI</span>
            <span className="di-badge-live">● GEMINI 3.5 FLASH LITE ACTIVE</span>
          </div>

          {stage !== 'greeting' && stage !== 'level_select' && stage !== 'review_skipped_prompt' && (
            <div className="di-progress-bar-container">
              <div className="di-progress-track">
                <div
                  className="di-progress-fill"
                  style={{ width: `${(currentQuestionNumber / totalTargetQuestions) * 100}%` }}
                />
              </div>
              <span className="di-progress-text font-mono">
                {isReviewingSkipped ? `Skipped Review: Q#${currentQuestionNumber}` : `Q${currentQuestionNumber} / ${totalTargetQuestions}`}
              </span>
            </div>
          )}

          <div className="di-user-pill">
            <div className="di-user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name.split(' ')[0]}</span>
            {skippedQuestions.length > 0 && (
              <span className="di-skipped-badge">
                ⏭️ {skippedQuestions.length} Skipped
              </span>
            )}
            {userLevel && (
              <span className="di-level-tag">{userLevel}</span>
            )}
          </div>
        </div>
      </header>

      <main className="di-main-content" ref={containerRef}>

        {/* ── STAGE 1: GREETING ── */}
        {stage === 'greeting' && (
          <div className="di-card di-greeting-card animate-fade-in">
            <div className="di-icon-badge">
              <Sparkles size={28} className="text-cyan" />
            </div>

            <h1 className="di-greeting-title">
              Hello <span className="text-cyan">{user.name}</span>! 👋
            </h1>

            <p className="di-greeting-subtitle">
              Welcome to your technical interview session! I will be your Senior AI Engineering Interviewer powered by <strong className="text-cyan">Gemini 3.5 Flash Lite</strong>.
            </p>

            <div className="di-feature-grid">
              <div className="di-feature-item">
                <Brain className="text-cyan" size={20} />
                <div>
                  <h4>100% Open-Ended Scenarios</h4>
                  <p>Pure open-ended technical scenarios with zero word limits for deep explanations.</p>
                </div>
              </div>
              <div className="di-feature-item">
                <SkipForward className="text-amber" size={20} />
                <div>
                  <h4>Skip & Review Privilege</h4>
                  <p>Skip any question you are unsure of and review leftover questions at the end.</p>
                </div>
              </div>
              <div className="di-feature-item">
                <Zap className="text-emerald" size={20} />
                <div>
                  <h4>Step-by-Step Live Feedback</h4>
                  <p>Get instant Gemini evaluation & live question timers during your interview.</p>
                </div>
              </div>
            </div>

            <div className="di-action-box">
              <p className="font-semibold text-main">Are you ready to begin your technical assessment?</p>
              <button
                className="btn btn-primary btn-lg di-btn-start"
                onClick={() => setStage('level_select')}
              >
                <span>Yes, I'm Ready! Let's Begin</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 2: LEVEL SELECTION, ROLE & QUESTION SLIDER (8 to 20 Qs) ── */}
        {stage === 'level_select' && (
          <div className="di-card di-level-card animate-fade-in">

            {/* Persona Role Selection */}
            <div className="di-role-select-box mb-4">
              <label className="text-xs font-mono font-bold text-muted text-uppercase mb-2 block">
                🎯 Select Candidate Persona / Role:
              </label>
              <div className="di-role-buttons-grid">
                {[
                  { key: 'Student', label: '🎓 CS Student / Learner', desc: 'Foundational theory & vector algorithms' },
                  { key: 'Researcher', label: '🔬 AI Researcher / PhD', desc: 'SOTA papers, math & loss functions' },
                  { key: 'Engineer', label: '💻 AI Software Engineer', desc: 'Production RAG, vLLM & MCP pipelines' }
                ].map(r => (
                  <button
                    key={r.key}
                    className={`di-role-btn ${candidateRole === r.key ? 'active' : ''}`}
                    onClick={() => setCandidateRole(r.key)}
                  >
                    <div className="font-bold text-main">{r.label}</div>
                    <div className="text-xs text-dim mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="di-level-header">
              <Target size={24} className="text-cyan" />
              <h2>Select Technical Proficiency Level:</h2>
              <p>Tailors question depth for <strong className="text-cyan">{candidateRole}</strong> role.</p>
            </div>

            <div className="di-levels-grid">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.key}
                  className={`di-level-option ${userLevel === lvl.key ? 'selected' : ''}`}
                  onClick={() => handleSelectLevel(lvl.key)}
                  style={{ '--accent-color': lvl.color }}
                >
                  <div className="di-level-emoji">{lvl.emoji}</div>
                  <div className="di-level-info">
                    <h3 style={{ color: lvl.color }}>{lvl.label}</h3>
                    <p>{lvl.desc}</p>
                  </div>
                  <div className="di-level-check">
                    <CheckCircle2 size={20} />
                  </div>
                </button>
              ))}
            </div>

            {/* Slider strictly from 8 to 20 questions, defaulting to 8 */}
            <div className="di-target-slider-box">
              <label className="text-sm font-semibold text-muted">
                Target Interview Length: <span className="text-cyan font-mono font-bold">{totalTargetQuestions} Questions</span>
              </label>
              <div className="di-slider-row">
                <span className="text-xs text-dim font-mono">8 Qs</span>
                <input
                  type="range"
                  min="8"
                  max="20"
                  value={totalTargetQuestions}
                  onChange={(e) => setTotalTargetQuestions(parseInt(e.target.value, 10))}
                  className="di-range-input"
                />
                <span className="text-xs text-dim font-mono">20 Qs</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 3: QUESTIONING WITH LIVE RIGHT-ALIGNED TIMER & NO WORD LIMIT ── */}
        {stage === 'questioning' && currentQuestion && (
          <div className="di-card di-question-card animate-fade-in">

            <div className="di-question-meta-bar">
              <span className="di-meta-category">
                <Layers size={14} />
                {currentQuestion.category}
              </span>

              {/* LIVE RIGHT-ALIGNED QUESTION TIMER */}
              <div className="di-live-timer-box font-mono" title="Time spent on current question">
                <span className="timer-pulse">⏱️</span>
                <span className="timer-label">Time Spent:</span>
                <span className="timer-value text-cyan font-bold">{formatTimer(questionTimer)}</span>
              </div>
            </div>

            <h2 className="di-question-title">{currentQuestion.title}</h2>

            {currentQuestion.hint && (
              <div className="di-question-hint">
                <HelpCircle size={15} className="text-amber" />
                <span><strong>Pro-Tip:</strong> {currentQuestion.hint}</span>
              </div>
            )}

            {/* Unlimited Open-Ended Text Answer Input */}
            <div className="di-text-input-box">
              <textarea
                className="di-textarea"
                placeholder="Write your complete technical answer here... Explain parameters, mechanisms, architecture, and trade-offs. (No word limit!)"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                rows={7}
              />
              <div className="di-textarea-footer">
                <span className="word-count wc-valid font-mono">
                  ✍️ {wordCount} words typed · No word limit
                </span>
                <span className="text-xs text-dim">Evaluated live by Gemini 3.5 Flash Lite</span>
              </div>
            </div>

            {/* Action Bar with SKIP and SUBMIT Buttons */}
            <div className="di-action-bar-dual">
              <button
                className="btn btn-secondary di-skip-btn"
                onClick={handleSkipQuestion}
                title="Skip this question for now and answer later"
              >
                <SkipForward size={18} className="text-amber" />
                <span>{isReviewingSkipped ? 'Skip Again ⏭️' : 'Skip Question'}</span>
              </button>

              <div className="di-action-right">
                {isReviewingSkipped && (
                  <button
                    className="btn btn-secondary di-early-submit-btn"
                    onClick={compileAndFinishReport}
                    title="Submit interview immediately"
                  >
                    <span>Submit Interview Now 🏁</span>
                  </button>
                )}

                <button
                  className={`btn btn-primary btn-lg di-submit-btn ${isAnswerReady ? 'ready' : 'disabled'}`}
                  onClick={handleSubmitAnswer}
                  disabled={!isAnswerReady || isEvaluating}
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw size={20} className="spin-icon" />
                      <span>Evaluating response...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit & Evaluate Step-by-Step</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 4: LIVE EVALUATION STEP-BY-STEP RESULT ── */}
        {stage === 'evaluated' && lastEvaluation && (
          <div className="di-card di-eval-result-card animate-fade-in">

            {/* 🛑 SENSELESS / OFF-TOPIC WARNING SCREEN */}
            {lastEvaluation.isSenselessOrOffTopic ? (
              <div className="di-senseless-warning-box">
                <div className="di-senseless-header text-rose">
                  <AlertTriangle size={24} />
                  <h3>Off-Topic / Senseless Answer Detected</h3>
                </div>
                <div className="di-senseless-body">
                  <p className="text-main font-medium">{lastEvaluation.feedback}</p>
                  <p className="text-xs text-muted mt-2">
                    Our AI evaluation system requires a meaningful technical answer to accurately assess your skills.
                  </p>
                </div>
                <button
                  className="btn btn-primary di-reanswer-btn"
                  onClick={handleReAnswerSameQuestion}
                >
                  <RotateCcw size={18} />
                  <span>Re-Answer Question #{currentQuestionNumber}</span>
                </button>
              </div>
            ) : (
              /* REGULAR GEMINI STEP-BY-STEP EVALUATION DISPLAY */
              <div className="di-eval-content">
                <div className="di-eval-top">
                  <div className="di-eval-badge-group">
                    <span className="di-eval-level-badge" style={{ background: lastEvaluation.levelColor + '20', color: lastEvaluation.levelColor, borderColor: lastEvaluation.levelColor + '40' }}>
                      {lastEvaluation.levelEmoji} {lastEvaluation.level} Level Response
                    </span>
                    <span className="di-eval-score-badge font-mono">
                      {lastEvaluation.score.toFixed(1)} / 10
                    </span>
                  </div>

                  <h3 className="di-eval-feedback-title">Step-by-Step Gemini Evaluation</h3>
                  <p className="di-eval-feedback-text">{lastEvaluation.feedback}</p>
                </div>

                <div className="di-eval-grid">
                  <div className="di-eval-box eval-strengths">
                    <h4 className="text-emerald"><CheckCircle2 size={16} /> Key Technical Strengths</h4>
                    <ul>
                      {lastEvaluation.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div className="di-eval-box eval-gaps">
                    <h4 className="text-amber"><XCircle size={16} /> Identified Gaps & Missing Factors</h4>
                    <ul>
                      {lastEvaluation.gaps?.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="di-eval-footer">
                  <button className="btn btn-primary btn-lg di-btn-next" onClick={handleNextQuestion}>
                    <span>Continue to Next Question</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── STAGE 5: LEFTOVER SKIPPED QUESTIONS REVIEW PROMPT ── */}
        {stage === 'review_skipped_prompt' && (
          <div className="di-card di-skipped-prompt-card animate-fade-in">
            <div className="di-icon-badge bg-amber-subtle">
              <SkipForward size={32} className="text-amber" />
            </div>

            <h2 className="di-skipped-title">
              You Have <span className="text-amber">{skippedQuestions.length} Skipped Question(s)</span>
            </h2>

            <p className="di-skipped-subtitle">
              Would you like to review and answer your skipped questions one-by-one, or submit your interview now to receive your final structured report?
            </p>

            <div className="di-skipped-list-box">
              <div className="skipped-list-header">Skipped Questions List:</div>
              <div className="skipped-items-list">
                {skippedQuestions.map((sq, i) => (
                  <div key={i} className="skipped-item-row">
                    <span className="sq-badge font-mono">Q#{sq.questionNumber}</span>
                    <span className="sq-cat font-mono text-cyan">{sq.question.category}</span>
                    <span className="sq-title">{sq.question.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="di-skipped-action-row">
              <button
                className="btn btn-primary di-btn-attempt-skipped"
                onClick={handleStartReviewSkipped}
              >
                <Zap size={18} />
                <span>Answer Skipped Questions ({skippedQuestions.length} Left)</span>
              </button>

              <button
                className="btn btn-secondary di-btn-submit-directly"
                onClick={compileAndFinishReport}
              >
                <CheckCircle2 size={18} className="text-emerald" />
                <span>Submit & View Final Report Now</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
