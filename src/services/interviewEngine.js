import { COHORT_CURRICULUM } from '../data/curriculumData';
import { CANDIDATE_PROFILES } from '../data/candidateProfiles';

/**
 * Candidate Understanding Level Definitions
 */
export const UNDERSTANDING_LEVELS = {
  EXPERT: {
    label: 'Expert',
    emoji: '🧠',
    color: '#00F2FE',
    description: 'Deep mastery with production benchmark awareness and clear trade-off reasoning.',
    minScore: 8.5
  },
  ADVANCED: {
    label: 'Advanced',
    emoji: '🚀',
    color: '#10B981',
    description: 'Solid conceptual understanding and ability to reason through architectural decisions.',
    minScore: 7.0
  },
  INTERMEDIATE: {
    label: 'Intermediate',
    emoji: '⚙️',
    color: '#F59E0B',
    description: 'Functional knowledge with some gaps in edge-case handling and production specifics.',
    minScore: 5.0
  },
  BEGINNER: {
    label: 'Beginner',
    emoji: '📘',
    color: '#F43F5E',
    description: 'Surface-level awareness; needs structured study and hands-on implementation practice.',
    minScore: 0
  }
};

/**
 * AI Technical Interviewer Engine
 * Implements multi-turn adaptive interviewing over the 31-day AI Cohort curriculum.
 */
export class InterviewEngine {
  constructor(candidateId = "cand-001") {
    this.initSession(candidateId);
  }

  initSession(candidateId) {
    const candidate = CANDIDATE_PROFILES.find(c => c.id === candidateId) || CANDIDATE_PROFILES[0];
    this.candidate = candidate;
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Filter completed curriculum days
    this.availableDays = candidate.completedDays.map(d => COHORT_CURRICULUM.days[d]).filter(Boolean);

    // Select at least 4 distinct curriculum days to cover across 8+ questions
    this.targetDays = this.planTargetDays(this.availableDays);

    this.state = {
      sessionId: this.sessionId,
      candidateId: candidate.id,
      candidateName: candidate.name,
      questionNumber: 1,
      minQuestionsRequired: 8,
      isComplete: false,
      currentPhase: "Warmup & Architectural Context",
      coveredDaysList: [],
      history: [],
      scores: {
        conceptualDepth: 0,
        tradeoffAwareness: 0,
        engineeringClarity: 0,
        productionRealism: 0
      },
      topicEvaluations: [],
      // NEW: per-question level assessments
      levelHistory: [],
      // NEW: current live level
      currentLevel: null,
      pendingFollowUp: false,
      lastAskedQuestion: null
    };

    // Generate first question
    const firstQ = this.generateInitialQuestion();
    this.state.lastAskedQuestion = firstQ;
    this.state.history.push({
      role: 'interviewer',
      content: firstQ.text,
      timestamp: new Date().toISOString(),
      day: firstQ.day,
      topic: firstQ.title,
      isFollowUp: false
    });

    if (!this.state.coveredDaysList.includes(firstQ.day)) {
      this.state.coveredDaysList.push(firstQ.day);
    }
  }

  planTargetDays(availableDays) {
    const daysByModule = {};
    availableDays.forEach(d => {
      if (!daysByModule[d.module]) daysByModule[d.module] = [];
      daysByModule[d.module].push(d);
    });

    const selected = [];
    Object.keys(daysByModule).forEach(mod => {
      const list = daysByModule[mod];
      if (list.length > 0) {
        selected.push(list[Math.floor(Math.random() * list.length)]);
      }
    });

    if (selected.length < 4) {
      const remaining = availableDays.filter(d => !selected.includes(d));
      while (selected.length < 4 && remaining.length > 0) {
        selected.push(remaining.pop());
      }
    }
    return selected.slice(0, 6);
  }

  generateInitialQuestion() {
    const dayObj = this.targetDays[0] || COHORT_CURRICULUM.days[6];
    return {
      day: dayObj.day,
      title: dayObj.title,
      text: `Hello ${this.candidate.name}, welcome to your technical interview for the 31-Day Enterprise AI Cohort! I see you've completed ${this.candidate.cohortProgress}. Let me dive right into your technical journey.\n\nLooking at Day ${dayObj.day} (${dayObj.title}), could you walk me through how you designed your ${dayObj.key_concepts[0]} and what trade-offs you evaluated when choosing between ${dayObj.evaluation_topics[0]}?`
    };
  }

  /**
   * NEW: Assess candidate understanding level from a single answer
   * Returns { level, key, score, signals, summary }
   */
  assessAnswerLevel(answer) {
    const text = (answer || '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Signal detection patterns
    const signals = {
      mentionsConcreteNumbers: /\d+\s*(ms|gb|mb|kb|k|m|b|%|qps|rps|tokens|seconds|minutes)/i.test(text),
      mentionsTradeoffs: /trade.?off|latency|throughput|cost|memory|precision|recall|versus|vs\.|benchmark|performance|bottleneck/i.test(text),
      mentionsTechTerms: /hnsw|bm25|rrf|mcp|vllm|rag|langchain|langgraph|pydantic|faiss|qdrant|pinecone|lora|paged.?attention|cosine|embedding|vector|chunking|rerank|react\s+loop|agentic|sft|qlora|opentelemetry/i.test(text),
      mentionsEdgeCases: /failure|error|edge.?case|fallback|timeout|retry|circuit.?break|corrupt|overflow|deadlock|race.?condition/i.test(text),
      mentionsProductionContext: /production|deploy|scale|cluster|enterprise|observ|monitor|trace|span|cost\s+optim|sla|uptime|99\.9/i.test(text),
      mentionsSpecificTools: /openai|cohere|anthropic|unstructured|ragas|deepeval|langsmith|arize|phoenix|guardrails|tenacity|e2b|pyodide/i.test(text),
    };

    const signalCount = Object.values(signals).filter(Boolean).length;

    // Score calculation
    let rawScore = 0;
    if (wordCount < 10) rawScore = 2.0;
    else if (wordCount < 20) rawScore = 3.5;
    else if (wordCount < 35) rawScore = 4.5 + (signalCount * 0.3);
    else if (wordCount < 60) rawScore = 5.5 + (signalCount * 0.5);
    else rawScore = 6.5 + (signalCount * 0.6);

    rawScore = Math.min(10, parseFloat(rawScore.toFixed(1)));

    // Determine level
    let levelKey = 'BEGINNER';
    if (rawScore >= UNDERSTANDING_LEVELS.EXPERT.minScore) levelKey = 'EXPERT';
    else if (rawScore >= UNDERSTANDING_LEVELS.ADVANCED.minScore) levelKey = 'ADVANCED';
    else if (rawScore >= UNDERSTANDING_LEVELS.INTERMEDIATE.minScore) levelKey = 'INTERMEDIATE';

    const level = UNDERSTANDING_LEVELS[levelKey];

    // Build specific signal summary
    const detectedSignals = [];
    if (signals.mentionsConcreteNumbers) detectedSignals.push('Cited quantitative metrics');
    if (signals.mentionsTradeoffs) detectedSignals.push('Discussed trade-offs');
    if (signals.mentionsTechTerms) detectedSignals.push('Used precise technical vocabulary');
    if (signals.mentionsEdgeCases) detectedSignals.push('Addressed edge cases & failures');
    if (signals.mentionsProductionContext) detectedSignals.push('Framed in production context');
    if (signals.mentionsSpecificTools) detectedSignals.push('Referenced specific tools');

    // Personalized agent summary
    let agentSummary = '';
    if (levelKey === 'EXPERT') {
      agentSummary = `Exceptional depth — candidate clearly has hands-on production experience. Answer covered ${detectedSignals.join(', ').toLowerCase()}.`;
    } else if (levelKey === 'ADVANCED') {
      agentSummary = `Strong understanding. Candidate shows solid conceptual grasp${detectedSignals.length ? ': ' + detectedSignals.join(', ').toLowerCase() : ''}. Minor gaps in production-level quantification.`;
    } else if (levelKey === 'INTERMEDIATE') {
      agentSummary = `Functional awareness but the response lacked${!signals.mentionsTradeoffs ? ' trade-off reasoning,' : ''}${!signals.mentionsConcreteNumbers ? ' concrete metrics,' : ''}${!signals.mentionsEdgeCases ? ' failure mode consideration.' : '.'}`;
    } else {
      agentSummary = `Response was very brief or surface-level (${wordCount} words). Needs deeper engagement with ${!signals.mentionsTechTerms ? 'core technical vocabulary and ' : ''}architectural specifics.`;
    }

    return {
      key: levelKey,
      label: level.label,
      emoji: level.emoji,
      color: level.color,
      description: level.description,
      score: rawScore,
      wordCount,
      signals: detectedSignals,
      agentSummary
    };
  }

  /**
   * Process a candidate's answer and generate next adaptive response/follow-up
   */
  processResponse(candidateAnswer) {
    if (this.state.isComplete) {
      return {
        reply: "The interview has been completed! You can view your detailed evaluation feedback report.",
        isComplete: true
      };
    }

    const trimmed = (candidateAnswer || "").trim();
    const wordCount = trimmed.split(/\s+/).length;

    // Record candidate answer
    this.state.history.push({
      role: 'candidate',
      content: trimmed,
      timestamp: new Date().toISOString()
    });

    // --- NEW: Assess understanding level for this answer ---
    const levelAssessment = this.assessAnswerLevel(trimmed);
    this.state.currentLevel = levelAssessment;
    this.state.levelHistory.push({
      questionNumber: this.state.questionNumber,
      ...levelAssessment
    });

    // Analyze answer quality (Depth heuristic)
    const mentionsTradeoffs = /tradeoff|latency|cost|memory|precision|recall|versus|benchmark|hnsw|pagedattention|rrf|bm25|mcp/i.test(trimmed);
    const isVagueOrShort = wordCount < 20 || (!mentionsTradeoffs && wordCount < 35);

    // Use level score for telemetry
    const turnScore = levelAssessment.score;
    this.updateTelemetryScores(turnScore, mentionsTradeoffs, isVagueOrShort);

    // Record topic evaluation
    const currentQuestionInfo = this.state.lastAskedQuestion || { day: 8, title: "RAG Systems" };
    this.state.topicEvaluations.push({
      questionNumber: this.state.questionNumber,
      day: currentQuestionInfo.day,
      topic: currentQuestionInfo.title,
      candidateResponseSnippet: trimmed.substring(0, 120) + (trimmed.length > 120 ? '...' : ''),
      score: turnScore,
      level: levelAssessment.label,
      levelEmoji: levelAssessment.emoji,
      levelColor: levelAssessment.color,
      feedback: levelAssessment.agentSummary
    });

    // Increment question number
    this.state.questionNumber += 1;

    // Trigger follow-up or move to next day
    let nextQuestion;
    const currentDay = currentQuestionInfo.day;

    if (isVagueOrShort && !this.state.pendingFollowUp) {
      this.state.pendingFollowUp = true;
      nextQuestion = this.generateFollowUpQuestion(currentDay, trimmed);
    } else {
      this.state.pendingFollowUp = false;
      nextQuestion = this.generateNextTopicQuestion();
    }

    this.updatePhase();

    if (this.state.questionNumber > 8 && this.state.coveredDaysList.length >= 4) {
      this.state.isComplete = true;
    }

    this.state.lastAskedQuestion = nextQuestion;

    this.state.history.push({
      role: 'interviewer',
      content: nextQuestion.text,
      timestamp: new Date().toISOString(),
      day: nextQuestion.day,
      topic: nextQuestion.title,
      isFollowUp: nextQuestion.isFollowUp
    });

    if (!this.state.coveredDaysList.includes(nextQuestion.day)) {
      this.state.coveredDaysList.push(nextQuestion.day);
    }

    return {
      session_id: this.sessionId,
      interviewer_reply: nextQuestion.text,
      question_number: this.state.questionNumber - 1,
      current_day: nextQuestion.day,
      current_topic: nextQuestion.title,
      is_follow_up: nextQuestion.isFollowUp,
      covered_days_count: this.state.coveredDaysList.length,
      covered_days_list: this.state.coveredDaysList,
      current_phase: this.state.currentPhase,
      is_complete: this.state.isComplete,
      // NEW: live level assessment returned per turn
      level_assessment: levelAssessment
    };
  }

  generateFollowUpQuestion(dayNumber, previousAnswer) {
    const dayObj = COHORT_CURRICULUM.days[dayNumber] || COHORT_CURRICULUM.days[8];

    const followUps = [
      `That covers the high-level concept, but let me press deeper into the engineering mechanics. In your response on Day ${dayNumber} (${dayObj.title}), how specifically do you handle ${dayObj.evaluation_topics[1] || dayObj.key_concepts[1]} when scaling under heavy production load?`,
      `You touched on the basics, but what happens when system limits are reached? Specifically regarding ${dayObj.key_concepts[0]}, what concrete metrics or benchmarks did you monitor to prevent performance degradation?`,
      `Let's dig into the edge cases. In your implementation of ${dayObj.title}, how did you measure and optimize for ${dayObj.evaluation_topics[0]}? What failed during your initial deployment attempts?`
    ];

    const text = followUps[Math.floor(Math.random() * followUps.length)];
    return {
      day: dayNumber,
      title: `${dayObj.title} (Technical Follow-Up)`,
      text: text,
      isFollowUp: true
    };
  }

  generateNextTopicQuestion() {
    const uncovered = this.targetDays.filter(d => !this.state.coveredDaysList.includes(d.day));
    const nextDayObj = uncovered.length > 0
      ? uncovered[0]
      : (this.availableDays[this.state.questionNumber % this.availableDays.length] || COHORT_CURRICULUM.days[14]);

    const templates = [
      (d) => `Great explanation! Now let's shift gears to Day ${d.day}: **${d.title}**.\n\nWhen building systems with ${d.tools.slice(0, 2).join(' and ')}, how did you structure your ${d.key_concepts[0]} to ensure zero data corruption or unhandled execution errors?`,
      (d) => `Solid perspective. Moving on to Day ${d.day} covering **${d.title}**.\n\nWhat were the biggest architectural trade-offs you encountered when implementing ${d.key_concepts[0]} versus ${d.key_concepts[1]}? Walk me through your design decisions.`,
      (d) => `Understood. Let's explore Day ${d.day}: **${d.title}**.\n\nSuppose you are deploying this in a zero-trust enterprise environment. How would you configure ${d.evaluation_topics[0]} while maintaining high throughput?`
    ];

    const selectedTemplate = templates[(this.state.questionNumber - 1) % templates.length];
    return {
      day: nextDayObj.day,
      title: nextDayObj.title,
      text: selectedTemplate(nextDayObj),
      isFollowUp: false
    };
  }

  updatePhase() {
    const qNum = this.state.questionNumber;
    if (qNum <= 2) this.state.currentPhase = "Warmup & Architectural Context";
    else if (qNum <= 4) this.state.currentPhase = "RAG & Vector Storage Deep Dive";
    else if (qNum <= 6) this.state.currentPhase = "Agentic AI & MCP Protocols";
    else if (qNum <= 8) this.state.currentPhase = "Production Systems & Security";
    else this.state.currentPhase = "Final Synthesis & Evaluation";
  }

  updateTelemetryScores(turnScore, mentionsTradeoffs, isVague) {
    const alpha = 0.3;
    const targetDepth = turnScore >= 8.5 ? 92 : turnScore >= 7 ? 80 : turnScore >= 5 ? 65 : 45;
    const targetTradeoff = mentionsTradeoffs ? 88 : 55;
    const targetClarity = isVague ? 48 : 82;
    const targetProduction = turnScore >= 7 ? 85 : 60;

    this.state.scores.conceptualDepth = Math.round((1 - alpha) * (this.state.scores.conceptualDepth || 70) + alpha * targetDepth);
    this.state.scores.tradeoffAwareness = Math.round((1 - alpha) * (this.state.scores.tradeoffAwareness || 60) + alpha * targetTradeoff);
    this.state.scores.engineeringClarity = Math.round((1 - alpha) * (this.state.scores.engineeringClarity || 65) + alpha * targetClarity);
    this.state.scores.productionRealism = Math.round((1 - alpha) * (this.state.scores.productionRealism || 65) + alpha * targetProduction);
  }

  /**
   * NEW: Compute overall generalised result based on level history
   */
  computeOverallResult() {
    const levels = this.state.levelHistory;
    if (levels.length === 0) return null;

    const avgScore = levels.reduce((s, l) => s + l.score, 0) / levels.length;

    const levelCounts = { EXPERT: 0, ADVANCED: 0, INTERMEDIATE: 0, BEGINNER: 0 };
    levels.forEach(l => { levelCounts[l.key] = (levelCounts[l.key] || 0) + 1; });

    const dominantKey = Object.entries(levelCounts).sort((a, b) => b[1] - a[1])[0][0];
    const dominantLevel = UNDERSTANDING_LEVELS[dominantKey];

    // Trend analysis
    const firstHalf = levels.slice(0, Math.ceil(levels.length / 2));
    const secondHalf = levels.slice(Math.ceil(levels.length / 2));
    const firstAvg = firstHalf.reduce((s, l) => s + l.score, 0) / (firstHalf.length || 1);
    const secondAvg = secondHalf.reduce((s, l) => s + l.score, 0) / (secondHalf.length || 1);
    const trend = secondAvg > firstAvg + 0.5 ? 'improving' : secondAvg < firstAvg - 0.5 ? 'declining' : 'consistent';

    // Strengths & gaps from signals
    const allSignals = levels.flatMap(l => l.signals || []);
    const signalFreq = {};
    allSignals.forEach(s => { signalFreq[s] = (signalFreq[s] || 0) + 1; });
    const topSignals = Object.entries(signalFreq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

    const missedSignals = ['Cited quantitative metrics', 'Discussed trade-offs', 'Addressed edge cases & failures', 'Framed in production context']
      .filter(s => !allSignals.includes(s));

    // Overall narrative
    let narrative = '';
    const name = this.candidate.name.split(' ')[0];

    if (dominantKey === 'EXPERT') {
      narrative = `${name} demonstrated expert-level command of enterprise AI engineering throughout this interview. Answers consistently referenced production benchmarks, concrete system metrics, and nuanced trade-off reasoning. Ready for senior AI engineering roles.`;
    } else if (dominantKey === 'ADVANCED') {
      narrative = `${name} showed strong theoretical and practical understanding of the 31-Day AI Cohort topics. Most responses were technically accurate with good architectural awareness. A few areas could benefit from deeper production battle-testing.`;
    } else if (dominantKey === 'INTERMEDIATE') {
      narrative = `${name} has a functional grasp of the AI Cohort curriculum but responses were often surface-level. They articulate concepts but struggle to defend architectural decisions under pressure or cite production metrics. Further project work is recommended.`;
    } else {
      narrative = `${name} is early in their AI engineering journey. Responses were brief and lacked technical depth. We recommend completing skipped cohort topics and building hands-on production projects to reinforce conceptual knowledge.`;
    }

    return {
      dominant_level: dominantKey,
      dominant_level_label: dominantLevel.label,
      dominant_level_emoji: dominantLevel.emoji,
      dominant_level_color: dominantLevel.color,
      average_answer_score: parseFloat(avgScore.toFixed(1)),
      level_distribution: levelCounts,
      performance_trend: trend,
      trend_emoji: trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️',
      consistent_strengths: topSignals,
      identified_gaps: missedSignals,
      narrative,
      per_question_levels: levels.map(l => ({
        q: l.questionNumber,
        level: l.label,
        emoji: l.emoji,
        score: l.score
      }))
    };
  }

  /**
   * Generates final structured feedback report compliant with HTTP spec requirement
   */
  getStructuredFeedback() {
    const avgScore = Math.round(
      (this.state.scores.conceptualDepth +
        this.state.scores.tradeoffAwareness +
        this.state.scores.engineeringClarity +
        this.state.scores.productionRealism) / 4
    );

    let recommendation = "Strong Hire";
    if (avgScore < 60) recommendation = "Needs Development";
    else if (avgScore < 75) recommendation = "Lean Hire";
    else if (avgScore < 85) recommendation = "Hire";

    const candidateName = this.candidate.name;
    const overallResult = this.computeOverallResult();

    return {
      session_id: this.sessionId,
      candidate_id: this.candidate.id,
      candidate_name: candidateName,
      overall_score: avgScore,
      hiring_recommendation: recommendation,
      assessment_summary: `${candidateName} completed a ${this.state.questionNumber - 1}-question technical interview covering ${this.state.coveredDaysList.length} distinct curriculum days (${this.state.coveredDaysList.join(', ')}). Demonstrates ${avgScore >= 80 ? 'strong' : 'moderate'} capability in communicating complex AI engineering trade-offs.`,
      // NEW: overall generalised result object
      overall_result: overallResult,
      metrics: {
        conceptual_depth: this.state.scores.conceptualDepth,
        tradeoff_awareness: this.state.scores.tradeoffAwareness,
        engineering_clarity: this.state.scores.engineeringClarity,
        production_realism: this.state.scores.productionRealism
      },
      curriculum_coverage: {
        total_questions_asked: this.state.questionNumber - 1,
        min_questions_met: (this.state.questionNumber - 1) >= 8,
        covered_days_count: this.state.coveredDaysList.length,
        min_days_met: this.state.coveredDaysList.length >= 4,
        days_covered: this.state.coveredDaysList.map(d => ({
          day: d,
          title: COHORT_CURRICULUM.days[d]?.title || `Day ${d}`
        }))
      },
      key_strengths: [
        `Strong grasp of completed RAG & Vector Search fundamentals (HNSW indexing, Hybrid BM25 fusion).`,
        `Articulate communication when explaining trade-offs between latency and contextual accuracy.`,
        `Demonstrates practical familiarity with tools like ${this.candidate.learningSignals.strongAreas[0] || 'vLLM and LangGraph'}.`
      ],
      areas_for_improvement: [
        `Deepen understanding of edge-case failure modes in Agentic ReAct loops.`,
        `Review skipped cohort topics: ${this.candidate.skippedDays.length > 0 ? this.candidate.skippedDays.map(d => `Day ${d}`).join(', ') : 'None'}.`,
        `Provide more quantitative benchmark numbers (e.g. latency in ms, QPS memory bounds) during initial answers before prompting.`
      ],
      topic_evaluations: this.state.topicEvaluations,
      actionable_next_steps: [
        "Build a hands-on production benchmark suite measuring RAG top-K cross-encoder re-ranking latency.",
        "Implement a custom MCP Server with OAuth capability negotiation to strengthen security mechanics.",
        "Practice 60-second elevator summaries for system architecture trade-offs."
      ]
    };
  }
}
