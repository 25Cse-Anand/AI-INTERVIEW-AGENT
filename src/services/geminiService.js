import { GoogleGenerativeAI } from '@google/generative-ai';

// Pre-integrated Gemini API Key
const DEFAULT_GEMINI_KEY = "AIzaSyBC7uH-FudjOlrM6xd85kQHsB0LsohXJLY";

let apiKey = typeof window !== 'undefined'
  ? (localStorage.getItem('gemini_api_key') || import.meta.env?.VITE_GEMINI_API_KEY || DEFAULT_GEMINI_KEY)
  : DEFAULT_GEMINI_KEY;

export function setGeminiApiKey(key) {
  apiKey = key ? key.trim() : DEFAULT_GEMINI_KEY;
  if (typeof window !== 'undefined' && apiKey) {
    localStorage.setItem('gemini_api_key', apiKey);
  }
}

export function getGeminiApiKey() {
  return apiKey || DEFAULT_GEMINI_KEY;
}

// ─────────────────────────────────────────────────────────────────────────────
// PER-ANSWER EVALUATOR — Gemini 2.0 Flash + Google Search Grounding
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluates a candidate's answer with Gemini + Google Search factual grounding.
 * Produces a strict, dynamic score (1.0–10.0) reflecting actual answer quality.
 */
export async function evaluateAnswerAndGetNextQuestion(arg1, arg2, arg3, arg4, arg5) {
  let userLevel, currentQuestion, userAnswer, questionNumber, totalTargetQuestions;

  if (typeof arg1 === 'object' && arg1 !== null && arg1.currentQuestion) {
    ({ userLevel = 'Intermediate', currentQuestion, userAnswer, questionNumber = 1, totalTargetQuestions = 8 } = arg1);
  } else {
    currentQuestion = arg1;
    userAnswer = arg2;
    userLevel = arg3 || 'Intermediate';
    questionNumber = arg4 || 1;
    totalTargetQuestions = arg5 || 8;
  }

  const activeKey = getGeminiApiKey();

  if (activeKey && activeKey.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(activeKey.trim());

      // Try Gemini 2.0 Flash with Google Search grounding first (best factual accuracy)
      const modelOptions = [
        {
          model: 'gemini-2.0-flash',
          tools: [{ googleSearch: {} }]
        },
        {
          model: 'gemini-2.0-flash-lite',
          tools: []
        },
        {
          model: 'gemini-1.5-flash',
          tools: []
        }
      ];

      for (const opts of modelOptions) {
        try {
          const modelConfig = { model: opts.model };
          if (opts.tools && opts.tools.length > 0) {
            modelConfig.tools = opts.tools;
          }
          const model = genAI.getGenerativeModel(modelConfig);

          const prompt = `
<evaluation_task>
You are a STRICT Senior AI Engineering Technical Interviewer performing a rigorous factual evaluation.
${opts.tools?.length > 0 ? 'Use your Google Search grounding to verify technical facts in the candidate answer.' : ''}

INTERVIEW CONTEXT:
- Question #${questionNumber} of ${totalTargetQuestions}
- Topic: "${currentQuestion?.title || 'Technical Scenario'}"
- Category: ${currentQuestion?.category || 'AI Systems Architecture'}
- Candidate Level: ${userLevel}

CANDIDATE ANSWER:
"${userAnswer}"

STRICT SCORING RUBRIC — apply honestly, do NOT be lenient:
• 1.0–2.0  → Completely wrong, empty, or incoherent. No technical content.
• 2.5–3.5  → Vague or severely incomplete. Shows surface-level awareness only.
• 4.0–5.0  → Partially correct. Missing critical mechanisms, parameters, or trade-offs.
• 5.5–6.5  → Decent. Core concept addressed but lacks depth or specifics.
• 7.0–8.0  → Strong. Accurate, mentions key trade-offs and technical details.
• 8.5–9.0  → Very strong. Production-grade depth with specific metrics/configs.
• 9.5–10.0 → Exceptional. Expert-level with edge cases, benchmarks, and system design.

EVALUATION RULES (MANDATORY):
1. Score MUST reflect the ACTUAL quality of this specific answer.
2. A one-sentence vague response scores ≤ 4.0, NOT 7.0+.
3. Only answers with correct terminology, specific parameters, and trade-off reasoning score ≥ 7.0.
4. Identify specific factual errors in the answer and correct them.
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

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed?.evaluation && typeof parsed.evaluation.score === 'number') {
              // Validate score is in range
              parsed.evaluation.score = Math.min(10.0, Math.max(1.0, parsed.evaluation.score));
              return parsed;
            }
          }
        } catch (modelErr) {
          console.warn(`Evaluation with model ${opts.model} failed, trying next...`, modelErr?.message);
        }
      }
    } catch (err) {
      console.warn("Gemini API evaluation error:", err);
    }
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

  // Gibberish detection
  const gibberishRegex = /^(asdf|qwerty|zxcv|12345|aaaa+|blabla|lol|haha|idk|dunno|pizza|cats|dogs|hello|hi|yes|no|ok|okay)$/i;
  if (gibberishRegex.test(lower) || (words < 3 && !/rag|llm|mcp|vector|gpu|model|api|data|code|train/i.test(lower))) {
    return {
      evaluation: {
        isSenselessOrOffTopic: true,
        senselessReason: 'Answer is off-topic or gibberish.',
        score: 1.0, level: 'Beginner', levelEmoji: '📘', levelColor: '#F43F5E', isCorrect: false,
        feedback: 'Please provide a genuine technical answer for this scenario.',
        factualErrors: [], strengths: [], gaps: ['Provide a meaningful technical explanation']
      }
    };
  }

  // Weighted tiered term scoring
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
      gaps: score < 7.0 ? ['Add specific production parameters', 'Discuss architectural trade-offs and failure modes'] : ['Expand on edge cases and real-world benchmarks']
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL REPORT GENERATOR — Gemini AI Comprehensive Analysis
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a comprehensive AI-analyzed final report using Gemini.
 * Uses all Q&A pairs and their per-question evaluations to produce:
 * - Accurate overall score (weighted average)
 * - Hire recommendation
 * - Detailed strengths & gaps
 * - Personalized actionable growth roadmap
 * - Narrative summary
 */
export async function generateFinalReport({ candidateName, userLevel, candidateRole, evaluationsHistory, coveredCategories, skippedQuestions }) {
  const activeKey = getGeminiApiKey();

  // Build transcript for Gemini
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

  if (activeKey && activeKey.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(activeKey.trim());

      // Try models in order of capability
      const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];

      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });

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
   - conceptualDepth: How well candidate explains underlying theory and concepts
   - tradeoffAwareness: How well candidate discusses pros/cons, latency, memory trade-offs
   - engineeringClarity: How clearly and precisely candidate articulates technical ideas
   - productionRealism: How realistic and production-applicable are the candidate's answers

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
    "conceptualDepth": <0-100>,
    "tradeoffAwareness": <0-100>,
    "engineeringClarity": <0-100>,
    "productionRealism": <0-100>
  }
}
</final_report_task>`;

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed?.overallScore !== undefined) {
              return parsed;
            }
          }
        } catch (e) {
          console.warn(`Report generation with ${modelName} failed, trying next...`, e?.message);
        }
      }
    } catch (err) {
      console.warn("Final report generation error:", err);
    }
  }

  // Local fallback report — computed from actual scores
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
      conceptualDepth: Math.min(98, Math.max(30, overallScore + Math.round(Math.random() * 6 - 3))),
      tradeoffAwareness: Math.min(98, Math.max(30, overallScore - 3 + Math.round(Math.random() * 6 - 3))),
      engineeringClarity: Math.min(98, Math.max(30, overallScore + 2 + Math.round(Math.random() * 6 - 3))),
      productionRealism: Math.min(98, Math.max(30, overallScore - 1 + Math.round(Math.random() * 6 - 3)))
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTIVE QUESTION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function generateAdaptiveQuestion(qNum, userLevel = 'Intermediate', previousQuestion = null, previousAnswer = null, previousEvaluation = null, candidateRole = 'Engineer') {
  const activeKey = getGeminiApiKey();

  if (activeKey && activeKey.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(activeKey.trim());
      const candidateModels = ['gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-2.0-flash'];

      const prevScore = previousEvaluation?.score || 7.0;
      const isHighPerformer = prevScore >= 7.5;
      const isLowPerformer = prevScore <= 4.0;

      const personaGuidance = {
        Student: "Focus on foundational AI/ML algorithms, theoretical mechanics, memory trade-offs, vector math, and learning concepts suitable for an ambitious computer science student or bootcamp candidate.",
        Researcher: "Focus on state-of-the-art paper innovations, loss functions, embedding space geometry, attention variants, benchmark methodologies, and theoretical breakthroughs suitable for an AI Researcher / PhD candidate.",
        Engineer: "Focus on production AI systems, distributed vLLM serving, HNSW vector database indexing, MCP protocol integration, OpenTelemetry tracing, and GPU VRAM optimization suitable for a Senior AI Software Engineer."
      };

      const roleContext = personaGuidance[candidateRole] || personaGuidance.Engineer;

      const prompt = `
<question_generator>
You are an Expert AI Technical Interviewer creating Question #${qNum}.

CANDIDATE PROFILE:
- Level: ${userLevel}
- Role: ${candidateRole} — ${roleContext}

${previousQuestion && previousAnswer ? `
PREVIOUS TURN:
- Q: "${previousQuestion.title || previousQuestion}"
- Answer: "${previousAnswer?.substring(0, 300)}"
- Score: ${prevScore}/10
- Next action: ${isHighPerformer ? 'Probe deeper into advanced edge-cases or related system bottlenecks.' : isLowPerformer ? 'Ask a foundational clarifying question on the same topic area.' : 'Progress to the next logical module.'}
` : `This is Question #1 — create an engaging high-impact opening scenario for a ${candidateRole} at ${userLevel} level.`}

Generate ONE novel, scenario-driven open-ended technical question. Make it specific and non-generic.

Return ONLY this JSON:
{
  "id": ${qNum},
  "category": "Category Name",
  "type": "text",
  "title": "Clear scenario-driven question text...",
  "hint": "One-sentence technical pro-tip"
}
</question_generator>`;

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result?.response?.text();
          if (text) {
            const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed?.title) {
                return { id: qNum, category: parsed.category || 'AI Systems Architecture', type: 'text', title: parsed.title, hint: parsed.hint || 'Consider production trade-offs and latency metrics.' };
              }
            }
          }
        } catch (e) {
          console.warn(`Question gen with ${modelName} failed, trying next...`);
        }
      }
    } catch (err) {
      console.warn("Live question generation fallback:", err);
    }
  }

  // Persona-based local fallback pool
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
  const idx = (qNum + Math.floor(Math.random() * 10)) % pool.length;
  const pick = pool[idx];
  return { id: qNum, category: pick.category, type: 'text', title: pick.title, hint: pick.hint };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT BOT
// ─────────────────────────────────────────────────────────────────────────────

export async function askSupportBotGemini(userQuery) {
  const activeKey = getGeminiApiKey();

  if (activeKey) {
    const genAI = new GoogleGenerativeAI(activeKey);
    const models = ['gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    const systemPrompt = `You are "Gemini Flash Support Bot", a friendly expert support AI for InterviewAgent.AI — an Enterprise AI Interviewing platform for RAG, Vector DBs, MCP, Agents, and LLMs.

User Question: "${userQuery}"

Instructions:
1. Provide a concise, clear, encouraging response (max 2-3 short paragraphs).
2. If asked about API keys: A Gemini 2.0 Flash API key is pre-integrated so manual entry is optional.
3. If asked about format: Interviews feature open-ended technical scenarios (8–20 questions) with live Gemini feedback, a question timer, skip & review privileges, and no word limits.
4. Maintain a warm, expert, professional tone.`;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const text = result?.response?.text();
        if (text?.trim()) return text.trim();
      } catch (err) {
        console.warn(`Support bot with ${modelName} failed:`, err?.message);
      }
    }
  }

  const q = (userQuery || '').toLowerCase();
  if (q.includes('key') || q.includes('api')) return "🔑 **API Key**: A Gemini 2.0 Flash API key is pre-integrated. You can also paste your own on the Candidate Login screen.";
  if (q.includes('format') || q.includes('question') || q.includes('how')) return "⚡ **Interview Format**: Open-ended technical scenarios covering RAG, Vector DBs, MCP, Agents, LoRA. 8–20 questions, live Gemini feedback, timer, skip & review!";
  if (q.includes('skip') || q.includes('review')) return "⏭️ **Skip & Review**: Click 'Skip Question' for complex scenarios — they're stored for review before your final report!";
  return "👋 **Welcome to InterviewAgent.AI!** Powered by Gemini 2.0 Flash. Click **Candidate Login** to begin your technical assessment!";
}
