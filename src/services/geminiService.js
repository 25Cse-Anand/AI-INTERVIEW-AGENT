// Groq-only API Service

let aiProvider = 'groq';

// Exported key managers kept for compatibility with other components
export function setGeminiApiKey(key) {
  // no-op
}

export function getGeminiApiKey() {
  return '';
}

export function setAiProvider(provider) {
  // no-op
}

export function getAiProvider() {
  return 'groq';
}

export function setGroqApiKey(key) {
  if (typeof window !== 'undefined' && key) {
    localStorage.setItem('groq_api_key', key.trim());
  }
}

export function getGroqApiKey() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('groq_api_key') || import.meta.env?.VITE_GROQ_API_KEY || '';
  }
  return import.meta.env?.VITE_GROQ_API_KEY || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE GROQ API CALLER
// ─────────────────────────────────────────────────────────────────────────────

export async function callGroq(prompt, options = {}) {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error("Missing VITE_GROQ_API_KEY environment variable. Please configure it in your .env file.");
  }

  const model = options.model || 'llama-3.3-70b-versatile';
  const temperature = options.temperature ?? 0.7;
  const isJson = options.isJson ?? true;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: temperature,
      response_format: isJson ? { type: 'json_object' } : undefined
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response or invalid format received from Groq API.");
  }
  return content;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTI-PLAGIARISM & CHEAT DETECTION
// ─────────────────────────────────────────────────────────────────────────────

export function checkPlagiarism(answer, questionText, hintText) {
  const ansText = (answer || '').trim();
  if (!ansText) return null;

  const cleanAns = ansText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  if (cleanAns.length === 0) return null;

  const checkOverlap = (source) => {
    if (!source) return 0;
    const srcWords = source.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
    if (srcWords.length === 0) return 0;

    const srcSet = new Set(srcWords);
    let matched = 0;
    for (const word of cleanAns) {
      if (srcSet.has(word)) {
        matched++;
      }
    }
    return matched / Math.max(cleanAns.length, srcWords.length);
  };

  const qSim = checkOverlap(questionText);
  const hSim = checkOverlap(hintText);

  // If candidate answer matches over 60% of question words or 65% of hint words, it is flagged as plagiarism
  if (qSim > 0.6 || hSim > 0.65) {
    return {
      isSenselessOrOffTopic: true,
      senselessReason: "Plagiarism Alert: Your answer has exceptionally high similarity to the question or hint text.",
      score: 1.0,
      isCorrect: false,
      level: "Beginner",
      levelEmoji: "📘",
      levelColor: "#F43F5E",
      feedback: "Plagiarism detected. You copied or restated the question or hint text directly without providing a genuine technical solution.",
      factualErrors: ["Copied the question/hint text directly."],
      strengths: [],
      gaps: ["Must write an original explanation in your own words."],
      _generatedBy: 'System'
    };
  }

  // Exact long-phrase match
  if (questionText && questionText.length > 25) {
    const qWords = questionText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
    for (let i = 0; i <= qWords.length - 6; i++) {
      const phrase = qWords.slice(i, i + 6).join(' ');
      if (ansText.toLowerCase().includes(phrase) && cleanAns.length < qWords.length * 0.9) {
        return {
          isSenselessOrOffTopic: true,
          senselessReason: "Plagiarism Alert: Exact phrases from the question were found in your response.",
          score: 1.0,
          isCorrect: false,
          level: "Beginner",
          levelEmoji: "📘",
          levelColor: "#F43F5E",
          feedback: "Plagiarism detected. Answer contains copied exact phrases from the question prompt.",
          factualErrors: ["Copied exact phrases from the question prompt."],
          strengths: [],
          gaps: ["Write an original response without copying the prompt text."],
          _generatedBy: 'System'
        };
      }
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PER-ANSWER EVALUATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function evaluateAnswerAndGetNextQuestion(arg1, arg2, arg3, arg4, arg5) {
  let userLevel, currentQuestion, userAnswer, questionNumber, totalTargetQuestions, interviewerPersona;

  if (typeof arg1 === 'object' && arg1 !== null && arg1.currentQuestion) {
    ({ userLevel = 'Intermediate', currentQuestion, userAnswer, questionNumber = 1, totalTargetQuestions = 8, interviewerPersona = 'Backend' } = arg1);
  } else {
    currentQuestion = arg1;
    userAnswer = arg2;
    userLevel = arg3 || 'Intermediate';
    questionNumber = arg4 || 1;
    totalTargetQuestions = arg5 || 8;
    interviewerPersona = 'Backend';
  }

  // 1. Run plagiarism detection first
  const plagResult = checkPlagiarism(userAnswer, currentQuestion?.title, currentQuestion?.hint);
  if (plagResult) {
    return { evaluation: plagResult };
  }

  const evaluationPersonaCriteria = {
    Backend: "Evaluate with a strong focus on data modeling, scaling limits, caching strategies, latency bottlenecks, database queries, and backend security edge cases.",
    Frontend: "Evaluate with a strong focus on render efficiency, DOM/CSS layout design, browser security (XSS/CSRF), responsive breakpoints, and client-side state optimization.",
    DSA: "Evaluate with a strong focus on algorithmic accuracy, time/space complexity (Big O bounds), optimal data structure choices, and edge-case memory usage.",
    Startup: "Evaluate with a strong focus on pragmatic architectural tradeoffs, speed of development, building from MVP to scale, and developer agility.",
    "HR-style": "Evaluate with a strong focus on technical communication, collaboration paradigms, constructive sprint management, behavioral reasoning, and problem solving."
  };
  const selectedCriteria = evaluationPersonaCriteria[interviewerPersona] || evaluationPersonaCriteria.Backend;

  const prompt = `
<evaluation_task>
You are a STRICT Senior AI Technical Interviewer performing a rigorous factual evaluation.
Evaluate the candidate's answer STRICTLY and HONESTLY based on its actual technical content and context.

INTERVIEWER EVALUATION CRITERIA (PERSONA FOCUS):
${selectedCriteria}

INTERVIEW CONTEXT:
- Question #${questionNumber} of ${totalTargetQuestions}
- Topic: "${currentQuestion?.title || 'Technical Scenario'}"
- Category: ${currentQuestion?.category || 'AI Systems Architecture'}
- Candidate Level: ${userLevel}

CANDIDATE ANSWER:
"${userAnswer}"

STRICT SCORING RUBRIC — apply honestly, do NOT be lenient:
• 1.0–2.0  → Completely wrong, empty, plagiarized, or copied prompt text. No technical content.
• 2.5–3.5  → Vague or severely incomplete. Shows surface-level awareness only.
• 4.0–5.0  → Partially correct. Missing critical mechanisms, parameters, or trade-offs.
• 5.5–6.5  → Decent. Core concept addressed but lacks depth or specifics.
• 7.0–8.0  → Strong. Accurate, mentions key trade-offs and technical details.
• 8.5–9.0  → Very strong. Production-grade depth with specific metrics/configs.
• 9.5–10.0 → Exceptional. Expert-level with edge cases, benchmarks, and system design.

IMPORTANT RULES:
1. Score MUST reflect the ACTUAL quality of this specific answer.
2. A one-sentence vague response scores ≤ 4.0, NOT 7.0+.
3. Only answers with correct terminology, specific parameters, and trade-off reasoning score ≥ 7.0.
4. Detect if candidate is trying to trick the rating by copying/pasting the prompt or repeating nonsense phrases.
5. "isSenselessOrOffTopic": true ONLY for complete gibberish or total off-topic responses.

Return ONLY this JSON (no markdown, no code fences):
{
  "evaluation": {
    "isSenselessOrOffTopic": false,
    "senselessReason": "",
    "score": <decimal 1.0–10.0 based on actual quality>,
    "isCorrect": <true if score >= 6.0>,
    "level": "<Beginner|Intermediate|Advanced|Expert>",
    "levelEmoji": "<📘|⚙️|🚀|🧠>",
    "levelColor": "<#F43F5E|#F59E0B|#10B981|#00F2FE>",
    "feedback": "<2-4 sentences: what was right, what was wrong/missing, what the correct answer should include>",
    "factualErrors": ["<specific factual error if any>"],
    "strengths": ["<specific strength in this answer>"],
    "gaps": ["<specific missing concept or incorrect detail>"]
  }
}
</evaluation_task>`;

  // 2. Query Groq API
  try {
    const content = await callGroq(prompt, { model: 'llama-3.3-70b-versatile', temperature: 0.1, isJson: true });
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.evaluation && typeof parsed.evaluation.score === 'number') {
        parsed.evaluation.score = Math.min(10.0, Math.max(1.0, parsed.evaluation.score));
        return {
          ...parsed,
          _generatedBy: 'Groq'
        };
      }
    }
  } catch (groqErr) {
    console.warn("Groq evaluation failed, falling back to local evaluation:", groqErr?.message);
  }

  // Local fallback with dynamic scoring
  return localFallbackEvaluation({ userLevel, currentQuestion, userAnswer, questionNumber });
}

/**
 * Dynamic local fallback evaluator — scores vary meaningfully by answer quality.
 */
function localFallbackEvaluation({ userLevel, currentQuestion, userAnswer, questionNumber }) {
  const text = (userAnswer || '').trim();
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean).length;

  const t3 = ['hnsw','pagedattention','rrf','qlora','nf4','infonce','dpo','rlhf','flashattention','sram','opentelemetry','hitl','langgraph'];
  const t2 = ['vllm','mcp','lora','rerank','bm25','pydantic','qdrant','pinecone','ragas','guardrail','transformer','embedding','chunking'];
  const t1 = ['vector','rag','agent','attention','cache','semantic','schema','latency','memory','pipeline','token','throughput','index','model','prompt','gpu','kv'];

  const s3 = t3.filter(t => lower.includes(t)).length;
  const s2 = t2.filter(t => lower.includes(t)).length;
  const s1 = t1.filter(t => lower.includes(t)).length;
  const termScore = s3 * 1.5 + s2 * 0.8 + s1 * 0.3;

  let score, level, levelEmoji, levelColor, isCorrect;

  if (words < 8 && termScore < 0.5) {
    score = +(1.5 + Math.random() * 1.2).toFixed(1);
    level = 'Beginner'; levelEmoji = '📘'; levelColor = '#F43F5E'; isCorrect = false;
  } else if (words < 20 && termScore < 1.5) {
    score = +(3.0 + Math.random() * 1.2).toFixed(1);
    level = 'Beginner'; levelEmoji = '📘'; levelColor = '#F43F5E'; isCorrect = false;
  } else if (words < 40 || termScore < 2.5) {
    score = +(4.5 + Math.random() * 1.2).toFixed(1);
    level = 'Intermediate'; levelEmoji = '⚙️'; levelColor = '#F59E0B'; isCorrect = true;
  } else if (words < 80 || termScore < 5.0) {
    score = +(6.0 + Math.random() * 1.2).toFixed(1);
    level = 'Intermediate'; levelEmoji = '⚙️'; levelColor = '#F59E0B'; isCorrect = true;
  } else if (termScore < 9.0) {
    score = +(7.5 + Math.random() * 0.9).toFixed(1);
    level = 'Advanced'; levelEmoji = '🚀'; levelColor = '#10B981'; isCorrect = true;
  } else {
    score = Math.min(9.8, +(8.5 + Math.random() * 1.2).toFixed(1));
    level = 'Expert'; levelEmoji = '🧠'; levelColor = '#00F2FE'; isCorrect = true;
  }

  const allMatched = [...t3.filter(t => lower.includes(t)), ...t2.filter(t => lower.includes(t)), ...t1.filter(t => lower.includes(t))];
  return {
    evaluation: {
      isSenselessOrOffTopic: false, senselessReason: '',
      score, level, levelEmoji, levelColor, isCorrect,
      feedback: isCorrect
        ? `Score ${score}/10 — ${allMatched.length ? `Good use of: ${allMatched.slice(0,3).join(', ')}.` : 'Relevant attempt.'} ${words < 60 ? 'Add more specific parameters and trade-off analysis to score higher.' : 'Solid depth demonstrated.'}`
        : `Score ${score}/10 — Response lacks sufficient technical depth for ${currentQuestion?.category || 'this topic'}. Include specific mechanisms, parameters, and architectural reasoning.`,
      factualErrors: [],
      strengths: allMatched.length ? [`Referenced: ${allMatched.slice(0,3).join(', ')}`] : ['Attempted the question'],
      gaps: score < 7.0 ? ['Add specific production parameters', 'Discuss architectural trade-offs and failure modes'] : ['Expand on edge cases and real-world benchmarks'],
      _generatedBy: 'Fallback'
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL REPORT GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function generateFinalReport({ candidateName, userLevel, candidateRole, evaluationsHistory, coveredCategories, skippedQuestions }) {
  const transcript = evaluationsHistory.map((e, i) => `
Q${i + 1} [${e.question?.category || 'General'}]: ${e.question?.title || 'Question'}
Answer: "${e.answer?.substring(0, 400)}${e.answer?.length > 400 ? '...' : ''}"
Per-Question Score: ${e.score}/10 | Level: ${e.level}
Feedback: ${e.evaluation?.feedback || e.feedback || 'N/A'}
`).join('\n---\n');

  const skippedSummary = skippedQuestions?.length > 0
    ? `\nSkipped Questions (${skippedQuestions.length}): ${skippedQuestions.map(s => s.question?.category).join(', ')}`
    : '\nNo questions skipped.';

  const rawAvg = evaluationsHistory.length > 0
    ? evaluationsHistory.reduce((sum, e) => sum + (e.score || 0), 0) / evaluationsHistory.length
    : 5.0;

  const prompt = `
<final_report_task>
You are a Senior AI Technical Interview Panel synthesizing a comprehensive structured evaluation report.

CANDIDATE PROFILE:
- Name: ${candidateName}
- Self-Assessed Level: ${userLevel}
- Role Persona: ${candidateRole}
- Questions Answered: ${evaluationsHistory.length}
- Questions Skipped: ${skippedQuestions?.length || 0}
${skippedSummary}

COMPLETE INTERVIEW TRANSCRIPT WITH PER-QUESTION SCORES:
${transcript}

COVERED TOPIC AREAS: ${Array.from(coveredCategories || []).join(', ')}

YOUR TASK — Analyze the full transcript carefully and generate a fair, accurate report:

1. OVERALL SCORE (0–100): Calculate a WEIGHTED score based on actual per-question scores.
   - Formula: (sum of all scores / count) * 10, rounded to nearest integer.
   - Skipped questions count as 0/10.
   - The raw average is ${(rawAvg * 10).toFixed(0)} — adjust ±5 points based on trajectory (improving/declining pattern) and depth quality.

2. RECOMMENDATION: Based on the overall score:
   - 85–100: "Strong Hire"
   - 70–84: "Hire"  
   - 55–69: "Lean Hire"
   - < 55: "Needs Development"

3. DOMINANT LEVEL: The most frequent performance level across all answers (EXPERT/ADVANCED/INTERMEDIATE/BEGINNER).

4. NARRATIVE: 2-sentence personalized summary of the candidate's performance pattern and standout traits.

5. PERFORMANCE TREND: "improving" if later scores are higher than earlier, "declining" if lower, "consistent" if stable.

6. KEY STRENGTHS: 3–5 specific technical strengths observed across the interview (reference actual answer content).

7. AREAS FOR IMPROVEMENT: 3–5 specific technical gaps observed (reference actual missing concepts from the answers).

8. ACTIONABLE STEPS: 3 concrete, personalized learning recommendations based on the weakest topic areas observed.

9. COMPETENCY SCORES (each as percentage 0–100, derived from the transcript):
   - confidence: How confidently and decisively candidate answers the questions
   - technicalDepth: How well candidate explains technical details, parameters, and code logic
   - reasoning: How well candidate explains architectural design trade-offs and latency metrics
   - communication: How clearly and concisely candidate articulates their technical thoughts

Return ONLY this JSON (no markdown, no code fences):
{
  "overallScore": <integer 0-100>,
  "recommendation": "<Strong Hire|Hire|Lean Hire|Needs Development>",
  "dominantLevel": "<EXPERT|ADVANCED|INTERMEDIATE|BEGINNER>",
  "narrative": "<2-sentence personalized summary>",
  "performanceTrend": "<improving|declining|consistent>",
  "trendEmoji": "<📈|📉|📊>",
  "keyStrengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "areasForImprovement": ["<specific gap 1>", "<specific gap 2>", "<specific gap 3>"],
  "actionableSteps": ["<concrete step 1>", "<concrete step 2>", "<concrete step 3>"],
  "competencyScores": {
    "confidence": <0-100>,
    "technicalDepth": <0-100>,
    "reasoning": <0-100>,
    "communication": <0-100>
  }
}
</final_report_task>`;

  // 1. Query Groq API
  try {
    const content = await callGroq(prompt, { model: 'llama-3.3-70b-versatile', temperature: 0.1, isJson: true });
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.overallScore !== undefined) return parsed;
    }
  } catch (groqErr) {
    console.warn("Groq report generation failed, falling back to local fallback report:", groqErr?.message);
  }

  return buildLocalFallbackReport({ rawAvg, evaluationsHistory, skippedQuestions, coveredCategories });
}

/**
 * Local fallback final report computed directly from evaluation data.
 */
function buildLocalFallbackReport({ rawAvg, evaluationsHistory, skippedQuestions, coveredCategories }) {
  const skipPenalty = (skippedQuestions?.length || 0) * 0.5;
  const overallScore = Math.min(100, Math.max(10, Math.round(rawAvg * 10 - skipPenalty)));

  let recommendation = 'Needs Development';
  if (overallScore >= 85) recommendation = 'Strong Hire';
  else if (overallScore >= 70) recommendation = 'Hire';
  else if (overallScore >= 55) recommendation = 'Lean Hire';

  const levelCounts = { EXPERT: 0, ADVANCED: 0, INTERMEDIATE: 0, BEGINNER: 0 };
  evaluationsHistory.forEach(e => {
    const k = (e.level || 'INTERMEDIATE').toUpperCase();
    if (levelCounts[k] !== undefined) levelCounts[k]++;
    else levelCounts.INTERMEDIATE++;
  });
  const dominantLevel = Object.entries(levelCounts).sort((a,b) => b[1]-a[1])[0][0];

  const scores = evaluationsHistory.map(e => e.score || 0);
  const firstHalf = scores.slice(0, Math.floor(scores.length/2));
  const secondHalf = scores.slice(Math.floor(scores.length/2));
  const firstAvg = firstHalf.reduce((a,b) => a+b, 0) / (firstHalf.length || 1);
  const secondAvg = secondHalf.reduce((a,b) => a+b, 0) / (secondHalf.length || 1);
  const trend = secondAvg > firstAvg + 0.5 ? 'improving' : secondAvg < firstAvg - 0.5 ? 'declining' : 'consistent';

  const allStrengths = evaluationsHistory.flatMap(e => e.evaluation?.strengths || e.strengths || []).filter(Boolean);
  const allGaps = evaluationsHistory.flatMap(e => e.evaluation?.gaps || e.gaps || []).filter(Boolean);

  return {
    overallScore,
    recommendation,
    dominantLevel,
    narrative: `Candidate demonstrated ${dominantLevel.toLowerCase()} competency across ${evaluationsHistory.length} technical scenarios covering ${Array.from(coveredCategories || []).length} topic areas.`,
    performanceTrend: trend,
    trendEmoji: trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '📊',
    keyStrengths: allStrengths.length ? [...new Set(allStrengths)].slice(0, 4) : ['Attempted all required scenarios', 'Engaged with technical topics'],
    areasForImprovement: allGaps.length ? [...new Set(allGaps)].slice(0, 4) : ['Deepen production parameter knowledge', 'Practice trade-off articulation'],
    actionableSteps: [
      'Build a parent-child RAG pipeline with HNSW indexing on Qdrant to master vector retrieval depth.',
      'Implement a custom MCP server with STDIO transport and capability negotiation from scratch.',
      'Profile vLLM PagedAttention KV-cache blocks with OpenTelemetry spans for end-to-end latency visibility.'
    ],
    competencyScores: {
      confidence: Math.min(98, Math.max(30, overallScore + Math.round(Math.random() * 6 - 3))),
      technicalDepth: Math.min(98, Math.max(30, overallScore - 3 + Math.round(Math.random() * 6 - 3))),
      reasoning: Math.min(98, Math.max(30, overallScore + 2 + Math.round(Math.random() * 6 - 3))),
      communication: Math.min(98, Math.max(30, overallScore - 1 + Math.round(Math.random() * 6 - 3)))
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTIVE QUESTION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function generateAdaptiveQuestion(
  qNum,
  userLevel = 'Intermediate',
  previousQuestion = null,
  previousAnswer = null,
  previousEvaluation = null,
  candidateRole = 'Engineer',
  askedQuestionTitles = [],
  interviewerPersona = 'Backend',
  resumeDetails = null
) {
  const prevScore = previousEvaluation?.score || 7.0;
  const isHighPerformer = prevScore >= 7.5;
  const isLowPerformer = prevScore <= 4.0;

  const personaGuidance = {
    Student: "Focus on foundational AI/ML algorithms, theoretical mechanics, memory trade-offs, vector math, and learning concepts suitable for an CS student.",
    Researcher: "Focus on state-of-the-art paper innovations, loss functions, embedding space geometry, attention variants, and breakthroughs.",
    Engineer: "Focus on production AI systems, distributed vLLM serving, HNSW vector database indexing, MCP protocol integration, OpenTelemetry tracing, and VRAM optimization."
  };
  const roleContext = personaGuidance[candidateRole] || personaGuidance.Engineer;

  const interviewerGuidance = {
    Backend: "You are a Backend Systems Architect. Focus questions on system design, database schemas, scaling, caching, API protocols (REST/gRPC/GraphQL), concurrent workers, queue systems, and backend security.",
    Frontend: "You are a Lead Frontend Engineer. Focus questions on web performance, HTML/CSS layouts, DOM manipulation, browser rendering, frameworks (React/Vue/etc.), security (XSS/CSRF), client state, and responsive design.",
    DSA: "You are an Algorithms & Data Structures Expert. Focus questions on algorithmic logic, algorithmic complexity (Big O), trees, graphs, sorting, searching, dynamic programming, and space/time tradeoffs.",
    Startup: "You are a Startup CTO. Focus questions on rapid prototyping, pragmatic tradeoffs, building from zero to MVP, serverless architectures, devops simplicity, agile engineering, and vertical optimization.",
    "HR-style": "You are a Technical Recruiting Director. Focus behavioral questions on behavioral scenarios, engineering teamwork, code review conflicts, sprint prioritization, learning from failure, leadership, and collaboration."
  };
  const selectedPersonaContext = interviewerGuidance[interviewerPersona] || interviewerGuidance.Backend;

  const resumeContext = resumeDetails ? `
CANDIDATE RESUME PROFILE:
- Extracted Skills: ${resumeDetails.skills?.join(', ') || 'N/A'}
- Extracted Projects:
${resumeDetails.projects?.map(p => `- ${p.name}: ${p.description}`).join('\n') || 'N/A'}

INSTRUCTION: Integrate the candidate's actual projects or skills from their resume context directly into the question scenario to personalize the interview. Ask them how they would scale, redesign, or apply standard concepts to their own projects or using their skills.
` : '';

  const askedList = askedQuestionTitles.length > 0
    ? askedQuestionTitles.map((t, idx) => `- Q${idx+1}: "${t}"`).join('\n')
    : 'No questions asked yet.';

  const focusKeywords = {
    Student: ['BM25 vs dense vectors', 'Reciprocal Rank Fusion (RRF)', 'zero-shot vs few-shot', 'ReAct agent loops', 'instruction fine-tuning', 'vector space cosine distance'],
    Researcher: ['InfoNCE contrastive loss', 'FlashAttention Online Softmax', 'QLoRA double quantization', 'Direct Preference Optimization (DPO)', 'representation collapse bounds', 'gradient check-pointing trade-offs'],
    Engineer: ['vLLM KV-cache virtual memory paging', 'HNSW index ef_construction tuning', 'Model Context Protocol capability negotiation', 'semantic text chunking strategy', 'OpenTelemetry latency profiling', 'Ray distributed inference scheduling']
  };
  const list = focusKeywords[candidateRole] || focusKeywords.Engineer;
  const selectedFocus = list[Math.floor(Math.random() * list.length)];

  const prompt = `
<question_generator>
You are an Expert AI Technical Interviewer creating Question #${qNum}.

INTERVIEWER PERSONA STYLE:
${selectedPersonaContext}

${resumeContext}

CANDIDATE PROFILE:
- Level: ${userLevel}
- Role: ${candidateRole} — ${roleContext}

PREVIOUSLY COVERED QUESTIONS (CRITICAL: DO NOT REPEAT OR GENERATE QUESTIONS ON THESE TOPICS):
${askedList}

${previousQuestion && previousAnswer ? `
PREVIOUS TURN:
- Q: "${previousQuestion.title || previousQuestion}"
- Answer: "${previousAnswer?.substring(0, 300)}"
- Score: ${prevScore}/10
- Next action: ${isHighPerformer ? 'Probe deeper into advanced edge-cases.' : isLowPerformer ? 'Ask a foundational clarifying question on the same topic area.' : 'Progress to the next logical module.'}
` : `This is Question #1 — create an engaging high-impact opening scenario for a ${candidateRole} at ${userLevel} level.`}

TASK:
Generate ONE novel, scenario-driven open-ended technical question.
- Frame the scenario or concepts around this key focus topic: "${selectedFocus}" (ensure variety across runs)
- Make it highly specific and non-generic.
- The question must NOT repeat or overlap with any previously covered questions.

Return ONLY this JSON:
{
  "id": ${qNum},
  "category": "Category Name",
  "type": "text",
  "title": "Clear scenario-driven question text...",
  "hint": "One-sentence technical pro-tip"
}
</question_generator>`;

  // 1. Query Groq API
  try {
    const content = await callGroq(prompt, { model: 'llama-3.3-70b-versatile', temperature: 0.7, isJson: true });
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.title) {
        return { id: qNum, category: parsed.category || 'AI Systems Architecture', type: 'text', title: parsed.title, hint: parsed.hint || 'Consider production trade-offs and latency metrics.' };
      }
    }
  } catch (groqErr) {
    console.warn("Groq question generation failed, falling back to local fallback pools:", groqErr?.message);
  }

  // Local fallback pools
  const personaPools = {
    Student: [
      { category: "RAG & Vector Fundamentals", title: "As a computer science student building your first RAG application, how do dense vector embeddings differ from sparse BM25 keyword matching? When would you combine both using Reciprocal Rank Fusion (RRF)?", hint: "Discuss semantic similarity vs exact token matching and how RRF merges rank lists." },
      { category: "Prompt Engineering & Schema", title: "Explain how zero-shot and few-shot prompting influence LLM output quality. How would you structure a system prompt to guarantee clean JSON output?", hint: "Mention JSON schema constraints, delimiter tags, and few-shot input-output pairs." },
      { category: "Agentic AI Loops", title: "What is the ReAct (Reason + Act) loop in AI Agents? Walk me through how an agent decides when to stop calling external tools and return a final answer.", hint: "Explain Thought → Action → Observation cycles and stopping criteria." },
      { category: "Fine-Tuning Concepts", title: "Explain the fundamental difference between Pre-training, Instruction Fine-Tuning, and Parameter-Efficient Fine-Tuning (PEFT/LoRA).", hint: "Discuss raw corpus training vs instruction-following data and low-rank matrix adapter updates." }
    ],
    Researcher: [
      { category: "Embedding Geometry & Loss", title: "In novel embedding model research, how does InfoNCE contrastive loss optimize representation alignment and uniformity across multi-modal vector spaces?", hint: "Discuss positive vs negative pair temperature scaling, cosine distance bounds, and representation collapse." },
      { category: "Attention Mechanics", title: "Compare FlashAttention-2 vs standard Self-Attention. How does IO-awareness and GPU SRAM tiling reduce memory read/write bottlenecks during long-context training?", hint: "Explain HBM vs SRAM memory bandwidth, online softmax scaling, and recomputation." },
      { category: "Fine-Tuning & Quantization", title: "Explain QLoRA's NF4 quantization data type and Double Quantization mechanism. How does it maintain model performance while reducing memory footprint?", hint: "Discuss zero-mean unit-variance distribution quantization, blockwise scale factors, and FP16 dequantization." },
      { category: "Agent Alignment & RLHF", title: "How does Direct Preference Optimization (DPO) simplify LLM alignment compared to traditional RLHF with explicit reward modeling (PPO)?", hint: "Discuss implicit reward formulation, reference model log-ratio loss, and eliminating PPO actor-critic instability." }
    ],
    Engineer: [
      { category: "RAG & Vector DB Architecture", title: "Walk me through your document chunking strategy for complex PDFs containing tables and text. How do you prevent context loss across semantic boundaries?", hint: "Mention Parent-Child splitters, Semantic Chunking, and JSON-encoded tabular context." },
      { category: "Vector Index Tuning", title: "In an HNSW vector index, what is the primary operational trade-off when tuning the 'M' and 'ef_construction' parameters during high-throughput ingestion?", hint: "Discuss RAM footprint, bi-directional graph connectivity, build latency, and search recall." },
      { category: "Model Context Protocol (MCP)", title: "What key advantage does MCP offer over standard REST API tool calling? How do you implement capability negotiation and resource security scoping?", hint: "Discuss STDIO vs SSE transport, capability registration, tool isolation, and authorization." },
      { category: "AI Inference & vLLM Serving", title: "Why does vLLM's PagedAttention architecture achieve 2-4x higher inference throughput compared to standard Transformers serving?", hint: "Explain virtual memory paging, KV-cache block allocation, and elimination of VRAM fragmentation." }
    ]
  };

  const pool = personaPools[candidateRole] || personaPools.Engineer;
  const unasked = pool.filter(p => !askedQuestionTitles.includes(p.title));
  const finalPool = unasked.length > 0 ? unasked : pool;

  const idx = Math.floor(Math.random() * finalPool.length);
  const pick = finalPool[idx];
  return { id: qNum, category: pick.category, type: 'text', title: pick.title, hint: pick.hint };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT BOT
// ─────────────────────────────────────────────────────────────────────────────

export async function askSupportBotGemini(userQuery) {
  const systemPrompt = `You are "Groq Support Bot", a friendly expert support AI for InterviewAgent.AI.

User Question: "${userQuery}"

Instructions:
1. Provide a concise response (max 2 short paragraphs).
2. The AI Evaluator engine is powered exclusively by Groq Llama 3.3.
3. Interviews feature open-ended adaptive scenarios (8–20 questions) with live feedback and timer.`;

  try {
    const content = await callGroq(systemPrompt, { model: 'llama-3.3-70b-versatile', temperature: 0.7, isJson: false });
    if (content?.trim()) return content.trim();
  } catch (e) {
    console.warn("Groq support bot failed:", e?.message);
  }

  const q = (userQuery || '').toLowerCase();
  if (q.includes('key') || q.includes('api')) return "🔑 **API Configurations**: The system is fully powered by Groq Llama 3.3. The API key is pre-configured in the environment.";
  if (q.includes('format') || q.includes('question')) return "⚡ **Interview Format**: Adaptive scenarios covering RAG, Vector DBs, MCP, Agents, LoRA. 8–20 questions, live feedback, question timer, skip & review!";
  return "👋 **Welcome to InterviewAgent.AI!** Powered by Llama 3.3. Click **Candidate Login** to begin your technical assessment!";
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATIONAL INTENT DETECTION
// ─────────────────────────────────────────────────────────────────────────────

export function localIntentFallback(userMessage, currentQuestion) {
  const msg = (userMessage || '').trim().toLowerCase();
  const wordCount = msg.split(/\s+/).filter(Boolean).length;
  
  // Insults, casual banter, general questions, greetings
  const isOffTopic = /fool|stupid|dumb|idiot|suck|useless|jerk|bot|creator|created|who are you|weather|what is the time|hello|hi|hey|how are you|how's it going/i.test(msg);
  
  // If the message is off-topic or looks like an insult, classify as OFF_TOPIC
  if (isOffTopic) {
    return {
      intent: "OFF_TOPIC",
      confidence: 0.9,
      response: "Let's stay focused on the technical interview. Whenever you're ready, please provide your answer to the question above.",
      shouldEvaluate: false,
      shouldAdvance: false,
      shouldPause: false
    };
  }

  // Check if it's a technical answer first, even if it has some conversation-related words
  const hasTechnicalTerms = /hnsw|bm25|rrf|mcp|vllm|rag|lora|paged|attention|embedding|vector|chunk|polymorphism|interface|class|function|method|object|inherit|java|oop|encapsulate/i.test(msg);
  
  if (wordCount > 6 && hasTechnicalTerms) {
    return {
      intent: "NORMAL_ANSWER",
      confidence: 0.9,
      response: "",
      shouldEvaluate: true,
      shouldAdvance: true,
      shouldPause: false
    };
  }

  // Short non-technical messages
  if (wordCount < 4 && !hasTechnicalTerms) {
    return {
      intent: "GENERAL_CONVERSATION",
      confidence: 0.9,
      response: "I didn't quite catch that as a technical response. Could you please explain your answer in more detail? Alternatively, you can skip this question.",
      shouldEvaluate: false,
      shouldAdvance: false,
      shouldPause: false
    };
  }

  if (/^(i don't know|i am not sure|i'm not sure|i cant remember|i can't remember|don't know this|not sure)$/i.test(msg) || 
      (msg.includes("don't know") && msg.length < 30) ||
      (msg.includes("not sure") && msg.length < 30)) {
    return {
      intent: "NOT_SURE",
      confidence: 0.9,
      response: currentQuestion?.hint ? `No problem. Here's a quick hint: ${currentQuestion.hint}. Try your best, or you can skip this question if you prefer.` : "No problem! Take a guess or explain what you know about the topic, or feel free to skip the question.",
      shouldEvaluate: false,
      shouldAdvance: false,
      shouldPause: false
    };
  }

  if (msg.includes("skip") && msg.length < 30) {
    return {
      intent: "SKIP_QUESTION",
      confidence: 0.9,
      response: "",
      shouldEvaluate: false,
      shouldAdvance: true,
      shouldPause: false
    };
  }

  if (msg.includes("repeat") || msg.includes("explain the question") || msg.includes("didn't understand") || msg.includes("dont understand")) {
    return {
      intent: "REPEAT_QUESTION",
      confidence: 0.9,
      response: `Certainly! The question is: "${currentQuestion?.title}". We are looking to understand your approach and trade-offs. ${currentQuestion?.hint ? 'Pro-Tip: ' + currentQuestion.hint : ''}`,
      shouldEvaluate: false,
      shouldAdvance: false,
      shouldPause: false
    };
  }

  if (msg.includes("sick") || msg.includes("not feeling well") || msg.includes("not well") || msg.includes("unwell") || msg.includes("need a break") || msg.includes("tired")) {
    return {
      intent: "WELLBEING",
      confidence: 0.9,
      response: "I'm sorry you're not feeling well. Please don't push yourself. We can pause the interview and you can continue when you're ready. Would you like to take a short break?",
      shouldEvaluate: false,
      shouldAdvance: false,
      shouldPause: true
    };
  }

  if (msg.includes("nervous") || msg.includes("scared") || msg.includes("anxious") || msg.includes("stressed")) {
    return {
      intent: "NERVOUS_OR_ANXIOUS",
      confidence: 0.9,
      response: "That's completely understandable. Take a moment, and whenever you're ready, we can continue. There's no need to rush.",
      shouldEvaluate: false,
      shouldAdvance: false,
      shouldPause: false
    };
  }

  if (msg.includes("ready") || msg.includes("continue") || msg.includes("resume") || msg.includes("feeling better")) {
    return {
      intent: "RESUME_INTERVIEW",
      confidence: 0.9,
      response: `Glad you're ready! Let's resume. The active question is: "${currentQuestion?.title}"`,
      shouldEvaluate: false,
      shouldAdvance: false,
      shouldPause: false
    };
  }

  // Default fallback is NORMAL_ANSWER
  return {
    intent: "NORMAL_ANSWER",
    confidence: 0.5,
    response: "",
    shouldEvaluate: true,
    shouldAdvance: true,
    shouldPause: false
  };
}

export async function detectConversationIntent({ currentQuestion, userMessage }) {
  const prompt = `
You are an AI Interviewer Assistant. Classify the candidate's message and determine the correct system actions.

CURRENT QUESTION:
- Title: "${currentQuestion?.title || ''}"
- Hint: "${currentQuestion?.hint || ''}"

CANDIDATE'S MESSAGE:
"${userMessage}"

CLASSIFICATION GUIDELINES & INTENTS:
1. NORMAL_ANSWER: The candidate is actually answering the interview question (even if they also mention they are tired/nervous/sick but proceed to explain the technical concepts).
   - Edge case: If the message contains BOTH a technical explanation and wellbeing/nervous status (e.g. "I'm not feeling well, but polymorphism is..."), you MUST classify it as NORMAL_ANSWER.
   - shouldEvaluate = true, shouldAdvance = true, shouldPause = false, response = ""

2. NOT_SURE: Candidate expresses uncertainty, lack of knowledge, or confusion about the answer (e.g. "I don't know", "I'm not sure", "I can't remember", "I don't know this").
   - shouldEvaluate = false, shouldAdvance = false, shouldPause = false
   - response: A supportive conversational message. Offer a small hint or guide them to try their best (without revealing the full answer).

3. REPEAT_QUESTION: Candidate asks to repeat, clarify, or explain the question (e.g. "Can you repeat?", "I don't understand the question", "Explain it").
   - shouldEvaluate = false, shouldAdvance = false, shouldPause = false
   - response: Rephrase or repeat the current question clearly and supportively.

4. SKIP_QUESTION: Candidate explicitly asks to skip the question (e.g. "Skip this", "Can we skip?").
   - shouldEvaluate = false, shouldAdvance = true, shouldPause = false
   - response: ""

5. WELLBEING: Candidate mentions feeling unwell, sick, tired, needing a break, etc. (and does NOT try to answer the question).
   - shouldEvaluate = false, shouldAdvance = false, shouldPause = true
   - response: An empathetic and brief message suggesting a break or pause. Example: "I'm sorry you're not feeling well. Please don't push yourself. We can pause the interview and you can continue when you're ready. Would you like to take a short break?"

6. NERVOUS_OR_ANXIOUS: Candidate expresses anxiety, stress, or nervousness (e.g. "I'm nervous", "I'm stressed", "I'm scared").
   - shouldEvaluate = false, shouldAdvance = false, shouldPause = false
   - response: An encouraging and reassuring message. Example: "That's completely understandable. Take a moment, and whenever you're ready, we can continue. There's no need to rush."

7. OFF_TOPIC: Candidate talks about unrelated things (e.g. weather, general questions, asking who created this, or making off-topic remarks, insults, or random comments like "you are fool", "you are stupid").
   - shouldEvaluate = false, shouldAdvance = false, shouldPause = false
   - response: A polite and brief response that redirects them back to the active question.

8. RESUME_INTERVIEW: Candidate states they are ready to continue or resume after a pause or break (e.g. "I'm ready", "Let's continue", "Continue", "I'm feeling better").
   - shouldEvaluate = false, shouldAdvance = false, shouldPause = false
   - response: A friendly welcoming message resuming the interview.

9. GENERAL_CONVERSATION: Normal friendly conversation, greetings (like "hello", "hi", "how are you"), or casual remarks that do not answer the question.
   - shouldEvaluate = false, shouldAdvance = false, shouldPause = false
   - response: A brief, natural response returning them to the interview.

Return ONLY this JSON schema (do not wrap in markdown or backticks, return raw JSON):
{
  "intent": "NORMAL_ANSWER | NOT_SURE | REPEAT_QUESTION | SKIP_QUESTION | WELLBEING | NERVOUS_OR_ANXIOUS | OFF_TOPIC | RESUME_INTERVIEW | GENERAL_CONVERSATION",
  "confidence": <decimal between 0 and 1>,
  "response": "<conversational text response for the candidate>",
  "shouldEvaluate": <boolean>,
  "shouldAdvance": <boolean>,
  "shouldPause": <boolean>
}
`;

  try {
    const content = await callGroq(prompt, { model: 'llama-3.3-70b-versatile', temperature: 0.1, isJson: true });
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.intent) {
        return parsed;
      }
    }
  } catch (groqErr) {
    console.warn("Groq intent detection failed, falling back to local detection:", groqErr?.message);
  }

  return localIntentFallback(userMessage, currentQuestion);
}

export async function extractResumeDetails(resumeText) {
  const prompt = `
Analyze the following resume text and extract the candidate's core technical skills and main projects.

RESUME TEXT:
"""
${resumeText}
"""

Return ONLY this JSON schema (do not wrap in markdown or backticks, return raw JSON):
{
  "skills": ["skill1", "skill2", "skill3", ...],
  "projects": [
    {
      "name": "Project Name",
      "description": "Short description of what the project did and technologies used"
    }
  ]
}
`;

  try {
    const content = await callGroq(prompt, { model: 'llama-3.3-70b-versatile', temperature: 0.1, isJson: true });
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.skills) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Groq resume extraction failed, returning fallback:", err);
  }

  // Local fallback parser
  const skills = [];
  const words = resumeText.toLowerCase();
  const techTerms = ['react', 'vue', 'angular', 'node', 'python', 'javascript', 'typescript', 'go', 'rust', 'c++', 'java', 'sql', 'nosql', 'mongodb', 'postgresql', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'pytorch', 'tensorflow', 'llm', 'rag', 'groq', 'llama', 'openai', 'gemini', 'mcp'];
  techTerms.forEach(term => {
    if (words.includes(term)) {
      skills.push(term.charAt(0).toUpperCase() + term.slice(1));
    }
  });

  return {
    skills: skills.length > 0 ? skills : ["Software Development", "System Design"],
    projects: []
  };
}


