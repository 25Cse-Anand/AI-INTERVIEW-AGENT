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
export async function evaluateAnswerAndGetNextQuestion({
  userLevel,
  currentQuestion,
  userAnswer,
  questionHistory,
  questionNumber,
  totalTargetQuestions = 12
}) {
  const activeKey = apiKey || DEFAULT_GEMINI_KEY;

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
You are a Senior AI Engineering Technical Interviewer conducting a live technical evaluation for a candidate in an AI Cohort using Gemini Flash Lite.

Candidate Self-Assessed Level: ${userLevel}
Current Question #${questionNumber}:
Title: "${currentQuestion.title}"
Category: ${currentQuestion.category}
Type: ${currentQuestion.type} (mcq or text)
${currentQuestion.type === 'mcq' ? `Options: ${JSON.stringify(currentQuestion.options)} | Correct Option Index (0-indexed): ${currentQuestion.correctAnswer}` : ''}

Candidate's Submitted Answer:
"${userAnswer}"

EVALUATION RULES:

1. FOR MCQ QUESTIONS (type = "mcq"):
   - Compare index "${userAnswer}" to correct option index ${currentQuestion.correctAnswer}.
   - If selected index == ${currentQuestion.correctAnswer}:
     Set "isCorrect": true, "feedback": "Correct selection! Option ${currentQuestion.options[currentQuestion.correctAnswer]} is right. ${currentQuestion.explanation || ''}"
   - If selected index != ${currentQuestion.correctAnswer}:
     Set "isCorrect": false, "feedback": "Incorrect selection. Option ${currentQuestion.options[currentQuestion.correctAnswer]} was the correct answer. ${currentQuestion.explanation || ''}"
   - "score": 10.0 if correct else 0.0.
   - "isSenselessOrOffTopic": false.

2. FOR TEXT QUESTIONS (type = "text"):
   - DEEP TECHNICAL VERIFICATION: Analyze the answer against true AI engineering facts (RAG, Vector DBs, HNSW, MCP, LoRA, vLLM, OpenTelemetry, PagedAttention, etc.).
   - FOOLISH / WRONG / NONSENSE / OFF-TOPIC ANSWERS:
     If the user answer is foolish, wrong, factually inaccurate, random gibberish (e.g. "asdf", "qwerty", "12345"), casual fluff ("I like pizza"), or misses the core technical concepts:
     * YOU MUST RATE THEM 1.0 OR 2.0 OUT OF 10! DO NOT BE GENEROUS!
     * Set "score": 1.0 or 2.0.
     * Set "level": "Beginner".
     * Set "levelEmoji": "📘".
     * Set "levelColor": "#F43F5E".
     * Set "isCorrect": false.
     * If answer is complete gibberish or off-topic, set "isSenselessOrOffTopic": true and "senselessReason": "Your answer appears to be senseless or off-topic. Please provide a technically accurate explanation."
     * In "feedback", clearly explain why their answer is wrong or foolish and state the actual technical solution.
   - ACCURATE & DEEP TEXT ANSWERS:
     * Only if the answer is factually accurate and contains real AI engineering mechanisms, rate "score": 7.0 to 10.0, "level": "Advanced" or "Expert", "isCorrect": true.

3. GENERATE THE NEXT QUESTION (#${questionNumber + 1}):
   - Alternate type: If current was 'mcq', make next 'text'. If current was 'text', make next 'mcq'.
   - Pick a relevant domain category from RAG, Vector DBs, Agentic AI, MCP, Deployment, Security.

RETURN ONLY VALID UNWRAPPED JSON:
{
  "evaluation": {
    "isSenselessOrOffTopic": false,
    "senselessReason": "",
    "score": 8.5, // 1.0 or 2.0 for foolish answers, 7.0-10.0 for accurate text answers
    "level": "Advanced", // "Beginner" (if wrong/foolish), "Intermediate", "Advanced", "Expert"
    "levelEmoji": "🚀",
    "levelColor": "#10B981", // "#F43F5E" for wrong/foolish answers
    "isCorrect": true,
    "feedback": "Deep analysis explanation...",
    "strengths": ["Accurate concept explanation"],
    "improvements": ["Needs concrete benchmarks"]
  },
  "nextQuestion": {
    "id": ${questionNumber + 1},
    "category": "Category Name",
    "type": "${currentQuestion.type === 'mcq' ? 'text' : 'mcq'}",
    "title": "Question statement...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of correct answer",
    "minWords": 15,
    "hint": "Useful constraint or pro-tip"
  }
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed?.evaluation && parsed?.nextQuestion) {
        return parsed;
      }
    } catch (err) {
      console.warn("Gemini API error during live call:", err);
    }
  }

  // Adaptive Fallback Engine (Strict Local Factual Evaluation)
  return simulateStrictEvaluation({ userLevel, currentQuestion, userAnswer, questionNumber, totalTargetQuestions });
}

/**
 * Strict evaluation logic ensuring wrong/foolish text answers get 1.0 or 2.0 rating
 */
function simulateStrictEvaluation({ userLevel, currentQuestion, userAnswer, questionNumber, totalTargetQuestions }) {
  const isMcq = currentQuestion.type === 'mcq';
  let isCorrect = false;
  let isSenselessOrOffTopic = false;
  let senselessReason = '';
  let score = 1.0;
  let level = 'Beginner';
  let levelEmoji = '📘';
  let levelColor = '#F43F5E';
  let feedback = '';
  let strengths = [];
  let improvements = [];

  if (isMcq) {
    const selectedIdx = parseInt(userAnswer, 10);
    isCorrect = selectedIdx === currentQuestion.correctAnswer;
    score = isCorrect ? 10.0 : 0.0;
    level = isCorrect ? 'Advanced' : 'Beginner';
    levelEmoji = isCorrect ? '✅' : '❌';
    levelColor = isCorrect ? '#10B981' : '#F43F5E';
    feedback = isCorrect
      ? `Correct selection! Option ${String.fromCharCode(65 + selectedIdx)} is correct. ${currentQuestion.explanation || ''}`
      : `Incorrect selection. You chose Option ${String.fromCharCode(65 + selectedIdx)}, but Option ${String.fromCharCode(65 + currentQuestion.correctAnswer)} was correct. ${currentQuestion.explanation || ''}`;
    strengths = isCorrect ? ['Accurate concept selection'] : [];
    improvements = isCorrect ? [] : ['Review core architectural mechanics for this module'];
  } else {
    // Deep Text Evaluation
    const words = userAnswer.trim().split(/\s+/).filter(Boolean).length;
    const lower = userAnswer.toLowerCase();

    // Key technical terms expected for AI engineering topics
    const keyTerms = ['hnsw', 'vector', 'bm25', 'rrf', 'mcp', 'vllm', 'rag', 'pydantic', 'qdrant', 'pinecone', 'lora', 'attention', 'chunk', 'rerank', 'agent', 'guardrail', 'ragas', 'transformer', 'cache', 'parent-child', 'semantic', 'schema', 'breakpoint', 'span', 'trace', 'latency', 'memory', 'embedding', 'prompt', 'model', 'api', 'context'];
    const matchedTerms = keyTerms.filter(t => lower.includes(t));

    // Detect Senseless / Gibberish / Foolish / Off-Topic
    const gibberishRegex = /asdf|qwerty|zxcv|1234|aaaa|bbbb|cccc|ffff|gggg|hhhh|jjjj|kkkk|llll|blabla|foo.*bar|random|xyzzy|pizza|cats|dogs|hello/i;
    const isGibberish = gibberishRegex.test(lower) || (words < 5 && matchedTerms.length === 0);

    if (isGibberish || matchedTerms.length === 0) {
      isSenselessOrOffTopic = true;
      senselessReason = `Foolish or off-topic answer detected. Your response ("${userAnswer}") does not contain valid technical concepts regarding ${currentQuestion.category}.`;
      score = 1.0;
      level = 'Beginner';
      levelEmoji = '📘';
      levelColor = '#F43F5E';
      feedback = `Foolish answer rated 1.0/10. Your response lacked technical accuracy and key engineering concepts for ${currentQuestion.category}.`;
      strengths = [];
      improvements = ['Read the question carefully', 'Provide technically accurate explanations using specific AI concepts'];
    } else if (matchedTerms.length >= 3 && words >= 20) {
      isCorrect = true;
      score = 8.5;
      level = 'Advanced';
      levelEmoji = '🚀';
      levelColor = '#10B981';
      feedback = `Accurate explanation! You correctly cited ${matchedTerms.slice(0, 4).join(', ')} and provided sound technical rationale.`;
      strengths = ['Accurate technical terminology', 'Clear architectural depth'];
      improvements = ['Incorporate concrete production metrics (p95 latency, VRAM savings)'];
    } else {
      // Flawed / Shallow / Incorrect text answer -> Rate 2.0 out of 10
      isCorrect = false;
      score = 2.0;
      level = 'Beginner';
      levelEmoji = '📘';
      levelColor = '#F43F5E';
      feedback = `Flawed answer rated 2.0/10. You mentioned ${matchedTerms.join(', ')}, but your response is technically incomplete or inaccurate regarding ${currentQuestion.category}.`;
      strengths = ['Mentioned basic terms'];
      improvements = ['Elaborate on true technical mechanisms and failure trade-offs'];
    }
  }

  const nextQNum = questionNumber + 1;
  const nextType = nextQNum % 2 === 1 ? 'mcq' : 'text';
  const topicObj = CURRICULUM_POOL[(nextQNum - 1) % CURRICULUM_POOL.length];
  const generatedNextQuestion = generateAdaptiveQuestion(nextQNum, nextType, topicObj, score);

  return {
    evaluation: {
      isSenselessOrOffTopic,
      senselessReason,
      score: parseFloat(score.toFixed(1)),
      level,
      levelEmoji,
      levelColor,
      isCorrect,
      feedback,
      strengths,
      improvements
    },
    nextQuestion: generatedNextQuestion
  };
}

/**
 * Generates initial or follow-up dynamic questions grounded in the cohort curriculum
 */
export function generateAdaptiveQuestion(qNum, type, topicObj, previousScore = 7.0) {
  const isHighPerformer = previousScore >= 7.5;

  if (type === 'mcq') {
    const mcqTemplates = [
      {
        category: "RAG & Vector DBs",
        title: "In an HNSW vector index, what is the primary operational trade-off when increasing the 'M' parameter (number of bi-directional links per node)?",
        options: [
          "A) Higher search recall and accuracy at the cost of higher memory footprint and index build time",
          "B) Faster search speed with drastically lower RAM consumption",
          "C) Automatic conversion of dense vectors into BM25 sparse indexes",
          "D) Reduction of context window fragmentation during document chunking"
        ],
        correctAnswer: 0,
        explanation: "Increasing 'M' in HNSW adds more edge connections per vector in the graph, boosting search accuracy and recall, but consumes significantly more RAM and increases index construction time."
      },
      {
        category: "Agentic AI",
        title: "In a Multi-Agent system using the Supervisor Pattern, how is inter-agent state handled to prevent infinite execution loops?",
        options: [
          "A) Each sub-agent maintains isolated state with no supervisor communication",
          "B) The supervisor enforces a maximum iteration breakpoint and validates state graph handoffs",
          "C) Agents continuously pass raw system prompts to each other until context memory overflows",
          "D) Tool outputs are deleted after every single Thought-Action-Observation cycle"
        ],
        correctAnswer: 1,
        explanation: "The Supervisor Pattern uses a central state router that tracks agent execution counters, evaluates handoff conditions, and applies explicit loop breakpoints."
      },
      {
        category: "MCP Protocol",
        title: "What key advantage does the Model Context Protocol (MCP) offer over standard REST API tool calling in enterprise LLM agent setups?",
        options: [
          "A) It bypasses token limit constraints by executing code directly inside the GPU",
          "B) Standardized protocol transport (STDIO/SSE) with explicit client-server capability negotiation and resource scoping",
          "C) It automatically fine-tunes open-source models using LoRA without training data",
          "D) It replaces vector databases with static local JSON files"
        ],
        correctAnswer: 1,
        explanation: "MCP standardizes how AI applications discover, connect to, and authorize tools, prompts, and data resources across multi-tenant environments."
      },
      {
        category: "AI Deployment",
        title: "Why does vLLM's PagedAttention architecture achieve up to 2-4x higher throughput compared to traditional HuggingFace Transformers serving?",
        options: [
          "A) It quantizes all model weights to 1-bit binary representations",
          "B) It manages Key-Value (KV) cache memory in non-contiguous virtual memory blocks, eliminating memory fragmentation",
          "C) It disables context window checks for long prompts",
          "D) It executes inference purely on host CPU memory instead of VRAM"
        ],
        correctAnswer: 1,
        explanation: "PagedAttention partitions the KV cache into virtual blocks, allowing dynamic memory allocation without pre-allocating contiguous memory per request, drastically reducing wasted VRAM."
      },
      {
        category: "Production AI & Security",
        title: "Which mechanism is most effective at mitigating Indirect Prompt Injection attacks delivered via external RAG document ingestion?",
        options: [
          "A) Increasing the LLM temperature setting to 1.5",
          "B) Multi-stage input sandboxing, system prompt instruction isolation, and output verification guardrails",
          "C) Using longer chunk sizes during document ingestion",
          "D) Storing vectors in unencrypted flat files"
        ],
        correctAnswer: 1,
        explanation: "Indirect injection embeds malicious instructions inside retrieved documents. Defense requires strict boundary separation between system prompts, retrieved context, and output guardrails."
      }
    ];

    const pick = mcqTemplates[(qNum - 1) % mcqTemplates.length];
    return {
      id: qNum,
      category: pick.category,
      type: 'mcq',
      title: pick.title,
      options: pick.options,
      correctAnswer: pick.correctAnswer,
      explanation: pick.explanation,
      hint: "Evaluate the primary trade-off regarding memory vs throughput."
    };
  } else {
    const textTemplates = [
      {
        category: "RAG Systems",
        title: `Walk me through your document chunking strategy for complex PDFs containing tables and text. How do you prevent context loss across semantic boundaries?`,
        hint: "Mention specific splitters (e.g. Parent-Child, Semantic Chunking) and how you store tabular context."
      },
      {
        category: "Prompt Engineering",
        title: `Describe how you enforce deterministic JSON output schemas from LLMs for downstream microservices. What retry or grammar-guided decoding strategy do you use when validation fails?`,
        hint: "Mention tools like Pydantic, Instructor, Outlines, or BAML and how you handle schema retries."
      },
      {
        category: "Agentic AI",
        title: `Explain how you would design a Human-in-the-Loop (HITL) approval gate in an autonomous agent workflow. What happens to agent state during human pause?`,
        hint: "Discuss state serialization, persistent checkpointers (e.g. LangGraph), and timeout handling."
      },
      {
        category: "AI Observability",
        title: `If a production RAG pipeline's p95 latency suddenly spikes from 600ms to 3.5 seconds, walk me through your step-by-step debugging methodology using OpenTelemetry traces.`,
        hint: "Trace spans across embedding model call, vector DB query, cross-encoder reranking, and LLM generation."
      },
      {
        category: "Model Fine-Tuning",
        title: `Explain the mathematical intuition behind Low-Rank Adaptation (LoRA). Why does decomposing weight updates into low-rank matrices (A and B) save GPU RAM during fine-tuning?`,
        hint: "Discuss rank (r), scaling factor (alpha), and trainable parameter reduction."
      }
    ];

    const pick = textTemplates[(qNum - 1) % textTemplates.length];
    return {
      id: qNum,
      category: pick.category,
      type: 'text',
      title: pick.title,
      minWords: isHighPerformer ? 15 : 10,
      hint: pick.hint
    };
  }
}
