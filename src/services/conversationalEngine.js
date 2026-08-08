import { COHORT_CURRICULUM } from '../data/curriculumData';

/**
 * Conversational AI Interview Engine
 * Implements the Senior AI Engineering Technical Interviewer persona
 * following the provided system prompt with reasoning → response structure.
 */

// ─── Internal Knowledge Bank ──────────────────────────────────────────────
const QUESTION_BANK = {
  // Day 1 - LLM Fundamentals
  1: [
    { type: 'open', text: `Let's start with the foundation. In your own words, how does the self-attention mechanism in a Transformer enable the model to understand context across an entire input sequence?` },
    { type: 'followup', text: `You mentioned attention — how does the model handle long inputs that exceed the context window? What trade-offs exist between truncation and summarization approaches?` },
    { type: 'followup', text: `From a practical standpoint, how does tokenization affect your prompting strategy? Give me a real scenario where tokenization tripped you up.` }
  ],
  // Day 2 - Prompt Engineering
  2: [
    { type: 'open', text: `Walk me through the difference between Chain-of-Thought and Tree-of-Thoughts prompting. When would you choose one over the other in a production pipeline?` },
    { type: 'followup', text: `If a few-shot prompt starts degrading after 50 examples in production, what mechanisms would you put in place to detect and address prompt drift?` }
  ],
  // Day 3 - Structured Outputs
  3: [
    { type: 'open', text: `You need an LLM to reliably return JSON for a downstream microservice. Walk me through your strategy — from schema enforcement to handling malformed outputs in production.` },
    { type: 'followup', text: `What's the difference between grammar-guided decoding approaches like Guidance or Outlines versus Pydantic validation at the application layer? Which do you trust more in production and why?` }
  ],
  // Day 7 - Vector DB / HNSW
  7: [
    { type: 'open', text: `In your RAG work, you've dealt with vector databases. Walk me through HNSW indexing — what are the M and ef_construction parameters and how do they affect search latency vs. recall?` },
    { type: 'followup', text: `Product quantization can reduce memory dramatically but at a cost. What's that cost, and under what production scenario would you accept that tradeoff?` },
    { type: 'followup', text: `Suppose you have 50 million vectors and need sub-20ms p95 retrieval latency. Talk me through your architectural decisions — which index type, which database, and why.` }
  ],
  // Day 8 - Chunking
  8: [
    { type: 'open', text: `Chunking is often where RAG pipelines quietly fail. Describe the chunking strategy you chose for your ingestion pipeline and the reasoning behind it.` },
    { type: 'followup', text: `What's the parent-child chunking pattern, and how does it solve the precision-recall tension in retrieval?` },
    { type: 'followup', text: `How do you handle tables and structured data inside PDFs during document ingestion? Where do standard text splitters break down?` }
  ],
  // Day 9 - Hybrid Search
  9: [
    { type: 'open', text: `Explain Reciprocal Rank Fusion to me like I'm evaluating it for a production rollout. How does it combine sparse BM25 and dense vector scores, and what's the key parameter you'd tune?` },
    { type: 'followup', text: `When would pure dense retrieval fail that hybrid search would catch? Give me a concrete domain example.` }
  ],
  // Day 11 - Advanced RAG
  11: [
    { type: 'open', text: `You've studied Corrective RAG. Walk me through the corrective loop — what triggers a web fallback, and how do you prevent the loop from running indefinitely in production?` },
    { type: 'followup', text: `In Self-RAG, the model issues reflection tokens to decide whether to retrieve. What's the practical problem this introduces when you're running at scale with thousands of QPS?` }
  ],
  // Day 12 - RAG Evaluation
  12: [
    { type: 'open', text: `Walk me through the Ragas triad — faithfulness, answer relevance, and context recall. If your faithfulness score drops from 0.92 to 0.78 in production, where do you start debugging?` },
    { type: 'followup', text: `How do you automate RAG evaluation into a CI/CD gate? What threshold would you set before blocking a deployment?` }
  ],
  // Day 13 - Agent Architecture
  13: [
    { type: 'open', text: `You've implemented ReAct agents. Walk me through what happens inside one full Thought→Action→Observation cycle when the agent calls a tool that times out. What should happen next?` },
    { type: 'followup', text: `ReAct loops can cycle indefinitely. What's your engineering solution for infinite loop prevention without neutering the agent's autonomy?` }
  ],
  // Day 14 - Multi-Agent
  14: [
    { type: 'open', text: `In a multi-agent system built with LangGraph, how does the supervisor pattern work? Specifically, how is state shared between specialized sub-agents?` },
    { type: 'followup', text: `What's the biggest failure mode you'd expect in a peer-to-peer agent handoff pattern versus a supervisor pattern? How do you mitigate it?` }
  ],
  // Day 16 - HITL
  16: [
    { type: 'open', text: `Describe how you'd implement a human-in-the-loop approval gate in an agentic workflow. What happens to agent state during the pause, and how do you handle session expiry?` }
  ],
  // Day 20 - MCP
  20: [
    { type: 'open', text: `Explain the Model Context Protocol architecture to me. What's the difference between Resources, Prompts, and Tools in an MCP server?` },
    { type: 'followup', text: `Walk me through the MCP client-server initialization handshake. What's negotiated during capability exchange?` }
  ],
  // Day 21 - MCP Servers
  21: [
    { type: 'open', text: `You built a custom MCP server. Walk me through your decision between STDIO and SSE transport — what drove your choice, and what are the operational differences?` },
    { type: 'followup', text: `How do you validate tool argument schemas in an MCP server? What happens if a malformed request reaches your tool handler?` }
  ],
  // Day 22 - MCP Security
  22: [
    { type: 'open', text: `MCP endpoints are a significant security surface. Walk me through how you'd prevent unauthorized tool execution in a multi-tenant MCP deployment.` }
  ],
  // Day 25 - LLM Serving
  25: [
    { type: 'open', text: `You've studied vLLM's PagedAttention. Explain what problem it solves with GPU memory — specifically why naive KV cache management was inefficient.` },
    { type: 'followup', text: `Continuous batching is another key feature of modern inference engines. How does it differ from static batching, and what throughput gains does it realistically offer?` }
  ],
  // Day 27 - Fine-Tuning
  27: [
    { type: 'open', text: `Explain LoRA to me — what does "low-rank adaptation" actually mean mathematically, and why does it reduce GPU memory requirements so dramatically during fine-tuning?` },
    { type: 'followup', text: `When would you choose QLoRA over standard LoRA? What's the tradeoff you're accepting?` }
  ],
  // Day 28 - Observability
  28: [
    { type: 'open', text: `You've instrumented AI systems with observability tooling. Walk me through how you'd trace a single user request end-to-end through a multi-agent system — what spans would you emit?` },
    { type: 'followup', text: `If a production RAG pipeline's average latency suddenly spikes from 800ms to 3.2 seconds, walk me through your debugging methodology using the traces you've set up.` }
  ],
  // Day 30 - Security
  30: [
    { type: 'open', text: `Explain indirect prompt injection via RAG documents. Give me a realistic attack scenario and then describe your defense layers.` },
    { type: 'followup', text: `How would you set up an automated red teaming pipeline to continuously test your production AI system for new prompt injection vectors?` }
  ],
  // Day 31 - System Design
  31: [
    { type: 'open', text: `Let's do a mini system design. You need to build a production enterprise RAG system handling 10K daily active users with a 99.9% SLA. What does your architecture look like from ingestion to response?` },
    { type: 'followup', text: `In that system, where are your three biggest latency bottlenecks, and what concrete engineering decisions would you make to stay under 1.5s p95?` }
  ]
};

const OPENING_MESSAGE = (name, completedDay, dayTitle, firstQ) =>
  `Hello ${name}, welcome! I'm your technical interviewer today. I've reviewed your profile and I can see you've made solid progress through the 31-day cohort — impressive work on Day ${completedDay} (${dayTitle}).

Let's get right into it.

${firstQ}`;

const TRANSITION_PHRASES = [
  "Good. Let's shift gears.",
  "Understood. I want to move us forward to a different topic.",
  "That gives me enough context there. Let's pivot.",
  "Right. I want to explore another area of your cohort work.",
  "Okay. Let's move on to something else from your curriculum.",
];

const FOLLOWUP_INTROS = [
  "Let me press on that a bit.",
  "I want to dig deeper into something you mentioned.",
  "That's a good start. Let me push on the specifics.",
  "Interesting. But I want to probe the engineering side of that.",
  "Walk me through the implementation details — specifically,",
];

const ENCOURAGERS_SHALLOW = [
  "That's a reasonable overview, but I want to understand the engineering mechanics. Specifically,",
  "You've touched on the concept, but in a production environment, what would actually break first?",
  "Let me reframe the question to be more concrete —",
];

// ─── Engine Class ──────────────────────────────────────────────────────────
export class ConversationalInterviewEngine {
  constructor(candidate) {
    this.candidate = candidate;
    this.sessionId = `session_${Date.now()}`;
    this.state = {
      questionCount: 0,
      coveredDays: new Set(),
      conversationHistory: [],       // { role, content, timestamp }
      topicEvaluations: [],          // per-question scoring
      currentDayIndex: 0,
      pendingFollowUp: false,
      pendingFollowUpQuestion: null,
      currentDay: null,
      scores: { conceptualDepth: 50, tradeoffAwareness: 50, engineeringClarity: 50, productionRealism: 50 },
      levelHistory: [],
      currentLevel: null,
      isComplete: false,
      phase: 'opening'
    };

    // Build the ordered list of days to cover from completed ones
    this.targetDays = this._buildTargetDays();
  }

  _buildTargetDays() {
    const completed = (this.candidate.completedDays || []).filter(d => QUESTION_BANK[d]);
    // Shuffle a bit but keep diversity across modules
    const byModule = {};
    completed.forEach(d => {
      const day = COHORT_CURRICULUM.days[d];
      if (!day) return;
      const mod = day.module;
      if (!byModule[mod]) byModule[mod] = [];
      byModule[mod].push(d);
    });
    const ordered = [];
    Object.values(byModule).forEach(arr => {
      const pick = arr[Math.floor(Math.random() * arr.length)];
      ordered.push(pick);
    });
    // Fill remaining up to 6 from other completed days
    completed.forEach(d => {
      if (!ordered.includes(d) && ordered.length < 7) ordered.push(d);
    });
    return ordered.length >= 4 ? ordered : completed.slice(0, Math.max(4, completed.length));
  }

  /** Generate the opening message + first question */
  getOpeningMessage() {
    const firstDay = this.targetDays[0];
    const dayObj = COHORT_CURRICULUM.days[firstDay];
    const questions = QUESTION_BANK[firstDay] || [];
    const firstQ = questions[0]?.text || `Tell me about your work on Day ${firstDay}: ${dayObj?.title}.`;

    this.state.currentDay = firstDay;
    this.state.coveredDays.add(firstDay);
    this.state.phase = 'interviewing';

    const openingText = OPENING_MESSAGE(
      this.candidate.name.split(' ')[0],
      firstDay,
      dayObj?.title || 'the cohort',
      firstQ
    );

    this.state.questionCount = 1;
    this.state.conversationHistory.push({
      role: 'interviewer',
      content: openingText,
      timestamp: new Date().toISOString(),
      day: firstDay,
      questionNumber: 1
    });

    this._updatePhase();
    return openingText;
  }

  /** Core method: process candidate answer, return next interviewer message */
  processAnswer(candidateAnswer) {
    if (this.state.isComplete) {
      return { text: "We've finished the interview! Let me pull up your structured feedback.", isComplete: true };
    }

    const trimmed = (candidateAnswer || '').trim();

    // Record candidate turn
    this.state.conversationHistory.push({
      role: 'candidate',
      content: trimmed,
      timestamp: new Date().toISOString(),
      questionNumber: this.state.questionCount
    });

    // ── REASONING ──────────────────────────────────────────────
    const analysis = this._analyzeAnswer(trimmed);
    this._updateScores(analysis);
    const levelAssessment = this._assessLevel(trimmed, analysis);
    this.state.currentLevel = levelAssessment;
    this.state.levelHistory.push({ questionNumber: this.state.questionCount, ...levelAssessment });

    // Record evaluation
    const currentDayObj = COHORT_CURRICULUM.days[this.state.currentDay];
    this.state.topicEvaluations.push({
      questionNumber: this.state.questionCount,
      day: this.state.currentDay,
      topic: currentDayObj?.title || `Day ${this.state.currentDay}`,
      snippet: trimmed.substring(0, 130) + (trimmed.length > 130 ? '...' : ''),
      score: analysis.score,
      level: levelAssessment.label,
      levelEmoji: levelAssessment.emoji,
      levelColor: levelAssessment.color,
      feedback: levelAssessment.agentSummary,
      isDeep: analysis.isDeep,
      hasMentionsTradeoffs: analysis.mentionsTradeoffs
    });

    // ── DECIDE NEXT ACTION ──────────────────────────────────────
    const shouldComplete = this.state.questionCount >= 8 && this.state.coveredDays.size >= 4;
    const shouldFollowUp = !analysis.isDeep && !this.state.pendingFollowUp;
    const shouldTransition = analysis.isDeep || this.state.pendingFollowUp;

    let nextMessage = '';
    let nextDay = this.state.currentDay;

    if (shouldComplete) {
      // Natural wrap-up
      this.state.isComplete = true;
      nextMessage = this._generateClosing(analysis);
    } else if (shouldFollowUp) {
      // Follow up on shallow answer
      this.state.pendingFollowUp = true;
      nextMessage = this._generateFollowUp(analysis, trimmed);
    } else {
      // Move to next curriculum topic
      this.state.pendingFollowUp = false;
      const { text, day } = this._generateNextTopicQuestion(analysis);
      nextMessage = text;
      nextDay = day;
    }

    this.state.questionCount += 1;
    this.state.currentDay = nextDay;
    this.state.coveredDays.add(nextDay);
    this._updatePhase();

    this.state.conversationHistory.push({
      role: 'interviewer',
      content: nextMessage,
      timestamp: new Date().toISOString(),
      day: nextDay,
      questionNumber: this.state.questionCount
    });

    return {
      text: nextMessage,
      isComplete: this.state.isComplete,
      questionNumber: this.state.questionCount,
      coveredDays: [...this.state.coveredDays],
      phase: this.state.phase,
      levelAssessment
    };
  }

  // ── Private Helpers ────────────────────────────────────────────────────

  _analyzeAnswer(text) {
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const signals = {
      mentionsNumbers: /\d+\s*(ms|gb|mb|%|k|m|qps|rps|tokens|seconds|param|layer|rank|dim)/i.test(text),
      mentionsTradeoffs: /trade.?off|latency|cost|memory|precision|recall|versus|vs\.|benchmark|bottleneck|throughput/i.test(text),
      mentionsTechTerms: /hnsw|bm25|rrf|mcp|vllm|rag|langchain|langgraph|pydantic|faiss|qdrant|pinecone|lora|paged.?attention|cosine|embedding|vector|chunking|rerank|react|agentic|qlora|opentelemetry|guardrail|ragas|sft|self.?attention|transformer|kv.?cache/i.test(text),
      mentionsEdgeCases: /failure|error|edge.?case|fallback|timeout|retry|circuit|corrupt|overflow|deadlock|race|exception/i.test(text),
      mentionsProduction: /production|deploy|scale|enterprise|observ|monitor|trace|sla|uptime|99\.|cost\s*optim/i.test(text),
      mentionsSpecificTools: /openai|cohere|anthropic|unstructured|ragas|deepeval|langsmith|arize|phoenix|guardrails|tenacity|e2b|pyodide|qdrant|pinecone|milvus|pgvector|vllm|ollama|peft|unsloth|dspy/i.test(text),
    };

    const signalCount = Object.values(signals).filter(Boolean).length;
    let score = 0;
    if (wordCount < 10) score = 2.0;
    else if (wordCount < 25) score = 3.5 + signalCount * 0.3;
    else if (wordCount < 50) score = 5.0 + signalCount * 0.5;
    else if (wordCount < 80) score = 6.0 + signalCount * 0.55;
    else score = 7.0 + signalCount * 0.55;
    score = Math.min(10, parseFloat(score.toFixed(1)));

    const isDeep = score >= 6.5 || (wordCount >= 45 && signals.mentionsTechTerms);

    return { score, wordCount, signals, signalCount, isDeep, mentionsTradeoffs: signals.mentionsTradeoffs };
  }

  _assessLevel(text, analysis) {
    const { score, wordCount, signals } = analysis;
    const detected = [];
    if (signals.mentionsNumbers) detected.push('Cited metrics');
    if (signals.mentionsTradeoffs) detected.push('Discussed trade-offs');
    if (signals.mentionsTechTerms) detected.push('Used technical vocabulary');
    if (signals.mentionsEdgeCases) detected.push('Addressed failure modes');
    if (signals.mentionsProduction) detected.push('Production context');
    if (signals.mentionsSpecificTools) detected.push('Referenced specific tools');

    let key = 'BEGINNER', label = 'Beginner', emoji = '📘', color = '#F43F5E';
    if (score >= 8.5) { key = 'EXPERT'; label = 'Expert'; emoji = '🧠'; color = '#00F2FE'; }
    else if (score >= 6.8) { key = 'ADVANCED'; label = 'Advanced'; emoji = '🚀'; color = '#10B981'; }
    else if (score >= 4.8) { key = 'INTERMEDIATE'; label = 'Intermediate'; emoji = '⚙️'; color = '#F59E0B'; }

    let agentSummary = '';
    if (key === 'EXPERT') agentSummary = `Excellent depth. Answer covered: ${detected.join(', ').toLowerCase()}.`;
    else if (key === 'ADVANCED') agentSummary = `Strong understanding. ${detected.length ? 'Showed: ' + detected.join(', ').toLowerCase() + '.' : ''} Minor gaps in quantification.`;
    else if (key === 'INTERMEDIATE') agentSummary = `Functional understanding but lacked${!signals.mentionsTradeoffs ? ' trade-off reasoning' : ''}${!signals.mentionsNumbers ? ', concrete metrics' : ''}${!signals.mentionsEdgeCases ? ', failure mode analysis' : ''}.`;
    else agentSummary = `Response was brief (${wordCount} words). Needs deeper engagement with engineering specifics.`;

    return { key, label, emoji, color, score, wordCount, signals: detected, agentSummary };
  }

  _generateFollowUp(analysis, previousAnswer) {
    const dayObj = COHORT_CURRICULUM.days[this.state.currentDay];
    const questions = QUESTION_BANK[this.state.currentDay] || [];
    const followUps = questions.filter(q => q.type === 'followup');
    const intro = FOLLOWUP_INTROS[this.state.questionCount % FOLLOWUP_INTROS.length];

    if (followUps.length > 0) {
      const fq = followUps[0];
      return `${intro} ${fq.text}`;
    }

    // Generic follow-up using curriculum data
    const concept = dayObj?.key_concepts?.[1] || dayObj?.key_concepts?.[0] || 'this concept';
    const evalTopic = dayObj?.evaluation_topics?.[0] || 'system performance';
    const encourager = ENCOURAGERS_SHALLOW[this.state.questionCount % ENCOURAGERS_SHALLOW.length];
    return `${encourager} when it comes to ${concept}, what specific impact did you observe on ${evalTopic} during your implementation?`;
  }

  _generateNextTopicQuestion(analysis) {
    const transition = TRANSITION_PHRASES[this.state.questionCount % TRANSITION_PHRASES.length];
    const nextDay = this._pickNextDay();
    const dayObj = COHORT_CURRICULUM.days[nextDay];
    const questions = QUESTION_BANK[nextDay] || [];
    const openQ = questions.find(q => q.type === 'open');

    const questionText = openQ?.text ||
      `Tell me about your experience with Day ${nextDay}: ${dayObj?.title}. Specifically, walk me through how you handled ${dayObj?.evaluation_topics?.[0] || 'the key challenges'}.`;

    return {
      text: `${transition}\n\n${questionText}`,
      day: nextDay
    };
  }

  _pickNextDay() {
    const uncovered = this.targetDays.filter(d => !this.state.coveredDays.has(d));
    if (uncovered.length > 0) return uncovered[0];
    // Cycle through target days
    const idx = this.state.questionCount % this.targetDays.length;
    return this.targetDays[idx];
  }

  _generateClosing(analysis) {
    return `That's a comprehensive overview. We've now covered a solid range of topics from your cohort journey — from the foundational architecture all the way through production systems and security.

I appreciate the depth and honesty in your answers. Let me pull together your structured evaluation now.

One final thought before the report — if you had to go back and redo one architectural decision across any of the systems you built during the cohort, what would it be and why?`;
  }

  _updateScores(analysis) {
    const a = 0.25;
    const s = analysis.score;
    this.state.scores.conceptualDepth = Math.round((1 - a) * this.state.scores.conceptualDepth + a * (s >= 7 ? 85 : s >= 5 ? 65 : 45));
    this.state.scores.tradeoffAwareness = Math.round((1 - a) * this.state.scores.tradeoffAwareness + a * (analysis.mentionsTradeoffs ? 85 : 50));
    this.state.scores.engineeringClarity = Math.round((1 - a) * this.state.scores.engineeringClarity + a * (analysis.wordCount > 50 ? 82 : 48));
    this.state.scores.productionRealism = Math.round((1 - a) * this.state.scores.productionRealism + a * (analysis.signals.mentionsProduction ? 88 : 55));
  }

  _updatePhase() {
    const q = this.state.questionCount;
    if (q <= 2) this.state.phase = 'Warmup & Architecture';
    else if (q <= 4) this.state.phase = 'RAG & Vector Deep Dive';
    else if (q <= 6) this.state.phase = 'Agentic AI & MCP';
    else if (q <= 8) this.state.phase = 'Production & Security';
    else this.state.phase = 'Final Evaluation';
  }

  /** Generate the final structured feedback report */
  getStructuredFeedback(finalRemark) {
    if (finalRemark) {
      this.state.conversationHistory.push({ role: 'candidate', content: finalRemark, timestamp: new Date().toISOString() });
    }

    const scores = this.state.scores;
    const avgScore = Math.round((scores.conceptualDepth + scores.tradeoffAwareness + scores.engineeringClarity + scores.productionRealism) / 4);
    const levels = this.state.levelHistory;
    const avgAnswerScore = levels.length ? parseFloat((levels.reduce((s, l) => s + l.score, 0) / levels.length).toFixed(1)) : 0;

    let recommendation = 'Strong Hire';
    if (avgScore < 58) recommendation = 'Needs Development';
    else if (avgScore < 72) recommendation = 'Lean Hire';
    else if (avgScore < 84) recommendation = 'Hire';

    // Dominant level
    const levelCounts = { EXPERT: 0, ADVANCED: 0, INTERMEDIATE: 0, BEGINNER: 0 };
    levels.forEach(l => { if (l.key) levelCounts[l.key]++; });
    const dominantKey = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'INTERMEDIATE';

    // Trend
    const half = Math.ceil(levels.length / 2);
    const first = levels.slice(0, half).reduce((s, l) => s + l.score, 0) / (half || 1);
    const second = levels.slice(half).reduce((s, l) => s + l.score, 0) / ((levels.length - half) || 1);
    const trend = second > first + 0.5 ? 'improving' : second < first - 0.5 ? 'declining' : 'consistent';

    const name = this.candidate.name.split(' ')[0];
    const coveredDaysList = [...this.state.coveredDays];

    const narratives = {
      EXPERT: `${name} demonstrated expert-level AI engineering knowledge throughout this interview. Answers consistently included quantitative metrics, production architecture context, and clear trade-off reasoning. Ready for senior or principal AI engineering roles.`,
      ADVANCED: `${name} showed strong understanding of enterprise AI systems across multiple curriculum domains. Most answers were technically accurate with good architectural awareness. A few areas would benefit from deeper hands-on production experience.`,
      INTERMEDIATE: `${name} has solid conceptual familiarity with the 31-day cohort material, but responses were sometimes surface-level. Demonstrated knowledge needs to be reinforced with more practical project implementations and failure-mode analysis.`,
      BEGINNER: `${name} is developing their AI engineering foundation. Responses lacked the technical depth expected post-cohort. Recommend revisiting key modules and building at least two end-to-end production projects.`
    };

    const allSignals = levels.flatMap(l => l.signals || []);
    const freq = {};
    allSignals.forEach(s => { freq[s] = (freq[s] || 0) + 1; });
    const strengths = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
    const gaps = ['Cited metrics', 'Discussed trade-offs', 'Addressed failure modes', 'Production context'].filter(s => !allSignals.includes(s));

    return {
      sessionId: this.sessionId,
      candidateName: this.candidate.name,
      totalQuestions: this.state.questionCount - 1,
      coveredDays: coveredDaysList,
      overallScore: avgScore,
      avgAnswerScore,
      recommendation,
      dominantLevel: dominantKey,
      performanceTrend: trend,
      trendEmoji: trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️',
      narrative: narratives[dominantKey] || narratives.INTERMEDIATE,
      consistentStrengths: strengths,
      identifiedGaps: gaps,
      levelDistribution: levelCounts,
      scores,
      topicEvaluations: this.state.topicEvaluations,
      levelHistory: levels,
      keyStrengths: [
        `Demonstrated familiarity with ${coveredDaysList.length} distinct curriculum areas including Days ${coveredDaysList.slice(0, 3).join(', ')}.`,
        strengths[0] ? `Consistently ${strengths[0].toLowerCase()} across most answers.` : 'Showed willingness to engage with complex engineering topics.',
        `Completed ${this.candidate.completedDays?.length || 'multiple'} cohort days — strong commitment to the program.`
      ],
      areasForImprovement: [
        gaps.length > 0 ? `Work on answers that ${gaps.join(' and ').toLowerCase()} — these were missing from most responses.` : 'Continue deepening production-level specifics.',
        `Review skipped days: ${this.candidate.skippedDays?.length > 0 ? this.candidate.skippedDays.map(d => `Day ${d}`).join(', ') : 'None identified'}.`,
        `Practice time-boxed verbal explanations of system architectures (aim for 90 seconds per concept).`
      ],
      actionableSteps: [
        'Build and deploy a full RAG pipeline with HNSW indexing, hybrid BM25 search, and cross-encoder reranking.',
        'Implement a custom MCP server with OAuth capability negotiation and integrate it into a LangGraph multi-agent workflow.',
        'Set up OpenTelemetry tracing across a 3-agent system and run a structured red-team exercise using Promptfoo.'
      ]
    };
  }
}
