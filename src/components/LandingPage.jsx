import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Brain, CheckCircle2, TrendingUp, Cpu, Award, Play, Star, ChevronRight, ChevronLeft, Lock, HelpCircle, Users, Check, FastForward, SkipForward, BarChart2, Eye, MessageSquare, Send, Loader2 } from 'lucide-react';
import ResultPreviewModal from './ResultPreviewModal';
import { askSupportBotGemini } from '../services/geminiService';

const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    tag: 'AI ENGINEERING ASSESSMENT',
    alt: 'Professional AI Technical Interviewing and Engineering Analytics'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tag: 'REAL-TIME AI STREAM',
    alt: 'Live Candidate Telemetry and Evaluation Dashboards'
  },
  {
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tag: 'RAG & VECTOR ARCHITECTURE',
    alt: 'Neural Networks and HNSW Vector Search Systems'
  },
  {
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    tag: 'AGENTIC CODE PROTOCOLS',
    alt: 'Autonomous Agentic System Evaluation'
  }
];

const SHOWCASE_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    tag: 'PRODUCTION COHORT INFRASTRUCTURE',
    alt: 'AI Engineering Team Collaboration and Interview Assessment'
  },
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    tag: 'HIGH-THROUGHPUT VECTOR CLUSTERS',
    alt: 'Enterprise Server Racks & Vector DB Clusters'
  },
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    tag: 'vLLM PAGEDATTENTION & LATENCY',
    alt: 'GPU Cluster & Real-Time Performance Analytics'
  }
];

function TypewriterHeadline() {
  const fullText = "Master Your AI Technical Interview with Real-Time AI Coaching";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 35);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  const highlightStart = fullText.indexOf("Real-Time AI Coaching");
  
  if (displayedText.length > highlightStart && highlightStart !== -1) {
    const mainPart = displayedText.slice(0, highlightStart);
    const highlightPart = displayedText.slice(highlightStart);
    return (
      <h1 className="lp-hero-headline">
        {mainPart}
        <span className="text-gradient-cyan">{highlightPart}</span>
        <span className="typing-cursor font-mono text-cyan">|</span>
      </h1>
    );
  }

  return (
    <h1 className="lp-hero-headline">
      {displayedText}
      <span className="typing-cursor font-mono text-cyan">|</span>
    </h1>
  );
}

export default function LandingPage({ onLoginClick, onStartInterview }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // Auto-advance hero slides every 3.5s
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);

    const showcaseInterval = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);

    return () => {
      clearInterval(heroInterval);
      clearInterval(showcaseInterval);
    };
  }, []);

  const handleHeroPrev = () => {
    setHeroIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleHeroNext = () => {
    setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleShowcasePrev = () => {
    setShowcaseIndex((prev) => (prev === 0 ? SHOWCASE_SLIDES.length - 1 : prev - 1));
  };

  const handleShowcaseNext = () => {
    setShowcaseIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  // AI Support Bot Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi there! I am your AI Support Assistant. Facing any issue with interview setup, API keys, or cohort topics? Ask me anything!'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProceedToInterview = () => {
    setIsModalOpen(false);
    onStartInterview(); // Navigate to mandatory Login screen
  };

  const handleSendQuery = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isBotThinking) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsBotThinking(true);

    try {
      const response = await askSupportBotGemini(userText);
      setChatMessages((prev) => [...prev, { sender: 'bot', text: response }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm experiencing a brief connectivity glitch with the AI Engine, but you can proceed to Candidate Login to start your interview right away!"
        }
      ]);
    } finally {
      setIsBotThinking(false);
    }
  };

  return (
    <div className="lp-shell">
      {/* Result Preview Modal */}
      <ResultPreviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStartInterview={handleProceedToInterview}
      />

      {/* ── STICKY GLASSMORPHISM NAVBAR ── */}
      <nav className="lp-navbar">
        <div className="lp-navbar-inner">
          {/* Logo */}
          <div className="lp-brand">
            <div className="lp-brand-icon">
              <Bot size={22} className="text-cyan" />
            </div>
            <span className="lp-brand-name">InterviewAgent<span className="text-cyan">.AI</span></span>
            <span className="lp-badge-enterprise">ENTERPRISE 3.5</span>
          </div>

          {/* Navigation Links */}
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#result-preview">Result Preview</a>
            <a href="#contact">Contact & AI Support</a>
          </div>

          {/* Mandatory Login Action CTAs */}
          <div className="lp-nav-actions">
            <button className="btn btn-secondary lp-btn-login" onClick={onLoginClick || onStartInterview}>
              Login
            </button>
            <button className="btn btn-primary lp-btn-nav-start" onClick={onStartInterview}>
              <span>Start Interview</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="lp-hero-section">
        <div className="lp-orb lp-orb-top-left" />
        <div className="lp-orb lp-orb-center-right" />

        <div className="lp-hero-container">
          {/* Hero Content Left */}
          <div className="lp-hero-content animate-fade-in">
            <div className="lp-hero-pill font-mono">
              <Sparkles size={14} className="text-cyan pulse-sparkle" />
              <span>POWERED BY ADVANCED AI ENGINE</span>
            </div>

            {/* Live Typing Headline */}
            <TypewriterHeadline />

            <p className="lp-hero-subheadline">
              Enterprise-grade adaptive technical interviews tailored for <strong>RAG, Vector DBs, MCP Protocols, LoRA Fine-Tuning, & Agentic Systems</strong>. Evaluated step-by-step with instant actionable reports.
            </p>

            {/* Mandatory Login CTAs */}
            <div className="lp-hero-actions">
              <button className="btn btn-primary btn-lg lp-btn-hero-main" onClick={onStartInterview}>
                <span>Start Free Assessment</span>
                <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary btn-lg lp-btn-hero-demo" onClick={handleOpenModal}>
                <Play size={18} className="text-cyan" />
                <span>View Sample Report</span>
              </button>
            </div>

            {/* Micro Trust Bar */}
            <div className="lp-hero-trust-bar">
              <div className="lp-avatars-group">
                <span className="avatar-chip av-1">A</span>
                <span className="avatar-chip av-2">P</span>
                <span className="avatar-chip av-3">K</span>
                <span className="avatar-chip av-4">R</span>
              </div>
              <div className="lp-trust-text text-xs text-muted">
                <strong>10,000+ AI Cohort Engineers</strong> evaluated across Razorpay, Flipkart, Infosys & Google.
              </div>
            </div>
          </div>

          {/* Hero Visual Right: Dynamic Auto-Changing Picture Carousel */}
          <div className="lp-hero-visual-card animate-scale-up">
            <div className="visual-card-glass">
              <div className="visual-card-topbar">
                <div className="visual-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-amber" />
                  <span className="dot dot-green" />
                </div>
                <span className="font-mono text-xs text-dim">LIVE_AI_EVALUATION_STREAM.AI</span>
              </div>

              <div className="visual-card-image-wrap">
                {/* Active Dynamic Image with Smooth Fade */}
                <img
                  key={heroIndex}
                  src={HERO_SLIDES[heroIndex].url}
                  alt={HERO_SLIDES[heroIndex].alt}
                  className="visual-main-img slider-img-fade slider-img-active"
                />
                <div className="visual-overlay-gradient" />

                {/* Overlaid Slide Tag Badge */}
                <div className="carousel-caption-badge font-mono">
                  <span>{HERO_SLIDES[heroIndex].tag}</span>
                </div>

                {/* Manual Navigation Arrow Buttons */}
                <button
                  className="carousel-arrow carousel-arrow-prev"
                  onClick={handleHeroPrev}
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="carousel-arrow carousel-arrow-next"
                  onClick={handleHeroNext}
                  aria-label="Next Slide"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Interactive Carousel Indicator Dots */}
                <div className="carousel-indicators">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-dot ${i === heroIndex ? 'active' : ''}`}
                      onClick={() => setHeroIndex(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="visual-float-badge float-top-right font-mono">
                  <Zap size={14} className="text-cyan" />
                  <span>AI Engine Active (0.4s)</span>
                </div>

                <div className="visual-float-badge float-bottom-left font-mono">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span>Step-by-Step Live Feedback</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SHOWCASE GRID ── */}
      <section id="features" className="lp-features-section">
        <div className="lp-section-header">
          <div className="lp-section-tag font-mono text-cyan">ENTERPRISE INTERVIEW INTELLIGENCE</div>
          <h2 className="lp-section-title">Built for Serious AI Engineers</h2>
          <p className="lp-section-subtitle">
            Say goodbye to static quizzes. Experience pure open-ended text scenarios with live AI feedback and zero word limits.
          </p>
        </div>

        <div className="lp-features-grid">

          <div className="lp-feature-card">
            <div className="fc-icon-wrap bg-cyan-subtle">
              <Brain size={24} className="text-cyan" />
            </div>
            <h3>Customizable Length (8 to 20 Qs)</h3>
            <p>
              Set your target question length from 8 to 20 questions using an interactive slider control after logging in.
            </p>
          </div>

          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-emerald-subtle">
              <Zap size={24} className="text-emerald" />
            </div>
            <h3>Pure Open-Ended Text Scenarios</h3>
            <p>
              No MCQs! Every turn presents realistic open-ended technical scenarios with zero word limits so you can write complete technical details.
            </p>
          </div>

          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-violet-subtle">
              <FastForward size={24} className="text-violet" />
            </div>
            <h3>Skip & Review Privilege</h3>
            <p>
              Unsure about a complex scenario? Use the "Skip Question" privilege and review leftover questions one-by-one at the end before submitting.
            </p>
          </div>

          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-rose-subtle">
              <ShieldCheck size={24} className="text-rose" />
            </div>
            <h3>Strict Foolish Answer Penalty</h3>
            <p>
              Foolish, wrong, or off-topic responses receive a strict 1-2 rating penalty with clear corrections pointing out missing parameters.
            </p>
          </div>

          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-amber-subtle">
              <Layers size={24} className="text-amber" />
            </div>
            <h3>31-Day Cohort Grounded</h3>
            <p>
              Covers RAG chunking, HNSW index build parameters, MCP STDIO/SSE transport, vLLM PagedAttention, LoRA rank scaling, and OpenTelemetry.
            </p>
          </div>

          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-cyan-subtle">
              <Award size={24} className="text-cyan" />
            </div>
            <h3>Actionable Growth Roadmap</h3>
            <p>
              Receive a structured feedback report complete with Hire Recommendation (Strong Hire, Hire, Lean Hire), skill radar, and actionable next steps.
            </p>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS TIMELINE ── */}
      <section id="how-it-works" className="lp-timeline-section">
        <div className="lp-section-header">
          <div className="lp-section-tag font-mono text-cyan">SIMPLE 3-STEP PROCESS</div>
          <h2 className="lp-section-title">How the AI Interview Works</h2>
        </div>

        <div className="lp-timeline-grid">
          <div className="lp-timeline-step">
            <div className="ts-num font-mono">01</div>
            <div className="ts-content">
              <h4>Calibrate Your Baseline</h4>
              <p>Sign in and choose your self-assessed level (Beginner, Intermediate, Advanced, Expert) and set target question length (8 to 20 Qs).</p>
            </div>
          </div>

          <div className="lp-timeline-step">
            <div className="ts-num font-mono">02</div>
            <div className="ts-content">
              <h4>Adaptive Interview & Skip Control</h4>
              <p>Answer dynamic open-ended technical scenarios with zero word limits. Skip questions when unsure and review them leftover at the end.</p>
            </div>
          </div>

          <div className="lp-timeline-step">
            <div className="ts-num font-mono">03</div>
            <div className="ts-content">
              <h4>Get Live Feedback & Career Roadmap</h4>
              <p>Receive step-by-step AI feedback after every turn, culminating in a full structured feedback report with hire recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULT PREVIEW SECTION ── */}
      <section id="result-preview" className="lp-showcase-section">
        <div className="lp-showcase-container">
          <div className="lp-showcase-text">
            <span className="lp-section-tag font-mono text-cyan">RESULT PAGE PREVIEW</span>
            <h2>Get an Enterprise Structured Assessment Report</h2>
            <p>
              Upon completing your 8–20 open-ended technical scenario session, receive a complete breakdown of your technical match score, competency progress bars, and an actionable growth roadmap.
            </p>
            <ul className="lp-check-list">
              <li><CheckCircle2 size={16} className="text-cyan" /> Overall Candidate Hire Recommendation (Strong Hire, Hire, Lean Hire)</li>
              <li><CheckCircle2 size={16} className="text-cyan" /> Step-by-Step AI Factual Verification & Metric Analysis</li>
              <li><CheckCircle2 size={16} className="text-cyan" /> Actionable 3-step Senior Career Growth Roadmap</li>
            </ul>
            <button className="btn btn-primary btn-lg mt-3" onClick={handleOpenModal}>
              <span>Preview Sample Result Modal</span>
              <Eye size={18} />
            </button>
          </div>

          {/* Dynamic Showcase Image Slider */}
          <div className="lp-showcase-image-wrap" style={{ position: 'relative' }}>
            <img
              key={showcaseIndex}
              src={SHOWCASE_SLIDES[showcaseIndex].url}
              alt={SHOWCASE_SLIDES[showcaseIndex].alt}
              className="lp-showcase-img slider-img-fade slider-img-active"
            />

            {/* Overlaid Showcase Slide Badge */}
            <div className="carousel-caption-badge font-mono">
              <span>{SHOWCASE_SLIDES[showcaseIndex].tag}</span>
            </div>

            {/* Showcase Arrow Controls */}
            <button
              className="carousel-arrow carousel-arrow-prev"
              onClick={handleShowcasePrev}
              aria-label="Previous Image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="carousel-arrow carousel-arrow-next"
              onClick={handleShowcaseNext}
              aria-label="Next Image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicators */}
            <div className="carousel-indicators">
              {SHOWCASE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === showcaseIndex ? 'active' : ''}`}
                  onClick={() => setShowcaseIndex(i)}
                  aria-label={`Showcase Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI CUSTOMER SUPPORT / HELP CHATBOT SECTION ── */}
      <section id="contact" className="lp-support-section">
        <div className="lp-section-header">
          <div className="lp-section-tag font-mono text-cyan">24/7 AI AGENT ASSISTANT</div>
          <h2 className="lp-section-title">Contact Us & Ask AI Support Live</h2>
          <p className="lp-section-subtitle">
            Have questions about the interview process, API keys, or cohort topics? Type your problem below to troubleshoot directly with our AI Support Agent.
          </p>
        </div>

        <div className="lp-support-chat-container">
          <div className="support-chat-header">
            <div className="sch-left">
              <div className="sch-avatar">
                <Sparkles size={18} className="text-cyan" />
              </div>
              <div>
                <h4>AI Support Assistant Bot</h4>
                <p className="text-xs text-emerald">● Online & Ready to Help</p>
              </div>
            </div>
            <button className="btn btn-secondary text-xs" onClick={onLoginClick}>
              Proceed to Candidate Login →
            </button>
          </div>

          <div className="support-chat-body">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble-wrap ${msg.sender === 'user' ? 'wrap-user' : 'wrap-bot'}`}>
                <div className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isBotThinking && (
              <div className="chat-bubble-wrap wrap-bot">
                <div className="chat-bubble bubble-bot thinking-bubble">
                  <Loader2 size={16} className="animate-spin text-cyan" />
                  <span>AI Assistant is analyzing your problem...</span>
                </div>
              </div>
            )}
          </div>

          <form className="support-chat-input-bar" onSubmit={handleSendQuery}>
            <input
              type="text"
              placeholder="Ask a question or describe an issue (e.g., 'How do API keys work?' or 'What topics are asked?')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isBotThinking}
              className="chat-input-field"
            />
            <button type="submit" className="btn btn-primary chat-send-btn" disabled={!inputQuery.trim() || isBotThinking}>
              <Send size={16} />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      </section>

      {/* ── SOCIAL PROOF & TESTIMONIALS ── */}
      <section className="lp-testimonials-section">
        <div className="lp-section-header">
          <div className="lp-section-tag font-mono text-cyan">CANDIDATE SUCCESS STORIES</div>
          <h2 className="lp-section-title">Engineers Who Aced Their AI Interviews</h2>
        </div>

        <div className="lp-testimonials-grid">
          <div className="lp-testimonial-card">
            <div className="testi-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-amber fill-amber" />)}
            </div>
            <p className="testi-text">
              "The AI interviewer pushed me on HNSW vector indexing trade-offs. The step-by-step feedback showed me exactly where my latency calculations were off."
            </p>
            <div className="testi-user">
              <div className="testi-avatar-box">A</div>
              <div>
                <div className="testi-user-name">Arjun Mehta</div>
                <div className="testi-user-title">AI Engineer @ Razorpay</div>
              </div>
            </div>
          </div>

          <div className="lp-testimonial-card">
            <div className="testi-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-amber fill-amber" />)}
            </div>
            <p className="testi-text">
              "I loved the skip privilege! I skipped the tricky MCP transport question, reviewed it at the end, and received a Strong Hire recommendation."
            </p>
            <div className="testi-user">
              <div className="testi-avatar-box">P</div>
              <div>
                <div className="testi-user-name">Priya Sharma</div>
                <div className="testi-user-title">ML Lead @ Flipkart</div>
              </div>
            </div>
          </div>

          <div className="lp-testimonial-card">
            <div className="testi-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-amber fill-amber" />)}
            </div>
            <p className="testi-text">
              "The strict 1-2 score penalty for foolish answers kept me on my toes! It forces you to speak with engineering precision instead of guessing."
            </p>
            <div className="testi-user">
              <div className="testi-avatar-box">K</div>
              <div>
                <div className="testi-user-name">Khalid Hassan</div>
                <div className="testi-user-title">AI Architect @ Infosys</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM HIGH-CONVERTING CTA BANNER ── */}
      <section className="lp-bottom-cta">
        <div className="bottom-cta-inner">
          <h2>Ready to Prove Your AI Engineering Skills?</h2>
          <p>Sign in to calibrate your expertise from 8 to 20 questions and receive live AI Engine feedback.</p>
          <div className="bcta-actions">
            <button className="btn btn-primary btn-lg" onClick={onStartInterview}>
              <span>Candidate Login & Start Assessment</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="footer-col-main">
            <div className="lp-brand">
              <Bot size={22} className="text-cyan" />
              <span className="lp-brand-name">InterviewAgent<span className="text-cyan">.AI</span></span>
            </div>
            <p className="text-xs text-dim mt-2">
              Empowering AI Engineers with realistic, adaptive multi-turn interviews and step-by-step AI feedback.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="f-col">
              <h5>Platform</h5>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#contact">AI Support Bot</a>
            </div>
            <div className="f-col">
              <h5>Actions</h5>
              <button className="f-link-btn" onClick={onLoginClick}>Candidate Login</button>
              <button className="f-link-btn" onClick={onStartInterview}>Start Assessment</button>
              <button className="f-link-btn" onClick={handleOpenModal}>Result Preview</button>
            </div>
            <div className="f-col">
              <h5>Legal</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <span className="text-xs text-dim">© {new Date().getFullYear()} InterviewAgent.AI. All rights reserved.</span>
          <span className="text-xs text-dim">Powered by Enterprise AI Engine</span>
        </div>
      </footer>

      {/* ── INTERACTIVE RESULT PREVIEW MODAL ── */}
      <ResultPreviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProceed={handleProceedToInterview}
      />

    </div>
  );
}
