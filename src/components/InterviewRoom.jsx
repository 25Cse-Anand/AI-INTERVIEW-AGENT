import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Volume2, VolumeX, CornerDownLeft, HelpCircle, MessageSquareText, ShieldAlert } from 'lucide-react';
import { COHORT_CURRICULUM } from '../data/curriculumData';

export default function InterviewRoom({ sessionState, onSendAnswer, isThinking }) {
  const [inputText, setInputText] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionState.history, isThinking]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isThinking || sessionState.isComplete) return;
    onSendAnswer(inputText);
    setInputText('');
  };

  // Sample suggested response snippets for fast testing
  const sampleAnswers = [
    "In our production implementation, we configured HNSW index with M=16 and ef_construction=200 on Qdrant, achieving 42ms p95 search latency over 2M vectors. We chose Cosine Distance after normalizing embeddings.",
    "We used Reciprocal Rank Fusion (RRF) with alpha=0.5 combining BM25 sparse keyword queries with dense embeddings, followed by Cohere Rerank v3 to filter top 5 chunks into the context window.",
    "For our agentic workflow, we built a LangGraph state graph with human-in-the-loop breakpoints for financial tools, preventing infinite ReAct loops using explicit state cycle counters."
  ];

  return (
    <div className="interview-room">
      <div className="room-header">
        <div className="interviewer-profile">
          <div className="interviewer-avatar">
            <Bot size={22} className="text-cyan" />
          </div>
          <div>
            <div className="interviewer-name">AI Technical Lead (Interviewer)</div>
            <div className="interviewer-role">Assessing 31-Day Enterprise AI Cohort Mastery</div>
          </div>
        </div>

        <div className="room-controls">
          <button 
            className={`btn-icon ${audioEnabled ? 'active-audio' : ''}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Voice Synthesis Enabled' : 'Voice Synthesis Muted'}
          >
            {audioEnabled ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* Chat Conversation Scroll Area */}
      <div className="chat-messages">
        {sessionState.history.map((msg, index) => {
          const isAi = msg.role === 'interviewer';
          return (
            <div key={index} className={`message-row ${isAi ? 'message-ai' : 'message-user'}`}>
              <div className="avatar-bubble">
                {isAi ? <Bot size={18} /> : <User size={18} />}
              </div>

              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{isAi ? 'AI Interviewer' : sessionState.candidateName}</span>
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {isAi && msg.day && (
                  <div className="topic-badge-row">
                    <span className="day-badge">Day {msg.day}</span>
                    <span className="topic-badge">{msg.topic}</span>
                    {msg.isFollowUp && <span className="followup-badge">Deep-Dive Follow-up</span>}
                  </div>
                )}

                <div className="message-body">
                  {msg.content.split('\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="message-row message-ai animate-pulse">
            <div className="avatar-bubble">
              <Bot size={18} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
                <span className="typing-text">Analyzing technical response & evaluating trade-offs...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Sample Response Suggestions (For instant testing during hackathon demo) */}
      {!sessionState.isComplete && (
        <div className="quick-suggestions">
          <div className="suggestion-label">
            <MessageSquareText size={13} className="text-cyan" />
            <span>Quick Engineering Test Snippets:</span>
          </div>
          <div className="suggestion-pills">
            {sampleAnswers.map((snippet, sIdx) => (
              <button 
                key={sIdx} 
                className="suggestion-pill"
                onClick={() => setInputText(snippet)}
              >
                "{snippet.substring(0, 48)}..."
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Input Area */}
      <div className="room-input-container">
        {sessionState.isComplete ? (
          <div className="complete-banner">
            <ShieldAlert size={18} className="text-emerald" />
            <span>Technical Interview Completed ({sessionState.questionNumber - 1} Questions / {sessionState.coveredDaysList.length} Cohort Days Assessed).</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="input-form">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Type your technical answer explaining architecture, trade-offs, and design decisions... (Press Enter to send)`}
              rows={2}
              disabled={isThinking}
            />
            <button 
              type="submit" 
              className="btn btn-primary send-btn"
              disabled={!inputText.trim() || isThinking}
            >
              <Send size={18} />
              <span>Submit Answer</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
