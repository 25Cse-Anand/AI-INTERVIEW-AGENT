import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Loader2, CheckCircle2, Brain, Target, CalendarCheck2, Activity, Sparkles, ChevronRight, Layers } from 'lucide-react';

export default function ConversationalInterview({ user, engine, onComplete }) {
  const [messages, setMessages] = useState([]);        // { role, content, timestamp, level }
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionState, setSessionState] = useState({
    questionCount: 0, coveredDays: [], phase: 'Warmup & Architecture',
    currentLevel: null, scores: { conceptualDepth: 50, tradeoffAwareness: 50, engineeringClarity: 50, productionRealism: 50 }
  });
  const [isFinalRemarkMode, setIsFinalRemarkMode] = useState(false);
  const [finalRemarkSent, setFinalRemarkSent] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Boot: load opening message
  useEffect(() => {
    const opening = engine.getOpeningMessage();
    setMessages([{
      role: 'interviewer',
      content: opening,
      timestamp: new Date().toISOString(),
      id: 0
    }]);
    setSessionState(prev => ({
      ...prev,
      questionCount: 1,
      coveredDays: [...engine.state.coveredDays],
      phase: engine.state.phase,
      scores: { ...engine.state.scores }
    }));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    setInputText('');

    // Add candidate message
    const candidateMsg = { role: 'candidate', content: text, timestamp: new Date().toISOString(), id: messages.length };
    setMessages(prev => [...prev, candidateMsg]);

    // Show typing indicator
    setIsTyping(true);

    // Check if this is the final remark
    if (isFinalRemarkMode && !finalRemarkSent) {
      setFinalRemarkSent(true);
      setTimeout(() => {
        setIsTyping(false);
        const feedback = engine.getStructuredFeedback(text);
        onComplete(feedback);
      }, 1200);
      return;
    }

    // Simulate AI thinking delay (800–1600ms)
    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      const result = engine.processAnswer(text);
      setIsTyping(false);

      const interviewerMsg = {
        role: 'interviewer',
        content: result.text,
        timestamp: new Date().toISOString(),
        id: messages.length + 1,
        levelAssessment: result.levelAssessment
      };
      setMessages(prev => [...prev, interviewerMsg]);

      setSessionState({
        questionCount: result.questionNumber || engine.state.questionCount,
        coveredDays: [...engine.state.coveredDays],
        phase: engine.state.phase,
        currentLevel: result.levelAssessment || null,
        scores: { ...engine.state.scores }
      });

      if (result.isComplete) {
        setIsFinalRemarkMode(true);
      }
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const minReady = wordCount >= 8;

  return (
    <div className="conv-shell">
      {/* Top Bar */}
      <div className="conv-topbar">
        <div className="conv-topbar-inner">
          <div className="conv-brand">
            <div className="conv-brand-dot" />
            <Bot size={18} className="text-cyan" />
            <span>AI Technical Interviewer</span>
            <span className="conv-live-badge">● LIVE</span>
          </div>

          <div className="conv-phase-pill">
            <span className="conv-phase-label">{sessionState.phase}</span>
          </div>

          <div className="conv-user-chip">
            <div className="conv-user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      <div className="conv-layout">
        {/* ── Left Sidebar ── */}
        <aside className="conv-sidebar">

          {/* Progress */}
          <div className="conv-sidebar-card">
            <div className="sidebar-card-title">
              <Activity size={15} className="text-cyan" />
              <span>Interview Progress</span>
            </div>

            <div className="progress-item">
              <div className="progress-item-header">
                <span>Questions Asked</span>
                <span className="font-mono text-cyan">{sessionState.questionCount} / 8+</span>
              </div>
              <div className="thin-track">
                <div className="thin-fill fill-cyan" style={{ width: `${Math.min(100, (sessionState.questionCount / 8) * 100)}%` }} />
              </div>
              {sessionState.questionCount >= 8 && (
                <div className="req-met"><CheckCircle2 size={12} /> Minimum met</div>
              )}
            </div>

            <div className="progress-item mt-2">
              <div className="progress-item-header">
                <span>Curriculum Days</span>
                <span className="font-mono text-violet">{sessionState.coveredDays.length} / 4+</span>
              </div>
              <div className="thin-track">
                <div className="thin-fill fill-violet" style={{ width: `${Math.min(100, (sessionState.coveredDays.length / 4) * 100)}%` }} />
              </div>
              {sessionState.coveredDays.length >= 4 && (
                <div className="req-met text-emerald"><CheckCircle2 size={12} /> Minimum met</div>
              )}
            </div>

            {sessionState.coveredDays.length > 0 && (
              <div className="covered-chips mt-2">
                {sessionState.coveredDays.map(d => (
                  <span key={d} className="day-chip">Day {d}</span>
                ))}
              </div>
            )}
          </div>

          {/* Live Level */}
          {sessionState.currentLevel && (
            <div className="conv-sidebar-card mt-3 level-live-card" style={{ borderColor: sessionState.currentLevel.color + '44' }}>
              <div className="sidebar-card-title" style={{ color: sessionState.currentLevel.color }}>
                <Brain size={15} />
                <span>Last Answer Level</span>
              </div>
              <div className="level-row">
                <span className="level-emoji-sm">{sessionState.currentLevel.emoji}</span>
                <div>
                  <div className="level-name-sm" style={{ color: sessionState.currentLevel.color }}>
                    {sessionState.currentLevel.label}
                  </div>
                  <div className="level-score-sm font-mono">{sessionState.currentLevel.score}/10</div>
                </div>
              </div>
              <p className="level-summary-sm">{sessionState.currentLevel.agentSummary}</p>
              {sessionState.currentLevel.signals?.length > 0 && (
                <div className="signal-chips">
                  {sessionState.currentLevel.signals.map((s, i) => (
                    <span key={i} className="sig-chip" style={{ color: sessionState.currentLevel.color, borderColor: sessionState.currentLevel.color + '44' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Competency */}
          <div className="conv-sidebar-card mt-3">
            <div className="sidebar-card-title">
              <Target size={15} className="text-amber" />
              <span>Competency Scores</span>
            </div>
            {[
              { label: 'Conceptual Depth', key: 'conceptualDepth', color: '#00F2FE', cls: 'fill-cyan' },
              { label: 'Trade-off Awareness', key: 'tradeoffAwareness', color: '#F59E0B', cls: 'fill-amber' },
              { label: 'Eng. Clarity', key: 'engineeringClarity', color: '#10B981', cls: 'fill-emerald' },
              { label: 'Production Realism', key: 'productionRealism', color: '#8B5CF6', cls: 'fill-violet' },
            ].map(m => (
              <div className="comp-meter" key={m.key}>
                <div className="comp-meter-header">
                  <span>{m.label}</span>
                  <span className="font-mono" style={{ color: m.color }}>{sessionState.scores[m.key]}%</span>
                </div>
                <div className="thin-track">
                  <div className={`thin-fill ${m.cls}`} style={{ width: `${sessionState.scores[m.key]}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="conv-sidebar-card tips-card mt-3">
            <div className="sidebar-card-title">
              <Sparkles size={14} className="text-amber" />
              <span>Interview Tips</span>
            </div>
            <ul className="tips-list">
              <li>Be specific — cite tools and metrics</li>
              <li>Discuss trade-offs, not just "how it works"</li>
              <li>Mention failure modes you encountered</li>
              <li>Reference your actual cohort implementations</li>
            </ul>
          </div>
        </aside>

        {/* ── Chat Area ── */}
        <div className="conv-chat-area">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-row ${msg.role === 'interviewer' ? 'row-interviewer' : 'row-candidate'}`}>
                {msg.role === 'interviewer' && (
                  <div className="chat-avatar interviewer-avatar">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`chat-bubble ${msg.role === 'interviewer' ? 'bubble-interviewer' : 'bubble-candidate'}`}>
                  {msg.role === 'interviewer' && (
                    <div className="bubble-sender">AI Interviewer</div>
                  )}
                  <div className="bubble-text">{msg.content}</div>
                  <div className="bubble-time font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {msg.role === 'candidate' && (
                  <div className="chat-avatar candidate-avatar">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-row row-interviewer">
                <div className="chat-avatar interviewer-avatar">
                  <Bot size={18} />
                </div>
                <div className="chat-bubble bubble-interviewer typing-bubble">
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            {/* Final remark prompt */}
            {isFinalRemarkMode && !finalRemarkSent && (
              <div className="final-prompt-banner">
                <Sparkles size={16} className="text-amber" />
                <span>This is your final response — the interviewer will generate your full evaluation after you answer.</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="conv-input-area">
            <div className="input-hint-row">
              <span className={`word-count-hint ${minReady ? 'wc-ready' : 'wc-pending'}`}>
                {wordCount} words {minReady ? '✓' : `(min 8 recommended)`}
              </span>
              <span className="input-tip">Shift+Enter for new line · Enter to send</span>
            </div>
            <div className="conv-input-row">
              <textarea
                ref={textareaRef}
                className="conv-textarea"
                placeholder={isFinalRemarkMode ? "Share your final reflection — what would you change about your architectural decisions?" : "Type your answer here... Be specific, cite tools and metrics where possible."}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                disabled={isTyping || finalRemarkSent}
              />
              <button
                className={`conv-send-btn ${inputText.trim() && !isTyping ? 'send-ready' : 'send-disabled'}`}
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping || finalRemarkSent}
                title="Send answer"
              >
                {isTyping
                  ? <Loader2 size={20} className="spin-icon" />
                  : <Send size={20} />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
