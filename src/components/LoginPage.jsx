import React, { useState, useEffect } from 'react';
import { Bot, User, Mail, ArrowRight, Lock, Shield, Zap, Star, Sparkles, Key, CheckCircle2 } from 'lucide-react';
import { setGeminiApiKey, getGeminiApiKey } from '../services/geminiService';

const TESTIMONIALS = [
  {
    quote: "The AI interviewer pushed me in ways I didn't expect. It felt like talking to a real senior engineer.",
    name: "Arjun Mehta",
    role: "AI Engineer @ Razorpay",
    avatar: "A"
  },
  {
    quote: "I finally felt confident talking about my RAG pipeline after doing this interview twice. Incredible feedback.",
    name: "Priya Sharma",
    role: "ML Engineer @ Flipkart",
    avatar: "P"
  },
  {
    quote: "The structured feedback told me exactly what I was missing. Got a job offer within 3 weeks.",
    name: "Khalid Hassan",
    role: "AI Architect @ Infosys",
    avatar: "K"
  }
];

const TYPING_PROMPTS = [
  "Walk me through your RAG pipeline design...",
  "How did you handle the HNSW indexing parameters?",
  "What trade-offs did you consider with your agent loop?",
  "Describe your approach to LLM observability...",
  "How would you prevent prompt injection in production?"
];

const TRUST_BADGES = [
  { icon: <Shield size={15} />, label: "Private & Secure" },
  { icon: <Zap size={15} />,    label: "Gemini 3.5 Flash Lite" },
  { icon: <Star size={15} />,   label: "Expert-Level"    },
  { icon: <Sparkles size={15} />, label: "Adaptive Interview" }
];

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    apiKey: getGeminiApiKey() || 'AIzaSyBC7uH-FudjOlrM6xd85kQHsB0LsohXJLY'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Rotating testimonial
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [testimonialVisible, setTestimonialVisible] = useState(true);

  // Typing animation
  const [typingText, setTypingText] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialVisible(false);
      setTimeout(() => {
        setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
        setTestimonialVisible(true);
      }, 350);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    const target = TYPING_PROMPTS[promptIdx];
    let timeout;

    if (!isDeleting && charIdx < target.length) {
      timeout = setTimeout(() => {
        setTypingText(target.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, 48);
    } else if (!isDeleting && charIdx === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1600);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setTypingText(target.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      }, 22);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPromptIdx(i => (i + 1) % TYPING_PROMPTS.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, promptIdx]);

  const roles = [
    { value: 'student',    label: '🎓 Student'       },
    { value: 'engineer',   label: '💻 AI Engineer'   },
    { value: 'researcher', label: '🔬 Researcher'    },
    { value: 'other',      label: '🌐 Other'         }
  ];

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Please enter your full name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address.';
    if (!form.role)
      errs.role = 'Please select your role.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    // Configure Gemini API key globally
    const activeKey = form.apiKey.trim() || 'AIzaSyBC7uH-FudjOlrM6xd85kQHsB0LsohXJLY';
    setGeminiApiKey(activeKey);

    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        apiKey: activeKey
      });
    }, 900);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const t = TESTIMONIALS[testimonialIdx];

  return (
    <div className="login-shell">
      {/* Ambient background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-container">

        {/* ── Left: Trust & Brand Panel ── */}
        <div className="login-brand-panel">

          {/* Logo */}
          <div className="lbp-top">
            <div className="brand-logo-large">
              <Bot size={26} className="text-cyan" />
            </div>
            <div className="brand-name-block">
              <div className="brand-headline">InterviewAgent<span className="text-cyan">.AI</span></div>
              <div className="brand-tagline-small">31-Day AI Cohort · Technical Assessment</div>
            </div>
          </div>

          {/* Hero Statement */}
          <div className="lbp-hero">
            <h2 className="lbp-hero-title">
              Prove what you've learned.<br />
              <span className="text-cyan">Get live evaluation by Gemini 3.5.</span>
            </h2>
            <p className="lbp-hero-desc">
              A senior AI engineer is waiting. They know your curriculum, your completed missions, and exactly where to push. Answer naturally — evaluated live step-by-step.
            </p>
          </div>

          {/* Live typing simulation */}
          <div className="lbp-typing-card">
            <div className="typing-card-header">
              <div className="typing-bot-dot" />
              <span className="typing-card-label">AI Interviewer is asking...</span>
            </div>
            <div className="typing-card-text">
              "{typingText}<span className="typing-cursor">|</span>"
            </div>
          </div>

          {/* Trust badges */}
          <div className="trust-badges-row">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="trust-badge">
                {b.icon}
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className={`testimonial-card ${testimonialVisible ? 'testi-visible' : 'testi-hidden'}`}>
            <div className="testi-quote">"{t.quote}"</div>
            <div className="testi-author">
              <div className="testi-avatar">{t.avatar}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            </div>
            <div className="testi-dots">
              {TESTIMONIALS.map((_, i) => (
                <div key={i} className={`testi-dot ${i === testimonialIdx ? 'testi-dot-active' : ''}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Sign-in Form ── */}
        <div className="login-form-panel">
          <div className="form-header">
            <div className="form-icon-badge">
              <User size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="form-title">Let's get you started</h2>
              <p className="form-subtitle">Your personalized interview begins in seconds</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-name">Your Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  id="login-name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Arjun Mehta"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Gemini API Key - Pre-Integrated */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-api-key">
                Gemini API Key <span className="text-emerald text-xs font-mono font-bold">✓ Pre-Integrated</span>
              </label>
              <div className="input-wrapper">
                <Key size={16} className="input-icon text-cyan" />
                <input
                  id="login-api-key"
                  type="password"
                  className="form-input"
                  placeholder="Pre-integrated Gemini Key (AIzaSy...)"
                  value={form.apiKey}
                  onChange={e => handleChange('apiKey', e.target.value)}
                />
              </div>
              <span className="text-xs text-emerald flex items-center gap-1 mt-1 font-mono">
                <CheckCircle2 size={12} /> Key active: AIzaSyBC7uH... (Gemini 3.5 / 2.0 Flash Lite)
              </span>
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="role-grid">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    className={`role-btn ${form.role === r.value ? 'role-btn-active' : ''}`}
                    onClick={() => handleChange('role', r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  <span>Connecting to Gemini 3.5 Flash Lite...</span>
                </>
              ) : (
                <>
                  <span>Start My Interview</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* What to expect */}
          <div className="what-to-expect">
            <div className="wte-title">What to expect</div>
            <div className="wte-list">
              {[
                { icon: '🎯', text: 'Questions adapt dynamically based on your chosen level & previous answer' },
                { icon: '⚡', text: 'Evaluated live step-by-step by Gemini 3.5 / 2.0 Flash Lite' },
                { icon: '📊', text: 'Deep technical analysis & strict evaluation of foolish/wrong answers (rated 1-2/10)' },
              ].map((item, i) => (
                <div key={i} className="wte-item">
                  <span className="wte-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="login-disclaimer">
            <Lock size={11} /> Gemini 3.5 Flash Lite API is pre-configured and ready.
          </p>
        </div>
      </div>
    </div>
  );
}
