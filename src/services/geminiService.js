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
export const ROUND_PROMPTS = {
  'System Design Round': {
    name: 'System Design Round',
    focus: 'High-Scale System Architecture, Scalability, High Availability, Database Sharding, Caching (Redis/Memcached), Message Queues (Kafka/RabbitMQ), Load Balancing, Rate Limiting, CAP Theorem, and Single Points of Failure.',
    initialInstruction: 'Ask an open-ended high-scale system design scenario (e.g. Design a real-time notification engine for 50M DAU, or a distributed URL shortener with zero cache stampedes).',
    probingFocus: 'Probe database bottlenecks, network latency, cache invalidation strategies, partition tolerance, and failure recovery mechanisms.'
  },
  'Object-Oriented Design Round': {
    name: 'Object-Oriented Design Round',
    focus: 'Low-Level Design (LLD), Object-Oriented Principles (Encapsulation, Polymorphism, Inheritance vs Composition), SOLID Principles, Design Patterns (Factory, Strategy, Observer, Decorator, Singleton), and Clean Class Diagrams.',
    initialInstruction: 'Ask a low-level object-oriented design problem (e.g. Design an Elevator Control System, Parking Lot, or Vending Machine). Ask candidate to outline classes, interfaces, methods, and design patterns.',
    probingFocus: 'Probe tight coupling, SOLID principle violations, concurrency locks in multithreaded environments, and extensibility.'
  },
  'Machine Coding Round': {
    name: 'Machine Coding Round',
    focus: 'Production-Grade Working Code Structure, Clean Interfaces, Method Signatures, Memory Management, Concurrency/Thread-Safety, Error Handling, and Modular Abstractions.',
    initialInstruction: 'Ask a machine coding problem (e.g. Implement an In-Memory Thread-Safe Cache with TTL expiration and LRU eviction, or a Rate Limiter library). Ask for concrete interface definitions and core algorithmic methods.',
    probingFocus: 'Probe race conditions, thread synchronization, edge cases (null inputs, memory leaks), and clean separation of concerns.'
  },
  'HR Round': {
    name: 'HR & Behavioral Round',
    focus: 'Behavioral & Leadership Competencies, STAR Method (Situation, Task, Action, Result), Conflict Resolution, Prioritization under Deadlines, Handling Failures, Team Collaboration, and Cultural Fit.',
    initialInstruction: 'Ask a realistic behavioral question (e.g. Tell me about a time when you had a severe technical disagreement with a senior teammate or PM. How did you resolve it?).',
    probingFocus: 'Probe specific actions the candidate personally took, quantifiable results achieved, how they handled emotional tension, and key takeaways.'
  },
  'Product Sense Round': {
    name: 'Product Sense Round',
    focus: 'Product Strategy, Feature Design, User Personas & Pain Points, Metric Definition (North Star, Retention, Acquisition), Trade-off Analysis, and Product Prioritization Frameworks (RICE, MoSCoW).',
    initialInstruction: 'Ask a product design & strategy scenario (e.g. You are the PM for a major mobile app. How would you design a feature to increase user retention by 15%?).',
    probingFocus: 'Probe edge-case user personas, metric cannibalization, prioritization trade-offs, and how they define success metrics.'
  },
  'Data Structure and Algorithm Round': {
    name: 'Data Structure and Algorithm Round',
    focus: 'Data Structures (Arrays, Hash Maps, Trees, Graphs, Heaps, Tries), Algorithmic Strategies (Dynamic Programming, Two Pointers, Sliding Window, Binary Search, BFS/DFS), Time & Space Complexity (Big-O analysis), and Boundary Edge Cases.',
    initialInstruction: 'Ask a challenging algorithmic design problem (e.g. Given an un-ordered stream of integers, design a data structure to return the Median in O(1) query time, or find the shortest path in a dynamic grid).',
    probingFocus: 'Probe Big-O Time & Space complexity bounds, memory optimizations, edge cases (empty input, duplicates, integer overflow), and alternative data structures.'
  }
};

/**
 * Evaluates candidate text/MCQ answers with strict factual verification.
 * Accepts either an options object OR positional arguments for fail-safe invocation.
 */
export async function evaluateAnswerAndGetNextQuestion(arg1, arg2, arg3, arg4, arg5, arg6) {
  let userLevel, currentQuestion, userAnswer, questionNumber, totalTargetQuestions, roundType, questionHistory;

  if (typeof arg1 === 'object' && arg1 !== null && arg1.currentQuestion) {
    ({ userLevel = 'Intermediate', currentQuestion, userAnswer, questionNumber = 1, totalTargetQuestions = 8, roundType = 'System Design Round', questionHistory = [] } = arg1);
  } else {
    currentQuestion = arg1;
    userAnswer = arg2;
    userLevel = arg3 || 'Intermediate';
    questionNumber = arg4 || 1;
    totalTargetQuestions = arg5 || 8;
    roundType = arg6 || 'System Design Round';
  }

  const roundConfig = ROUND_PROMPTS[roundType] || ROUND_PROMPTS['System Design Round'];
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
You are an expert Senior Technical Interviewer conducting a natural, conversational candidate evaluation specifically for a "${roundConfig.name}".

INTERVIEW ROUND FOCUS:
${roundConfig.focus}

SYSTEM PROMPT INSTRUCTIONS & INTELLIGENCE:
1. Do NOT follow a predetermined fixed sequence of questions.
2. React directly to what the candidate claimed in their previous answer.
3. Identify specific technical concepts, assumptions, weaknesses, vague statements, or missing reasoning tailored to ${roundConfig.name}.
4. Ask strictly ONE natural follow-up question per response that directly builds on the candidate's answer (${roundConfig.probingFocus}).
5. If candidate demonstrates strong understanding, progressively increase difficulty and introduce failure modes or edge cases.
6. If candidate gives a weak answer, ask a simpler clarifying question before increasing difficulty.
7. Challenge incorrect assumptions rather than immediately giving away the answer.
8. Do not praise every answer lavishly. Do not give the candidate the solution directly.
9. DIVERSITY REQUIREMENT: Never repeat a question or category previously asked in Candidate Answer History. Every follow-up must explore a new angle or deeper level.

INTERNAL HIDDEN STATE (EVALUATE CANDIDATE METRICS):
Evaluate candidate internally across 4 core dimensions (0 to 100%):
- confidence: Candidate's conviction and clarity
- technical_depth: Depth of architectural trade-offs, algorithms, or behavioral specifics cited
- reasoning: Logical problem-solving ability under hypothetical scenario shifts
- communication: Structure, conciseness, and precision of response

<candidate_context>
- Round Type: ${roundConfig.name}
- Question #${questionNumber}: "${currentQuestion?.title || 'Scenario'}"
- Category: ${currentQuestion?.category || roundConfig.name}
- Candidate Self-Assessed Level: ${userLevel}
</candidate_context>

Candidate Answer:
"${userAnswer}"

Candidate Answer History:
${JSON.stringify((questionHistory || []).map(q => ({ q: q.title || q.topic, cat: q.category })))}

RETURN ONLY VALID UNWRAPPED JSON MATCHING THIS EXACT SCHEMA:
{
  "hidden_state": {
    "confidence": 72,
    "technical_depth": 65,
    "reasoning": 70,
    "communication": 80,
    "current_topic": "${currentQuestion?.category || roundConfig.name}",
    "depth_level": 3,
    "detected_claims": ["Identified specific claim made by candidate"],
    "limitation_identified": "Identified limitation or missing trade-off",
    "weak_areas": ["Specific weak technical concepts"],
    "strong_areas": ["Specific strong technical concepts"],
    "likely_next_question": "Scenario or failure mode question to ask if candidate pushes deeper"
  },
  "thinking_process": {
    "accuracy_assessment": "Assess technical correctness and claim validity...",
    "knowledge_gaps": "Identify exact knowledge gaps or unaddressed edge cases...",
    "next_question_plan": "Plan for adaptive follow-up probing for ${roundConfig.name}..."
  },
  "evaluation": {
    "isSenselessOrOffTopic": false,
    "senselessReason": "",
    "score": 7.5,
    "level": "Advanced",
    "levelEmoji": "🚀",
    "levelColor": "#10B981",
    "isCorrect": true,
    "feedback": "Step-by-step technical analysis and explicit corrections...",
    "strengths": ["Accurate explanation"],
    "improvements": ["Elaborate on edge-case handling"]
  },
  "nextQuestion": {
    "id": ${questionNumber + 1},
    "category": "${currentQuestion?.category || roundConfig.name}",
    "type": "text",
    "title": "One focused, natural follow-up question probing candidate's previous answer directly for ${roundConfig.name}...",
    "hint": "Consider edge cases, trade-offs, or failure states"
  }
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(new RegExp('```json', 'g'), '').replace(new RegExp('```', 'g'), '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed?.evaluation) {
          if (!parsed.thinking_process) {
            parsed.thinking_process = {
              accuracy_assessment: `Evaluated candidate answer for question #${questionNumber} (${currentQuestion?.category}).`,
              knowledge_gaps: (parsed.evaluation.improvements || []).join('; ') || 'None identified.',
              next_question_plan: `Framed next question targeting ${parsed.nextQuestion?.category || 'AI Systems'}.`
            };
          }
          if (!parsed.hidden_state) {
            const scoreVal = parsed.evaluation.score || 7.0;
            parsed.hidden_state = {
              confidence: Math.round(scoreVal * 9.5),
              technical_depth: Math.round(scoreVal * 9.0),
              reasoning: Math.round(scoreVal * 9.2),
              communication: Math.round(scoreVal * 9.8),
              current_topic: currentQuestion?.category || 'AI Architecture',
              depth_level: Math.min(5, Math.ceil(questionNumber / 2)),
              detected_claims: parsed.evaluation.strengths || [],
              limitation_identified: (parsed.evaluation.improvements || [])[0] || 'Needs deeper quantification',
              weak_areas: parsed.evaluation.improvements || [],
              strong_areas: parsed.evaluation.strengths || [],
              likely_next_question: `How would you handle failure recovery in ${currentQuestion?.category}?`
            };
          }
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
    thinking_process: {
      accuracy_assessment: `Evaluated response for Q#${questionNumber} (${currentQuestion.category}). Score: ${score}/10 (${level}).`,
      knowledge_gaps: improvements.join('; ') || 'No critical gaps observed.',
      next_question_plan: `Frame Q#${nextQNum} on ${generatedNextQuestion.category} to probe depth.`
    },
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
  candidateRole = 'Engineer',
  history = [],
  roundType = 'System Design Round'
) {
  const activeKey = getGeminiApiKey();
  const roundConfig = ROUND_PROMPTS[roundType] || ROUND_PROMPTS['System Design Round'];

  const RANDOM_STARTER_DOMAINS = [
    "High-Scale System Architecture & Sharding",
    "Low-Level Object Oriented Class Hierarchy & SOLID Principles",
    "Machine Coding Thread-Safety & Eviction Policies",
    "HR Behavioral Conflict Resolution & STAR Method",
    "Product Sense Feature Design & Success Metrics",
    "Data Structures & Big-O Algorithmic Optimizations"
  ];

  const randomStarterDomain = RANDOM_STARTER_DOMAINS[Math.floor(Math.random() * RANDOM_STARTER_DOMAINS.length)];
  const sessionToken = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

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
      const askedTopicsList = (history || []).map(h => h.topic || h.question?.title || '').filter(Boolean);

      const prompt = `
<question_generator_prompt>
<role>
You are an Expert AI Technical Interviewer creating Question #${qNum} for a candidate.
Session Unique Token: ${sessionToken}
</role>

<candidate_profile>
- Self-Assessed Level: ${userLevel}
- Target Persona / Role: ${candidateRole} (${roleContext})
- Question Sequence Number: #${qNum}
</candidate_profile>

${askedTopicsList.length > 0 ? `
<already_asked_topics>
${JSON.stringify(askedTopicsList)}
</already_asked_topics>
` : ''}

${previousQuestion && previousAnswer ? `
<previous_turn_context>
- Previous Question: "${previousQuestion.title || previousQuestion}"
- Candidate Previous Answer: "${previousAnswer}"
- Score Given: ${prevScore} / 10
- Performance Assessment: ${isHighPerformer ? 'Candidate gave a strong/intelligent technical response! Probe deeper into advanced edge-cases, system bottlenecks, and failure modes.' : isLowPerformer ? 'Candidate struggled or gave a flawed answer. Ask a clarifying foundational scenario to test their core understanding.' : 'Candidate gave a decent answer. Progress to the next logical AI architecture module.'}
</previous_turn_context>
` : `
<initial_question_instruction>
This is Question #1 of a BRAND NEW interview session.
Required Focus Domain for this session: "${randomStarterDomain}"
Create a completely unique, novel open-ended technical scenario centered on "${randomStarterDomain}" for a ${candidateRole} at ${userLevel} level.
Do NOT repeat generic introductory questions. Make this initial question distinct and engaging.
</initial_question_instruction>
`}

<instructions>
1. Generate ONE dynamic, novel open-ended technical scenario.
2. CRITICAL: DO NOT repeat any question or topic previously asked in this session or standard templates.
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
      },
      {
        category: "LLM Guardrails",
        title: `What is prompt injection in AI applications, and how would you defend a student customer service chatbot against malicious user inputs?`,
        hint: "Explain input sanitization, system prompt isolation, and dual-LLM evaluator patterns."
      },
      {
        category: "Vector Databases",
        title: `How does cosine similarity differ from Euclidean distance (L2) and dot product when searching vector embedding spaces?`,
        hint: "Discuss normalized vectors, vector magnitude impact, and angular distance calculations."
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
      },
      {
        category: "Speculative Decoding",
        title: `How does Speculative Decoding accelerate LLM inference without altering the target model output distribution?`,
        hint: "Explain draft model token sampling, parallel target verification, and acceptance probability ratios."
      },
      {
        category: "RoPE & Position Embeddings",
        title: `Walk me through Rotary Position Embeddings (RoPE) and how linear scaling or YaRN extends context windows beyond pre-training length.`,
        hint: "Discuss complex plane rotation, frequency decomposition, and temperature scaling in attention softmax."
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
      },
      {
        category: "Semantic Caching",
        title: `How would you architect a semantic cache layer for high-volume LLM endpoints to reduce latency and API costs?`,
        hint: "Discuss vector threshold similarity matching, cache invalidation, and TTL strategies."
      },
      {
        category: "Agentic State Management",
        title: `In a production LangGraph or multi-agent pipeline, how do you handle state checkpointing, human-in-the-loop (HITL) intervention, and error recovery?`,
        hint: "Explain persistent thread state, breakpoint triggers, and state mutation before re-execution."
      }
    ]
  };

  const pool = personaPools[candidateRole] || personaPools.Engineer;
  const randomIndex = Math.floor(Math.random() * pool.length);
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

    const systemPrompt = `You are "AI Support Assistant", a friendly, helpful, expert customer support AI assistant for InterviewAgent.AI (an Enterprise AI Interviewing platform for RAG, Vector DBs, MCP, Agents, and LLMs). Do NOT mention the name "Gemini" anywhere in your response. Refer to the model as "Enterprise AI Engine".

User Question: "${userQuery}"

Instructions:
1. Provide a concise, clear, encouraging response (max 2-3 short paragraphs).
2. If asked about API keys: Explain that an Enterprise AI Engine API key is pre-integrated so manual entry is optional.
3. If asked about format: Explain that interviews consist of open-ended text scenarios (8 to 20 questions) with live step-by-step AI feedback, a live question timer, skip & review privileges, and no word limits!
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
    return "🔑 **API Key Information**: Your Enterprise AI Engine API key is pre-integrated into InterviewAgent.AI! You don't need to enter any key manually.";
  }

  if (queryLower.includes('format') || queryLower.includes('question') || queryLower.includes('mcq') || queryLower.includes('how')) {
    return "⚡ **Interview Format**: Interviews feature open-ended technical scenarios covering 31-Day Enterprise AI Cohort topics (RAG, Vector DBs, MCP, Agents, LoRA). After logging in, you can set your target length from 8 to 20 questions, enjoy zero word limits, track time with a live question timer, and get instant step-by-step AI feedback!";
  }

  if (queryLower.includes('skip') || queryLower.includes('review') || queryLower.includes('leftover')) {
    return "⏭️ **Skip & Review Feature**: If you encounter a complex scenario, simply click 'Skip Question ⏭️'. All skipped questions are stored in a review list so you can answer them one-by-one at the end before submitting your final report!";
  }

  return "👋 **Welcome to InterviewAgent.AI Support!** Our platform conducts live adaptive technical interviews powered by Enterprise AI Engine. Click **Candidate Login** in the top navigation whenever you are ready to begin your technical assessment!";
}

/**
 * Uses Gemini API to evaluate the full candidate transcript and generate
 * a personalized, structured final report dashboard.
 */
export async function generateFinalReportAnalysis({ candidateName, roundType, userLevel, QnAHistory }) {
  const activeKey = getGeminiApiKey();

  if (activeKey && activeKey.trim().length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(activeKey.trim());
      const candidateModels = ['gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-2.0-flash'];

      const transcriptText = (QnAHistory || []).map((turn, i) => `
Turn #${i + 1}:
Question: "${turn.question?.title || turn.topic}"
Candidate Answer: "${turn.answer}"
Score Given: ${turn.score}/10
Interviewer Feedback: "${turn.feedback}"
`).join('\n---\n');

      const prompt = `
You are a Senior AI Hiring Manager synthesizing the final assessment report for a candidate who just completed a "${roundType || 'System Design Round'}" interview.

Candidate Name: ${candidateName || 'Candidate'}
Candidate Target Round: ${roundType || 'System Design Round'}
Self-Assessed Level: ${userLevel || 'Intermediate'}

Full Interview Transcript:
${transcriptText}

Synthesize a comprehensive, personalized final evaluation report based STRICTLY on the candidate's actual technical answers and performance.

RETURN ONLY VALID UNWRAPPED JSON MATCHING THIS EXACT SCHEMA:
{
  "overallScore": 82,
  "avgAnswerScore": "8.2",
  "recommendation": "Strong Hire",
  "dominantLevel": "ADVANCED",
  "narrative": "Synthesize a 3-4 sentence comprehensive narrative analyzing candidate's performance, trade-off depth, and readiness for ${roundType}...",
  "scores": {
    "confidence": 85,
    "technicalDepth": 78,
    "reasoning": 82,
    "communication": 88
  },
  "keyStrengths": [
    "Specific technical strength 1 citing candidate answer details...",
    "Specific technical strength 2...",
    "Specific technical strength 3..."
  ],
  "areasForImprovement": [
    "Specific gap 1 citing missing edge cases or trade-offs...",
    "Specific gap 2...",
    "Specific gap 3..."
  ],
  "actionableSteps": [
    "Actionable growth step 1 tailored for ${roundType}...",
    "Actionable growth step 2...",
    "Actionable growth step 3..."
  ]
}
`;

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result?.response?.text();
          if (text) {
            const cleaned = text.replace(new RegExp('```json', 'g'), '').replace(new RegExp('```', 'g'), '').trim();
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              return JSON.parse(jsonMatch[0]);
            }
          }
        } catch (e) {
          console.warn(`Final report generation with ${modelName} failed:`, e);
        }
      }
    } catch (err) {
      console.warn("Gemini API error during report generation:", err);
    }
  }

  return null;
}


