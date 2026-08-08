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
  const [totalTargetQuestions, setTotalTargetQuestions] = useState(12);

  // Question & History state
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Skipped Questions Management
  const [skippedQuestions, setSkippedQuestions] = useState([]); // [{ questionNumber, question }]
  const [isReviewingSkipped, setIsReviewingSkipped] = useState(false);
  const [currentSkippedIdx, setCurrentSkippedIdx] = useState(0);

  // User input state
  const [selectedMcqIdx, setSelectedMcqIdx] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');

  // Evaluation & Processing states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState(null);

  // History tracking for final report
  const [questionHistory, setQuestionHistory] = useState([]);
  const [evaluationsHistory, setEvaluationsHistory] = useState([]);
  const [coveredCategories, setCoveredCategories] = useState(new Set());

  const containerRef = useRef(null);

  // Initialize initial question when level is selected
  const handleSelectLevel = (levelKey) => {
    setUserLevel(levelKey);
    const initialQ = generateAdaptiveQuestion(1, 'mcq', null, 7.0);
    setCurrentQuestion(initialQ);
    setCoveredCategories(new Set([initialQ.category]));
    setStage('questioning');
  };

  // Skip Question Action
  const handleSkipQuestion = () => {
    // Save to skipped questions list if not already present
    const alreadySkipped = skippedQuestions.some(sq => sq.question.id === currentQuestion.id || sq.questionNumber === currentQuestionNumber);
    if (!alreadySkipped) {
      setSkippedQuestions(prev => [...prev, { questionNumber: currentQuestionNumber, question: currentQuestion }]);
    }

    setSelectedMcqIdx(null);
    setTextAnswer('');

    // If reviewing leftover skipped questions
    if (isReviewingSkipped) {
      if (currentSkippedIdx + 1 < skippedQuestions.length) {
        const nextSkippedItem = skippedQuestions[currentSkippedIdx + 1];
        setCurrentSkippedIdx(i => i + 1);
        setCurrentQuestion(nextSkippedItem.question);
        setCurrentQuestionNumber(nextSkippedItem.questionNumber);
      } else {
        // Reached end of skipped list review
        setStage('review_skipped_prompt');
      }
      return;
    }

    // Normal interview run
    if (currentQuestionNumber >= totalTargetQuestions) {
      // Check if we have skipped questions remaining to review
      setStage('review_skipped_prompt');
    } else {
      // Generate next dynamic question
      const nextQNum = currentQuestionNumber + 1;
      const nextType = nextQNum % 2 === 1 ? 'mcq' : 'text';
      const nextQ = generateAdaptiveQuestion(nextQNum, nextType, null, 7.0);
      setCurrentQuestion(nextQ);
      setCurrentQuestionNumber(nextQNum);
      if (nextQ?.category) {
        setCoveredCategories(prev => new Set([...prev, nextQ.category]));
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
    setSelectedMcqIdx(null);
    setTextAnswer('');
    setStage('questioning');
  };

  // Submit Answer & Evaluate live with Gemini API
  const handleSubmitAnswer = async () => {
    let answerPayload = '';
    if (currentQuestion.type === 'mcq') {
      if (selectedMcqIdx === null) return;
      answerPayload = selectedMcqIdx.toString();
    } else {
      if (!textAnswer.trim()) return;
      answerPayload = textAnswer.trim();
    }

    setIsEvaluating(true);

    try {
      const evalResult = await evaluateAnswerAndGetNextQuestion({
        userLevel,
        currentQuestion,
        userAnswer: answerPayload,
        questionHistory,
        questionNumber: currentQuestionNumber,
        totalTargetQuestions
      });

      const { evaluation, nextQuestion } = evalResult;
      setLastEvaluation(evaluation);

      // If answer is valid & meaningful, add to history
      if (!evaluation.isSenselessOrOffTopic) {
        const historyEntry = {
          questionNumber: currentQuestionNumber,
          question: currentQuestion,
          answer: currentQuestion.type === 'mcq' ? currentQuestion.options[selectedMcqIdx] : answerPayload,
          evaluation,
          day: (currentQuestionNumber % 30) + 1,
          topic: currentQuestion.title,
          snippet: currentQuestion.type === 'mcq'
            ? `Selected: ${currentQuestion.options[selectedMcqIdx]}`
            : (answerPayload.substring(0, 100) + '...'),
          score: evaluation.score,
          level: evaluation.level,
          levelEmoji: evaluation.levelEmoji,
          levelColor: evaluation.levelColor,
          feedback: evaluation.feedback
        };

        setQuestionHistory(prev => [...prev, currentQuestion]);
        setEvaluationsHistory(prev => [...prev, historyEntry]);

        // Remove from skippedQuestions list if it was previously skipped
        setSkippedQuestions(prev => prev.filter(sq => sq.question.id !== currentQuestion.id && sq.questionNumber !== currentQuestionNumber));

        if (nextQuestion?.category) {
          setCoveredCategories(prev => new Set([...prev, nextQuestion.category]));
        }

        // Cache next question if not reviewing skipped
        if (!isReviewingSkipped) {
          setCurrentQuestion(nextQuestion);
        }
      }

      setIsEvaluating(false);
      setStage('evaluated');
    } catch (err) {
      console.error("Evaluation error:", err);
      setIsEvaluating(false);
    }
  };

  // Proceed to Next Question (from evaluation screen)
  const handleNextQuestion = () => {
    setSelectedMcqIdx(null);
    setTextAnswer('');

    if (isReviewingSkipped) {
      const remainingSkipped = skippedQuestions.filter(sq => sq.question.id !== currentQuestion.id);
      if (remainingSkipped.length > 0) {
        const nextSkippedItem = remainingSkipped[0];
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

    setCurrentQuestionNumber(prev => prev + 1);
    setStage('questioning');
  };

  // Re-answer same question if answer was senseless / off-topic
  const handleReAnswerSameQuestion = () => {
    setTextAnswer('');
    setSelectedMcqIdx(null);
    setStage('questioning');
  };

  // Compile final report data and trigger onComplete callback
  const compileAndFinishReport = () => {
    const validEvals = evaluationsHistory.filter(e => !e.evaluation?.isSenselessOrOffTopic);

    // Append any unattempted skipped questions into topicEvaluations for report clarity
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

    const scores = validEvals.map(e => e.score);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) : 70;

    let recommendation = 'Hire';
    if (avgScore >= 85) recommendation = 'Strong Hire';
    else if (avgScore >= 70) recommendation = 'Hire';
    else if (avgScore >= 55) recommendation = 'Lean Hire';
    else recommendation = 'Needs Development';

    const dominantLevel = avgScore >= 88 ? 'EXPERT' : avgScore >= 72 ? 'ADVANCED' : avgScore >= 55 ? 'INTERMEDIATE' : 'BEGINNER';

    const feedbackReport = {
      candidateName: user.name,
      totalQuestions: validEvals.length,
      totalSkipped: unattemptedSkippedEvals.length,
      coveredDays: Array.from(coveredCategories),
      overallScore: avgScore,
      avgAnswerScore: (avgScore / 10).toFixed(1),
      recommendation,
      dominantLevel,
      performanceTrend: 'improving',
      trendEmoji: '📈',
      narrative: `Throughout this dynamic interview, ${user.name} demonstrated technical adaptability across ${coveredCategories.size} AI engineering domains. ${unattemptedSkippedEvals.length > 0 ? `Candidate answered ${validEvals.length} question(s) and skipped ${unattemptedSkippedEvals.length}.` : 'All target questions were attempted.'}`,
      scores: {
        conceptualDepth: Math.min(98, Math.round(avgScore * 1.02)),
        tradeoffAwareness: Math.max(50, Math.round(avgScore * 0.95)),
        engineeringClarity: Math.min(95, Math.round(avgScore * 0.98)),
        productionRealism: Math.min(96, Math.round(avgScore * 0.96))
      },
      levelDistribution: {
        EXPERT: validEvals.filter(e => e.score >= 8.5).length,
        ADVANCED: validEvals.filter(e => e.score >= 7.0 && e.score < 8.5).length,
        INTERMEDIATE: validEvals.filter(e => e.score >= 5.0 && e.score < 7.0).length,
        BEGINNER: validEvals.filter(e => e.score < 5.0).length,
        SKIPPED: unattemptedSkippedEvals.length
      },
      topicEvaluations: allReportEvaluations,
      levelHistory: validEvals.map(e => ({
        questionNumber: e.questionNumber,
        label: e.level,
        emoji: e.levelEmoji,
        color: e.levelColor,
        score: e.score
      })),
      keyStrengths: [
        'Engaged directly with live AI evaluation across multiple domain topics',
        'Used skip privilege strategically when unsure to optimize time',
        `Successfully completed ${validEvals.length} adaptive interview questions`
      ],
      areasForImprovement: [
        unattemptedSkippedEvals.length > 0 ? `Review topics from skipped questions: ${unattemptedSkippedEvals.map(s => s.question.category).join(', ')}.` : 'Incorporate more quantitative benchmarks',
        'Deepen understanding of edge-case failure recovery patterns in production',
        'Practice time-boxed explanations for architectural trade-offs'
      ],
      actionableSteps: [
        'Build a production RAG pipeline using HNSW vector indexing and cross-encoder re-ranking.',
        'Implement an MCP server with custom tools and STDIO/SSE transport protocol.',
        'Instrument OpenTelemetry tracing across multi-agent workflows.'
      ]
    };

    onComplete(feedbackReport);
  };

  const wordCount = textAnswer.trim().split(/\s+/).filter(Boolean).length;
  const isAnswerReady = currentQuestion?.type === 'mcq'
    ? selectedMcqIdx !== null
    : wordCount >= (currentQuestion?.minWords || 6);

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
              <span className="di-skipped-badge" title="Skipped questions remaining">
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
                  <h4>Adaptive Questioning</h4>
                  <p>Questions adapt in real-time based on your previous answers and depth.</p>
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
                  <p>Get instant Gemini evaluation, technical feedback & scores after every question.</p>
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

        {/* ── STAGE 2: LEVEL SELECTION ── */}
        {stage === 'level_select' && (
          <div className="di-card di-level-card animate-fade-in">
            <div className="di-level-header">
              <Target size={24} className="text-cyan" />
              <h2>At which level do you currently consider yourself?</h2>
              <p>This helps us calibrate the starting baseline for your adaptive interview.</p>
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

            <div className="di-target-slider-box">
              <label className="text-sm font-semibold text-muted">
                Target Interview Length: <span className="text-cyan font-mono font-bold">{totalTargetQuestions} Questions</span>
              </label>
              <div className="di-slider-row">
                <span className="text-xs text-dim font-mono">10 Qs</span>
                <input
                  type="range"
                  min="10"
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

        {/* ── STAGE 3: QUESTIONING (ONE QUESTION AT A TIME + SKIP PRIVILEGE) ── */}
        {stage === 'questioning' && currentQuestion && (
          <div className="di-card di-question-card animate-fade-in">

            <div className="di-question-meta">
              <span className="di-meta-category">
                <Layers size={14} />
                {currentQuestion.category}
              </span>
              {isReviewingSkipped ? (
                <span className="di-meta-review-tag font-mono">
                  ⏭️ Reviewing Skipped Question ({currentSkippedIdx + 1} of {skippedQuestions.length})
                </span>
              ) : (
                <span className="di-meta-type font-mono">
                  {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Open-Ended Text'}
                </span>
              )}
            </div>

            <h2 className="di-question-title">{currentQuestion.title}</h2>

            {currentQuestion.hint && (
              <div className="di-question-hint">
                <HelpCircle size={15} className="text-amber" />
                <span><strong>Pro-Tip:</strong> {currentQuestion.hint}</span>
              </div>
            )}

            {/* MCQ Options */}
            {currentQuestion.type === 'mcq' && (
              <div className="di-mcq-options-grid">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`di-mcq-card ${selectedMcqIdx === idx ? 'mcq-selected' : ''}`}
                    onClick={() => setSelectedMcqIdx(idx)}
                  >
                    <div className="mcq-badge">{String.fromCharCode(65 + idx)}</div>
                    <div className="mcq-text">{opt}</div>
                    <div className="mcq-radio-icon">
                      {selectedMcqIdx === idx ? <CheckCircle2 size={18} className="text-cyan" /> : <div className="mcq-radio-empty" />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Text Writing Input */}
            {currentQuestion.type === 'text' && (
              <div className="di-text-input-box">
                <textarea
                  className="di-textarea"
                  placeholder="Formulate your technical explanation here... Be specific about parameters, trade-offs, and metrics where applicable."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  rows={6}
                />
                <div className="di-textarea-footer">
                  <span className={`word-count ${wordCount >= (currentQuestion.minWords || 6) ? 'wc-valid' : 'wc-invalid'}`}>
                    {wordCount} words {wordCount >= (currentQuestion.minWords || 6) ? '✓' : `(min ${currentQuestion.minWords || 6} recommended)`}
                  </span>
                  <span className="text-xs text-dim">Evaluated live by Gemini 3.5 Flash Lite</span>
                </div>
              </div>
            )}

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
                <div className="di-senseless-header">
                  <AlertTriangle size={32} className="text-rose" />
                  <div>
                    <h3 className="text-rose font-bold text-lg">Foolish or Off-Topic Answer Detected!</h3>
                    <p className="text-sm text-muted">The AI Interviewer cannot accept foolish/gibberish answers. (Score: 1.0/10)</p>
                  </div>
                </div>

                <div className="di-senseless-body">
                  <p className="text-main font-medium">
                    "{lastEvaluation.senselessReason || lastEvaluation.feedback}"
                  </p>
                  <p className="text-xs text-dim mt-2">
                    Please review question #{currentQuestionNumber} ({currentQuestion?.category}) and provide a technically accurate answer.
                  </p>
                </div>

                <div className="di-action-bar">
                  <button
                    className="btn btn-primary btn-lg di-reanswer-btn"
                    onClick={handleReAnswerSameQuestion}
                  >
                    <RotateCcw size={18} />
                    <span>Re-Answer Question #{currentQuestionNumber}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ✅ NORMAL EVALUATION DISPLAY */
              <>
                <div className="di-eval-top-row">
                  {/* For MCQ: Show Correct / Incorrect badge (No numerical rating) */}
                  {currentQuestion?.type === 'mcq' ? (
                    <div className={`di-eval-level-badge ${lastEvaluation.isCorrect ? 'mcq-correct' : 'mcq-incorrect'}`}
                      style={{
                        borderColor: lastEvaluation.isCorrect ? '#10B981' : '#F43F5E',
                        color: lastEvaluation.isCorrect ? '#10B981' : '#F43F5E',
                        background: lastEvaluation.isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)'
                      }}>
                      {lastEvaluation.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                      <span>{lastEvaluation.isCorrect ? 'Correct Selection' : 'Incorrect Selection'}</span>
                    </div>
                  ) : (
                    /* For Text: Show Rating & Level Badge */
                    <>
                      <div className="di-eval-level-badge" style={{ borderColor: lastEvaluation.levelColor, color: lastEvaluation.levelColor, background: lastEvaluation.levelColor + '15' }}>
                        <span className="text-xl">{lastEvaluation.levelEmoji}</span>
                        <span>{lastEvaluation.level} Level Response</span>
                      </div>
                      <div className="di-eval-score-chip font-mono">
                        Score: <strong style={{ color: lastEvaluation.levelColor }}>{lastEvaluation.score}/10</strong>
                      </div>
                    </>
                  )}
                </div>

                <div className="di-eval-feedback-box">
                  <h3 className="di-eval-box-title">
                    <Brain size={18} className="text-cyan" />
                    Live Gemini Deep Technical Analysis
                  </h3>
                  <p className="di-eval-feedback-text">{lastEvaluation.feedback}</p>
                </div>

                {currentQuestion?.type === 'text' && (
                  <div className="di-eval-insights-grid">
                    <div className="di-insight-card insight-strengths">
                      <h4><CheckCircle2 size={16} className="text-emerald" /> Key Strengths</h4>
                      <ul>
                        {lastEvaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    <div className="di-insight-card insight-improvements">
                      <h4><AlertCircle size={16} className="text-amber" /> Areas to Expand</h4>
                      <ul>
                        {lastEvaluation.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="di-eval-next-preview">
                  <div className="next-preview-title">
                    <Sparkles size={16} className="text-cyan" />
                    <span>Next Question Framed Adaptively</span>
                  </div>
                  <p className="next-preview-text">
                    Gemini has framed question #{currentQuestionNumber + 1} targeting <strong>{currentQuestion?.category}</strong> based on your technical response.
                  </p>
                </div>

                <div className="di-action-bar">
                  <button
                    className="btn btn-primary btn-lg di-next-btn"
                    onClick={handleNextQuestion}
                  >
                    <span>
                      {currentQuestionNumber >= totalTargetQuestions && skippedQuestions.length === 0 ? 'Finish & View Complete Assessment' : 'Proceed to Next Question'}
                    </span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            )}

          </div>
        )}

        {/* ── STAGE 5: LEFTOVER SKIPPED QUESTIONS PROMPT SCREEN ── */}
        {stage === 'review_skipped_prompt' && (
          <div className="di-card di-skipped-prompt-card animate-fade-in">
            <div className="di-icon-badge bg-amber-subtle">
              <FileQuestion size={32} className="text-amber" />
            </div>

            <h2 className="di-skipped-title">
              Skipped Questions Remaining!
            </h2>

            <p className="di-skipped-subtitle">
              You skipped <strong className="text-amber font-mono font-bold">{skippedQuestions.length} question(s)</strong> during your interview run.
            </p>

            <div className="di-skipped-list-box">
              <div className="skipped-list-header">Leftover Questions Overview:</div>
              <div className="skipped-items-list">
                {skippedQuestions.map((sq, i) => (
                  <div key={i} className="skipped-item-row">
                    <span className="sq-badge font-mono">Q#{sq.questionNumber}</span>
                    <span className="sq-cat font-semibold text-cyan">{sq.question.category}:</span>
                    <span className="sq-title text-muted truncate">{sq.question.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-dim text-center">
              You can choose to answer these skipped questions one-by-one (with full skip privilege maintained), or submit your interview directly.
            </p>

            <div className="di-skipped-action-row">
              <button
                className="btn btn-primary btn-lg di-btn-attempt-skipped"
                onClick={handleStartReviewSkipped}
              >
                <FastForward size={18} />
                <span>Answer Skipped Questions ({skippedQuestions.length} Left)</span>
              </button>

              <button
                className="btn btn-secondary btn-lg di-btn-submit-directly"
                onClick={compileAndFinishReport}
              >
                <span>Submit & View Final Report Now</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
