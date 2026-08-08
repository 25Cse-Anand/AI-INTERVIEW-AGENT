import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { ChevronRight, ChevronLeft, CheckCircle2, Circle, BookOpen, CheckSquare, Clock, Bot, SkipForward } from 'lucide-react';

export default function QuizInterview({ user, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: { value, type } }
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false); // for MCQ inline feedback
  const [startTime] = useState(Date.now());
  const [questionTime, setQuestionTime] = useState(0);

  const question = QUIZ_QUESTIONS[currentIdx];
  const totalQ = QUIZ_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const progress = Math.round((currentIdx / totalQ) * 100);

  // Reset inputs when question changes
  useEffect(() => {
    const saved = answers[question.id];
    if (question.type === 'mcq') {
      setSelectedOption(saved?.value ?? null);
    } else {
      setTextAnswer(saved?.value ?? '');
    }
    setShowFeedback(false);
    setQuestionTime(Date.now());
  }, [currentIdx]);

  const canProceed = question.type === 'mcq'
    ? selectedOption !== null
    : textAnswer.trim().split(/\s+/).filter(Boolean).length >= (question.minWords || 10);

  const saveAnswer = () => {
    if (question.type === 'mcq') {
      return {
        value: selectedOption,
        type: 'mcq',
        isCorrect: selectedOption === question.correctIndex,
        timeTaken: Math.round((Date.now() - questionTime) / 1000)
      };
    } else {
      return {
        value: textAnswer.trim(),
        type: 'text',
        wordCount: textAnswer.trim().split(/\s+/).filter(Boolean).length,
        timeTaken: Math.round((Date.now() - questionTime) / 1000)
      };
    }
  };

  const handleNext = () => {
    if (!canProceed) return;

    if (question.type === 'mcq' && !showFeedback) {
      // Show inline MCQ feedback first
      const ans = saveAnswer();
      setAnswers(prev => ({ ...prev, [question.id]: ans }));
      setShowFeedback(true);
      return;
    }

    // Save and advance
    const ans = saveAnswer();
    const newAnswers = { ...answers, [question.id]: ans };
    setAnswers(newAnswers);

    if (currentIdx + 1 >= totalQ) {
      // Done!
      onComplete({
        user,
        answers: newAnswers,
        totalTime: Math.round((Date.now() - startTime) / 1000),
        questions: QUIZ_QUESTIONS
      });
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  const wordCount = textAnswer.trim().split(/\s+/).filter(Boolean).length;
  const minWords = question.minWords || 10;

  return (
    <div className="quiz-shell">
      {/* Top Progress Bar */}
      <div className="quiz-topbar">
        <div className="quiz-topbar-inner">
          <div className="quiz-brand">
            <Bot size={20} className="text-cyan" />
            <span className="font-mono text-sm">InterviewAgent.AI</span>
          </div>

          <div className="quiz-progress-center">
            <div className="quiz-progress-track">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="quiz-progress-label">
              Question {currentIdx + 1} of {totalQ}
            </span>
          </div>

          <div className="quiz-user-pill">
            <span className="user-initial">{user.name.charAt(0).toUpperCase()}</span>
            <span className="user-name-sm">{user.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Left: Question Steps Navigator */}
      <div className="quiz-layout">
        <aside className="quiz-steps-panel">
          <div className="steps-header">All Questions</div>
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isDone = answers[q.id] !== undefined;
            const isCurrent = idx === currentIdx;
            return (
              <div
                key={q.id}
                className={`step-item ${isCurrent ? 'step-current' : isDone ? 'step-done' : 'step-upcoming'}`}
              >
                <div className="step-num">
                  {isDone
                    ? <CheckCircle2 size={16} className="text-emerald" />
                    : <span>{idx + 1}</span>
                  }
                </div>
                <div className="step-meta">
                  <div className="step-q-label">Q{idx + 1}: {q.category}</div>
                  <div className="step-type-badge">
                    {q.type === 'mcq'
                      ? <><CheckSquare size={11} /> MCQ</>
                      : <><BookOpen size={11} /> Text</>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </aside>

        {/* Main Question Area */}
        <main className="quiz-main">
          <div className="question-card animate-fade-in" key={question.id}>
            {/* Category Tag */}
            <div className="q-category-row">
              <span
                className="q-category-badge"
                style={{ background: question.categoryColor + '22', color: question.categoryColor, borderColor: question.categoryColor + '55' }}
              >
                {question.category}
              </span>
              <span className="q-type-label">
                {question.type === 'mcq'
                  ? <><CheckSquare size={13} /> Multiple Choice</>
                  : <><BookOpen size={13} /> Open-Ended Answer</>
                }
              </span>
              <span className="q-number-label font-mono">
                {currentIdx + 1} / {totalQ}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="question-text">{question.question}</h2>

            {/* MCQ Options */}
            {question.type === 'mcq' && (
              <div className="options-list">
                {question.options.map((opt, optIdx) => {
                  let optClass = 'option-btn';
                  if (showFeedback) {
                    if (optIdx === question.correctIndex) optClass += ' option-correct';
                    else if (optIdx === selectedOption && optIdx !== question.correctIndex) optClass += ' option-wrong';
                    else optClass += ' option-disabled';
                  } else if (selectedOption === optIdx) {
                    optClass += ' option-selected';
                  }

                  return (
                    <button
                      key={optIdx}
                      className={optClass}
                      onClick={() => !showFeedback && setSelectedOption(optIdx)}
                      disabled={showFeedback}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                      <span className="option-text">{opt}</span>
                      {showFeedback && optIdx === question.correctIndex && (
                        <CheckCircle2 size={18} className="option-check text-emerald" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* MCQ Inline Explanation after answer */}
            {question.type === 'mcq' && showFeedback && (
              <div className={`explanation-box ${answers[question.id]?.isCorrect ? 'explanation-correct' : 'explanation-wrong'}`}>
                <div className="explanation-title">
                  {answers[question.id]?.isCorrect ? '✅ Correct!' : '❌ Not quite —'}
                </div>
                <p className="explanation-text">{question.explanation}</p>
              </div>
            )}

            {/* Text Answer Textarea */}
            {question.type === 'text' && (
              <div className="text-answer-area">
                <textarea
                  className="answer-textarea"
                  placeholder={question.placeholder}
                  value={textAnswer}
                  onChange={e => setTextAnswer(e.target.value)}
                  rows={5}
                />
                <div className="word-count-bar">
                  <div
                    className="word-count-fill"
                    style={{
                      width: `${Math.min(100, (wordCount / minWords) * 100)}%`,
                      background: wordCount >= minWords ? '#10B981' : '#F59E0B'
                    }}
                  />
                </div>
                <div className="word-count-meta">
                  <span style={{ color: wordCount >= minWords ? '#10B981' : '#F59E0B' }}>
                    {wordCount} words {wordCount < minWords ? `(need at least ${minWords})` : '✓ Minimum met'}
                  </span>
                  <span className="text-muted">Press Next when ready</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="quiz-nav-row">
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleBack}
                disabled={currentIdx === 0}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                className={`btn btn-lg quiz-next-btn ${canProceed ? 'btn-primary' : 'btn-disabled-state'}`}
                onClick={handleNext}
                disabled={!canProceed}
              >
                <span>
                  {showFeedback
                    ? (currentIdx + 1 === totalQ ? 'Finish & See Results' : 'Next Question')
                    : (question.type === 'mcq' ? 'Check Answer' : 'Submit Answer')
                  }
                </span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
