import React, { useState } from 'react';
import { Bot, Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Brain, CheckCircle2, TrendingUp, Cpu, Award, Play, Star, ChevronRight, Lock, HelpCircle, Users, Check, FastForward, SkipForward } from 'lucide-react';
import ResultPreviewModal from './ResultPreviewModal';

export default function LandingPage({ onStartInterview }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProceedToInterview = () => {
    setIsModalOpen(false);
    onStartInterview(); // Navigate to Login / Interview portal
  };

  return (
    <div className="landing-shell">

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
            <a href="#curriculum">31-Day Cohort</a>
            <a href="#testimonials">Testimonials</a>
          </div>

          {/* Action CTAs */}
          <div className="lp-nav-actions">
            <button className="btn btn-secondary lp-btn-login" onClick={handleOpenModal}>
              Login
            </button>
            <button className="btn btn-primary lp-btn-nav-start" onClick={handleOpenModal}>
              <span>Start Interview</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="lp-hero-section">
        {/* Ambient background glowing orbs */}
        <div className="lp-orb lp-orb-top-left" />
        <div className="lp-orb lp-orb-center-right" />

        <div className="lp-hero-container">
          {/* Hero Content Left */}
          <div className="lp-hero-content animate-fade-in">
            <div className="lp-hero-pill font-mono">
              <Sparkles size={14} className="text-cyan" />
              <span>POWERED BY GEMINI 3.5 FLASH LITE API</span>
            </div>

            <h1 className="lp-hero-headline">
              Master Your AI Technical Interview with <span className="text-gradient-cyan">Real-Time AI Coaching</span>
            </h1>

            <p className="lp-hero-subheadline">
              Enterprise-grade adaptive technical interviews tailored for <strong>RAG, Vector DBs, MCP Protocols, LoRA Fine-Tuning, & Agentic Systems</strong>. Get evaluated step-by-step with instant actionable reports.
            </p>

            {/* Dual CTAs */}
            <div className="lp-hero-actions">
              <button className="btn btn-primary btn-lg lp-btn-hero-main" onClick={handleOpenModal}>
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

          {/* Hero Visual Right: Unsplash Professional AI Technology & Dashboard Image */}
          <div className="lp-hero-visual-card animate-scale-up">
            <div className="visual-card-glass">
              <div className="visual-card-topbar">
                <div className="visual-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-amber" />
                  <span className="dot dot-green" />
                </div>
                <span className="font-mono text-xs text-dim">LIVE_GEMINI_EVALUATION_STREAM.AI</span>
              </div>

              <div className="visual-card-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                  alt="Professional AI Technical Interviewing and Engineering Analytics"
                  className="visual-main-img"
                />
                <div className="visual-overlay-gradient" />

                {/* Overlaid Live Badges */}
                <div className="visual-float-badge float-top-right font-mono">
                  <Zap size={14} className="text-cyan" />
                  <span>Gemini 3.5 Active (0.4s)</span>
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
            Say goodbye to static quizzes. Experience a multi-turn, realistic interview that adapts to your responses.
          </p>
        </div>

        <div className="lp-features-grid">

          {/* Card 1 */}
          <div className="lp-feature-card">
            <div className="fc-icon-wrap bg-cyan-subtle">
              <Brain size={24} className="text-cyan" />
            </div>
            <h3>Adaptive AI Questioning</h3>
            <p>
              Questions dynamically adjust difficulty based on your answers. Prove your depth across 4 self-assessed levels from Beginner to Expert.
            </p>
          </div>

          {/* Card 2 */}
          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-emerald-subtle">
              <Zap size={24} className="text-emerald" />
            </div>
            <h3>Live Gemini 3.5 Step-by-Step Analysis</h3>
            <p>
              Every text answer is deeply evaluated using Gemini 3.5 Flash Lite API against true AI engineering facts and production mechanisms.
            </p>
          </div>

          {/* Card 3 */}
          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-violet-subtle">
              <FastForward size={24} className="text-violet" />
            </div>
            <h3>Skip & Review Privilege</h3>
            <p>
              Unsure about a complex scenario? Use the "Skip Question" privilege and review leftover questions one-by-one at the end before submitting.
            </p>
          </div>

          {/* Card 4 */}
          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-rose-subtle">
              <ShieldCheck size={24} className="text-rose" />
            </div>
            <h3>Strict Foolish Answer Penalty</h3>
            <p>
              Foolish, wrong, or off-topic responses receive a strict 1-2 rating penalty with clear corrections pointing out missing parameters.
            </p>
          </div>

          {/* Card 5 */}
          <div className="fc-card lp-feature-card">
            <div className="fc-icon-wrap bg-amber-subtle">
              <Layers size={24} className="text-amber" />
            </div>
            <h3>31-Day Cohort Grounded</h3>
            <p>
              Covers RAG chunking, HNSW index build parameters, MCP STDIO/SSE transport, vLLM PagedAttention, LoRA rank scaling, and OpenTelemetry.
            </p>
          </div>

          {/* Card 6 */}
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
              <p>Sign in and choose your self-assessed level (Beginner, Intermediate, Advanced, Expert) and set target question length (10 to 20 Qs).</p>
            </div>
          </div>

          <div className="lp-timeline-step">
            <div className="ts-num font-mono">02</div>
            <div className="ts-content">
              <h4>Adaptive Interview & Skip Control</h4>
              <p>Answer dynamic MCQs and open-ended technical scenarios. Skip questions when unsure and review them leftover at the end.</p>
            </div>
          </div>

          <div className="lp-timeline-step">
            <div className="ts-num font-mono">03</div>
            <div className="ts-content">
              <h4>Get Live Feedback & Career Roadmap</h4>
              <p>Receive step-by-step Gemini feedback after every turn, culminating in a full structured feedback report with hire recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MID-PAGE HERO IMAGE SHOWCASE SECTION ── */}
      <section id="curriculum" className="lp-showcase-section">
        <div className="lp-showcase-container">
          <div className="lp-showcase-text">
            <span className="lp-section-tag font-mono text-cyan">CURRICULUM DEEP DIVE</span>
            <h2>Tested on Real Production AI Infrastructure</h2>
            <p>
              Our questions test actual production decisions: HNSW vector graph memory consumption, bi-encoders vs cross-encoders, ReAct agent loop breakpoints, and prompt injection mitigation.
            </p>
            <ul className="lp-check-list">
              <li><CheckCircle2 size={16} className="text-cyan" /> RAG Triad Evaluation (Context Relevance, Groundedness, Answer Relevance)</li>
              <li><CheckCircle2 size={16} className="text-cyan" /> Model Context Protocol (MCP) Capability Negotiation</li>
              <li><CheckCircle2 size={16} className="text-cyan" /> vLLM PagedAttention Virtual KV Block Memory Management</li>
            </ul>
            <button className="btn btn-primary btn-lg mt-3" onClick={handleOpenModal}>
              <span>Start Assessment Now</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="lp-showcase-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
              alt="AI Engineering Team Collaboration and Interview Assessment"
              className="lp-showcase-img"
            />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF & TESTIMONIALS ── */}
      <section id="testimonials" className="lp-testimonials-section">
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

      {/* ── ENTERPRISE SECURITY BANNER ── */}
      <section className="lp-security-banner">
        <div className="security-banner-inner">
          <div className="sb-left">
            <ShieldCheck size={28} className="text-emerald" />
            <div>
              <h4>Enterprise-Grade Security & Privacy</h4>
              <p>Your interview sessions and API keys are stored locally and encrypted. SOC2 compliant workflow.</p>
            </div>
          </div>
          <button className="btn btn-secondary lp-btn-sec-login" onClick={handleOpenModal}>
            Login & Begin
          </button>
        </div>
      </section>

      {/* ── BOTTOM HIGH-CONVERTING CTA BANNER ── */}
      <section className="lp-bottom-cta">
        <div className="bottom-cta-inner">
          <h2>Ready to Prove Your AI Engineering Skills?</h2>
          <p>Join over 10,000 engineers who calibrated their expertise and landed senior AI roles.</p>
          <div className="bcta-actions">
            <button className="btn btn-primary btn-lg" onClick={handleOpenModal}>
              <span>Start My Free Interview</span>
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
              Empowering AI Engineers with realistic, adaptive multi-turn interviews and step-by-step Gemini feedback.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="f-col">
              <h5>Platform</h5>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#curriculum">Cohort Curriculum</a>
            </div>
            <div className="f-col">
              <h5>Resources</h5>
              <button className="f-link-btn" onClick={handleOpenModal}>Sample Report</button>
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
          <span className="text-xs text-dim">Powered by Gemini 3.5 Flash Lite API</span>
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
