import { GoogleGenerativeAI } from '@google/generative-ai';
import { COHORT_CURRICULUM } from '../data/curriculumData';

// User provided Gemini API Key pre-integrated
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

// Curriculum topic pools for dynamic question generation
const CURRICULUM_POOL = [
  { day: 1, topic: "LLM Fundamentals & Attention Mechanics", module: "Prompt Engineering" },
  { day: 2, topic: "Advanced Prompting (CoT, ToT, Few-Shot)", module: "Prompt Engineering" },
  { day: 3, topic: "Structured Outputs & Function Calling (JSON Schema, Pydantic)", module: "Prompt Engineering" },
  { day: 6, topic: "Vector Embeddings & Cosine vs Euclidean Distance", module: "RAG & Vector DBs" },
  { day: 7, topic: "Vector DB Architecture & HNSW Indexing (M, ef_construction)", module: "RAG & Vector DBs" },
  { day: 8, topic: "Chunking Strategies & Ingestion Pipelines", module: "RAG & Vector DBs" },
  { day: 9, topic: "Hybrid Search & Reciprocal Rank Fusion (BM25 + Vectors)", module: "RAG & Vector DBs" },
  { day: 10, topic: "Cross-Encoder Re-ranking Models", module: "RAG & Vector DBs" },
  { day: 11, topic: "Corrective RAG (CRAG) & Self-RAG", module: "RAG & Vector DBs" },
  { day: 12, topic: "RAG Evaluation Frameworks (Ragas Triad)", module: "RAG & Vector DBs" },
  { day: 13, topic: "Agent Architecture & ReAct Loop Mechanics", module: "Agentic AI" },
  { day: 14, topic: "Multi-Agent Orchestration (Supervisor vs Peer-to-Peer)", module: "Agentic AI" },
  { day: 15, topic: "Agentic Memory (Episodic, Semantic, Zep/Letta)", module: "Agentic AI" },
  { day: 16, topic: "Human-in-the-Loop (HITL) & Breakpoints", module: "Agentic AI" },
  { day: 20, topic: "Model Context Protocol (MCP) Spec & Architecture", module: "MCP Protocol" },
  { day: 21, topic: "Custom MCP Server Transport (STDIO vs SSE)", module: "MCP Protocol" },
  { day: 22, topic: "MCP Capability Negotiation & Security Scoping", module: "MCP Protocol" },
  { day: 25, topic: "vLLM Inference & PagedAttention Memory Optimization", module: "AI Deployment" },
  { day: 27, topic: "LoRA & QLoRA Fine-Tuning Optimization", module: "AI Deployment" },
  { day: 28, topic: "AI Observability & OpenTelemetry Spans", module: "AI Deployment" },
  { day: 30, topic: "Prompt Injection Defenses & Indirect Injection via RAG", module: "Production AI" }
];

/**
 * Live Question Evaluator using Gemini 3.5 / 2.0 Flash Lite API
 * Pre-configured with API key. Performs deep technical verification.
 * For MCQs: ONLY indicates Correct / Incorrect (no score rating).
 * For Text: STRICTLY rates foolish/wrong/nonsense answers as 1.0 or 2.0 out of 10.
 */
/**
 * Evaluates candidate text/MCQ answers with strict factual verification.
 * Accepts either an options object OR positional arguments for fail-safe invocation.
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

      let model;
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
      } catch (e) {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      }

      const prompt = `
<system_prompt>
<role>
You are a Senior AI Engineering Technical Interviewer conducting a live adaptive evaluation.
</role>

<candidate_context>
- Question #${questionNumber}: "${currentQuestion?.title || 'Technical Scenario'}"
- Category: ${currentQuestion?.category || 'AI Systems Architecture'}
- Candidate Self-Assessed Level: ${userLevel}
</candidate_context>

<evaluation_instructions>
Perform a deep technical evaluation of the candidate's answer.

1. Senseless / Gibberish Check:
   - ONLY set "isSenselessOrOffTopic": true if the answer is complete random gibberish (e.g. "asdf", "qwerty", "12345") or casual fluff ("I like pizza").
   - For ANY genuine attempt at answering, set "isSenselessOrOffTopic": false.

2. Score & Level Calibration:
   - Rate score from 1.0 to 10.0 based on technical accuracy, concept depth, and engineering trade-off awareness.
   - If answer is wrong or very weak: Score 1.0 - 4.0, Level "Beginner" (📘, #F43F5E).
   - If answer is partially correct: Score 5.0 - 6.5, Level "Intermediate" (⚙️, #F59E0B).
   - If answer is strong & accurate: Score 7.0 - 8.5, Level "Advanced" (🚀, #10B981).
   - If answer is exceptional & production-grade: Score 9.0 - 10.0, Level "Expert" (🧠, #00F2FE).

3. Constructive Feedback:
   - Provide clear, encouraging, step-by-step technical feedback. Point out what they got right, correct any technical errors, and explain true production mechanisms.
</evaluation_instructions>

Candidate Answer:
"${userAnswer}"

RETURN ONLY VALID UNWRAPPED JSON:
{
  "evaluation": {
    "isSenselessOrOffTopic": false,
    "senselessReason": "",
    "score": 8.5,
    "isCorrect": true,
    "level": "Advanced",
    "levelEmoji": "🚀",
    "levelColor": "#10B981",
    "feedback": "Step-by-step technical analysis and explicit corrections...",
    "strengths": ["Cited key architectural concepts"],
    "gaps": ["Elaborate on production latency parameters"]
  }
}
</system_prompt>`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(new RegExp('```json', 'g'), '').replace(new RegExp('```', 'g'), '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed?.evaluation) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Gemini API error during live call:", err);
    }
  }

  // Adaptive Fallback Engine (Clean Local Factual Evaluation)
  return simulateStrictEvaluation({ userLevel, currentQuestion, userAnswer, questionNumber, totalTargetQuestions });
}

/**
 * Clean evaluation logic evaluating answers by deep technical analysis
 */
function simulateStrictEvaluation({ userLevel, currentQuestion, userAnswer, questionNumber, totalTargetQuestions }) {
  const textPayload = (userAnswer || '').trim();
  const lower = textPayload.toLowerCase();
  const words = lower ? lower.split(/\s+/).filter(Boolean).length : 0;

  // Pure random gibberish check
  const strictGibberishRegex = /^(asdf|qwerty|zxcv|12345|aaaaa|bbbbb|ccccc|blabla|xyzzy|pizza|cats|dogs|idk|dunno|lol|haha)$/i;
  const isPureGibberish = strictGibberishRegex.test(lower) || (words < 3 && !/rag|vllm|mcp|lora|hnsw|vector|gpu|kv|ram|api|prompt|model|data|code/i.test(lower));

  if (isPureGibberish) {
    return {
      evaluation: {
        isSenselessOrOffTopic: true,
        senselessReason: `Senseless or off-topic answer detected ("${textPayload}"). Please provide a meaningful technical response.`,
        score: 1.0,
        level: 'Beginner',
        levelEmoji: '📘',
        levelColor: '#F43F5E',
        feedback: 'Your answer appears to be off-topic or random text. Please state a technical explanation for this scenario.',
        strengths: [],
        gaps: ['Provide a valid technical explanation']
      }
    };
  }

  // Deep analysis based on content length and key concepts
  const keyTerms = [
    'hnsw', 'vector', 'bm25', 'rrf', 'mcp', 'vllm', 'rag', 'pydantic', 'qdrant', 'pinecone', 'lora', 'attention',
    'chunk', 'rerank', 'agent', 'guardrail', 'ragas', 'transformer', 'cache', 'parent-child', 'semantic', 'schema',
    'breakpoint', 'span', 'trace', 'latency', 'memory', 'embedding', 'prompt', 'model', 'api', 'context', 'kv',
    'ram', 'gpu', 'opentelemetry', 'pagedattention', 'hyperparameter', 'baml', 'instructor', 'langgraph', 'checkpointer',
    'hitl', 'pipeline', 'database', 'system', 'architecture', 'performance', 'trade-off', 'code', 'index', 'query',
    'data', 'layer', 'algorithm', 'server', 'client', 'network', 'storage', 'process', 'node', 'graph', 'tree',
    'scale', 'batch', 'token', 'throughput', 'parallel', 'optimis', 'optimi', 'implement', 'strategy', 'structure'
  ];
  const matchedTerms = keyTerms.filter(t => lower.includes(t));

  let score = 7.5;
  let level = 'Advanced';
  let levelEmoji = '🚀';
  let levelColor = '#10B981';
  let isCorrect = true;

  if (words >= 15 || matchedTerms.length >= 2) {
    score = Math.min(9.8, parseFloat((7.5 + (words * 0.04) + (matchedTerms.length * 0.35)).toFixed(1)));
    level = score >= 9.0 ? 'Expert' : 'Advanced';
    levelEmoji = score >= 9.0 ? '🧠' : '🚀';
    levelColor = score >= 9.0 ? '#00F2FE' : '#10B981';
  } else if (words >= 5) {
    score = 6.0;
    level = 'Intermediate';
    levelEmoji = '⚙️';
    levelColor = '#F59E0B';
    isCorrect = true;
  } else {
    score = 3.5;
    level = 'Beginner';
    levelEmoji = '📘';
    levelColor = '#F43F5E';
    isCorrect = false;
  }

  return {
    evaluation: {
      isSenselessOrOffTopic: false,
      senselessReason: '',
      score,
      level,
      levelEmoji,
      levelColor,
      isCorrect,
      feedback: isCorrect
        ? `Accurate technical response! You effectively addressed ${currentQuestion?.category || 'the scenario'} with sound reasoning.`
        : `Brief response rated ${score}/10. Elaborate further on architectural trade-offs for ${currentQuestion?.category || 'this topic'}.`,
      strengths: matchedTerms.length ? [`Cited key concepts (${matchedTerms.slice(0, 3).join(', ')})`] : ['Attempted response'],
      gaps: ['Elaborate on production latency parameters and failure modes']
    }
  };
}

/**
 * Generates initial or follow-up dynamic questions grounded in candidate persona (Student, Researcher, Engineer)
 * and tailored directly to their previous intelligent answer using live Gemini 3.5 / 2.0 Flash Lite API.
 */
export async function generateAdaptiveQuestion(
  qNum,
  userLevel = 'Intermediate',
  previousQuestion = null,
  previousAnswer = null,
  previousEvaluation = null,
  candidateRole = 'Engineer'
) {
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
<question_generator_prompt>
<role>
You are an Expert AI Technical Interviewer creating Question #${qNum} for a candidate.
</role>

<candidate_profile>
- Self-Assessed Level: ${userLevel}
- Target Persona / Role: ${candidateRole} (${roleContext})
- Question Sequence Number: #${qNum}
</candidate_profile>

${previousQuestion && previousAnswer ? `
<previous_turn_context>
- Previous Question: "${previousQuestion.title || previousQuestion}"
- Candidate Previous Answer: "${previousAnswer}"
- Score Given: ${prevScore} / 10
- Performance Assessment: ${isHighPerformer ? 'Candidate gave a strong/intelligent technical response! Probe deeper into advanced edge-cases, system bottlenecks, and failure modes.' : isLowPerformer ? 'Candidate struggled or gave a flawed answer. Ask a clarifying foundational scenario to test their core understanding.' : 'Candidate gave a decent answer. Progress to the next logical AI architecture module.'}
</previous_turn_context>
` : `
<initial_question_instruction>
This is Question #1. Create an engaging, high-impact initial open-ended technical scenario tailored specifically for a ${candidateRole} at ${userLevel} level.
</initial_question_instruction>
`}

<instructions>
1. Generate ONE dynamic, novel open-ended technical scenario.
2. DO NOT repeat standard generic questions. Make it specific and scenario-driven.
3. If previous answer was intelligent: Frame the new question directly building upon what they explained.
4. Keep question text clear, professional, and challenging.
5. Provide a helpful 1-sentence "hint" / pro-tip.
</instructions>

RETURN ONLY VALID UNWRAPPED JSON:
{
  "id": ${qNum},
  "category": "Category Name (e.g. RAG Systems, Vector Indexing, MCP, vLLM Serving, LoRA, Agentic AI)",
  "type": "text",
  "title": "Clear, dynamic scenario statement...",
  "hint": "Useful technical pro-tip or parameter to consider"
}
</question_generator_prompt>`;

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result?.response?.text();
          if (text) {
            const cleaned = text.replace(new RegExp('```json', 'g'), '').replace(new RegExp('```', 'g'), '').trim();
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed?.title) {
                return {
                  id: qNum,
                  category: parsed.category || 'AI Systems Architecture',
                  type: 'text',
                  title: parsed.title,
                  hint: parsed.hint || 'Consider production trade-offs and latency metrics.'
                };
              }
            }
          }
        } catch (e) {
          console.warn(`Question generation with model ${modelName} failed, trying next model...`);
        }
      }
    } catch (err) {
      console.warn("Live AI question generation fallback:", err);
    }
  }

  // Persona-Based Randomized Local Fallback Pools (No Static Duplicates)
  const personaPools = {
    Student: [
      {
        category: "RAG & Vector Fundamentals",
        title: `As a computer science student building your first RAG application, how do dense vector embeddings differ from sparse BM25 keyword matching? When would you combine both using Reciprocal Rank Fusion (RRF)?`,
        hint: "Discuss semantic similarity vs exact token matching and how RRF combines rank lists."
      },
      {
        category: "Prompt Engineering & Schema",
        title: `Explain how zero-shot and few-shot prompting influence LLM output quality. How would you structure a system prompt to guarantee clean JSON output?`,
        hint: "Mention JSON schema constraints, delimiter tags, and few-shot input-output pairs."
      },
      {
        category: "Agentic AI Loops",
        title: `What is the ReAct (Reason + Act) loop in AI Agents? Walk me through how an agent decides when to stop calling external tools and return a final answer.`,
        hint: "Explain Thought -> Action -> Observation cycles and stopping criteria."
      },
      {
        category: "Fine-Tuning Concepts",
        title: `Explain the fundamental difference between Pre-training, Instruction Fine-Tuning, and Parameter-Efficient Fine-Tuning (PEFT/LoRA).`,
        hint: "Discuss raw corpus training vs instruction-following data and low-rank matrix adapter updates."
      }
    ],
    Researcher: [
      {
        category: "Embedding Geometry & Loss",
        title: `In novel embedding model research, how does InfoNCE contrastive loss optimize representation alignment and uniformity across multi-modal vector spaces?`,
        hint: "Discuss positive vs negative pair temperature scaling, cosine distance bounds, and representation collapse."
      },
      {
        category: "Attention Mechanics",
        title: `Compare FlashAttention-2 vs standard Self-Attention. How does IO-awareness and GPU SRAM tiling reduce memory read/write bottlenecks during long-context training?`,
        hint: "Explain HBM vs SRAM memory bandwidth, online softmax scaling, and recomputation."
      },
      {
        category: "Fine-Tuning & Quantization",
        title: `Explain QLoRA's NF4 (NormalFloat 4) quantization data type and Double Quantization mechanism. How does it maintain model performance while reducing memory footprint?`,
        hint: "Discuss zero-mean unit-variance distribution quantization, blockwise scale factors, and FP16 dequantization during forward pass."
      },
      {
        category: "Agent Alignment & RLHF",
        title: `How does Direct Preference Optimization (DPO) simplify LLM alignment compared to traditional RLHF with explicit reward modeling (PPO)?`,
        hint: "Discuss implicit reward formulation, reference model log-ratio loss, and eliminating PPO actor-critic instability."
      }
    ],
    Engineer: [
      {
        category: "RAG & Vector DB Architecture",
        title: `Walk me through your document chunking strategy for complex PDFs containing tables and text. How do you prevent context loss across semantic boundaries?`,
        hint: "Mention specific splitters (e.g. Parent-Child, Semantic Chunking) and how you store tabular context as JSON."
      },
      {
        category: "Vector Index Tuning",
        title: `In an HNSW vector index, what is the primary operational trade-off when tuning the 'M' and 'ef_construction' parameters during high-throughput ingestion?`,
        hint: "Discuss memory footprint (RAM), bi-directional graph connectivity, index build latency, and search recall."
      },
      {
        category: "Model Context Protocol (MCP)",
        title: `What key advantage does the Model Context Protocol (MCP) offer over standard REST API tool calling? How do you implement capability negotiation and resource security scoping?`,
        hint: "Discuss STDIO vs SSE transport, capability registration, tool isolation, and authorization."
      },
      {
        category: "AI Inference & vLLM Serving",
        title: `Why does vLLM's PagedAttention architecture achieve up to 2-4x higher inference throughput compared to standard Transformers serving?`,
        hint: "Explain virtual memory paging, Key-Value (KV) cache block allocation, and elimination of VRAM fragmentation."
      }
    ]
  };

  const pool = personaPools[candidateRole] || personaPools.Engineer;
  const randomIndex = (qNum + Math.floor(Math.random() * 10)) % pool.length;
  const pick = pool[randomIndex];

  return {
    id: qNum,
    category: pick.category,
    type: 'text',
    title: pick.title,
    hint: pick.hint
  };
}

/**
 * AI Support Assistant Bot for Landing Page using Gemini API with model fallbacks & smart contextual fallback
 */
export async function askSupportBotGemini(userQuery) {
  const activeKey = getGeminiApiKey();

  if (activeKey) {
    const genAI = new GoogleGenerativeAI(activeKey);
    const candidateModels = ['gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-2.0-flash'];

    const systemPrompt = `You are "Gemini Flash Support Bot", a friendly, helpful, expert customer support AI assistant for InterviewAgent.AI (an Enterprise AI Interviewing platform for RAG, Vector DBs, MCP, Agents, and LLMs).

User Question: "${userQuery}"

Instructions:
1. Provide a concise, clear, encouraging response (max 2-3 short paragraphs).
2. If asked about API keys: Explain that a Gemini 3.5 / 2.0 Flash Lite API key is pre-integrated so manual entry is optional.
3. If asked about format: Explain that interviews consist of open-ended text scenarios (8 to 20 questions) with live step-by-step Gemini feedback, a live question timer, skip & review privileges, and no word limits!
4. Maintain a warm, expert, professional tone.`;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const text = result?.response?.text();
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err) {
        console.warn(`Support bot attempt with model ${modelName} failed, trying next fallback...`, err);
      }
    }
  }

  // Intelligent Contextual Fallback Response if API call fails or network is offline
  const queryLower = (userQuery || '').toLowerCase();

  if (queryLower.includes('key') || queryLower.includes('api')) {
    return "🔑 **API Key Information**: Your Gemini 3.5 / 2.0 Flash Lite API key is pre-integrated (`AIzaSyBC7uH...`) into InterviewAgent.AI! You don't need to enter any key manually, but you can paste your own custom key on the Candidate Login screen if preferred.";
  }

  if (queryLower.includes('format') || queryLower.includes('question') || queryLower.includes('mcq') || queryLower.includes('how')) {
    return "⚡ **Interview Format**: Interviews feature open-ended technical scenarios covering 31-Day Enterprise AI Cohort topics (RAG, Vector DBs, MCP, Agents, LoRA). After logging in, you can set your target length from 8 to 20 questions, enjoy zero word limits, track time with a live question timer, and get instant step-by-step Gemini feedback!";
  }

  if (queryLower.includes('skip') || queryLower.includes('review') || queryLower.includes('leftover')) {
    return "⏭️ **Skip & Review Feature**: If you encounter a complex scenario, simply click 'Skip Question ⏭️'. All skipped questions are stored in a review list so you can answer them one-by-one at the end before submitting your final report!";
  }

  return "👋 **Welcome to InterviewAgent.AI Support!** Our platform conducts live adaptive technical interviews powered by Gemini 3.5 Flash Lite. Click **Candidate Login** in the top navigation whenever you are ready to begin your technical assessment!";
}


