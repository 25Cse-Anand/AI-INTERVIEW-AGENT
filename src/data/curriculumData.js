export const COHORT_CURRICULUM = {
  cohortName: "31-Day Enterprise AI Engineering Cohort",
  totalDays: 31,
  modules: [
    {
      id: "mod-1",
      name: "Module 1: Prompt Engineering & LLM Architecture",
      days: [1, 2, 3, 4, 5],
      color: "#3B82F6"
    },
    {
      id: "mod-2",
      name: "Module 2: RAG & Vector Databases",
      days: [6, 7, 8, 9, 10, 11, 12],
      color: "#00F2FE"
    },
    {
      id: "mod-3",
      name: "Module 3: Agentic AI & Tool Calling",
      days: [13, 14, 15, 16, 17, 18, 19],
      color: "#8B5CF6"
    },
    {
      id: "mod-4",
      name: "Module 4: Model Context Protocol (MCP)",
      days: [20, 21, 22, 23, 24],
      color: "#EC4899"
    },
    {
      id: "mod-5",
      name: "Module 5: AI Deployment & Infrastructure",
      days: [25, 26, 27, 28],
      color: "#F59E0B"
    },
    {
      id: "mod-6",
      name: "Module 6: Production AI Systems & Governance",
      days: [29, 30, 31],
      color: "#10B981"
    }
  ],
  days: {
    1: {
      day: 1,
      module: "Module 1: Prompt Engineering & LLM Architecture",
      title: "LLM Fundamentals & Transformer Mechanics",
      key_concepts: ["Self-Attention Mechanism", "Tokenization", "Context Windows", "Positional Embeddings"],
      tools: ["Tiktoken", "HuggingFace Transformers", "OpenAI API"],
      objectives: "Understand how self-attention works, compute token counts, and handle context window constraints.",
      evaluation_topics: ["KV Cache Optimization", "Tokenization Pitfalls", "Context Truncation vs Summarization"]
    },
    2: {
      day: 2,
      module: "Module 1: Prompt Engineering & LLM Architecture",
      title: "Advanced Prompt Strategies (CoT, ToT, Few-Shot)",
      key_concepts: ["Chain-of-Thought (CoT)", "Tree-of-Thoughts (ToT)", "Few-Shot Formatting", "System Prompting"],
      tools: ["LangChain Prompts", "Instructor", "DSPy"],
      objectives: "Implement structured prompting techniques to improve complex reasoning accuracy.",
      evaluation_topics: ["Prompt Drift Mitigation", "In-Context Learning Limits", "Structured JSON Schema Extraction"]
    },
    3: {
      day: 3,
      module: "Module 1: Prompt Engineering & LLM Architecture",
      title: "Structured Outputs & Function Calling",
      key_concepts: ["JSON Schema Enforcement", "Pydantic Validation", "Function Calling Specs"],
      tools: ["OpenAI Function Calling", "Pydantic v2", "BAML"],
      objectives: "Enforce deterministic JSON output schemas from LLMs for downstream integration.",
      evaluation_topics: ["Handling Schema Failures", "Retry Loops", "Grammar-Guided Decoding (Outlines/Guidance)"]
    },
    4: {
      day: 4,
      module: "Module 1: Prompt Engineering & LLM Architecture",
      title: "Hallucination Reduction & Verification Loops",
      key_concepts: ["Self-Correction", "Self-Consistency Voting", "Citation Binding"],
      tools: ["Guardrails AI", "NeMo Guardrails"],
      objectives: "Build verification pipelines that validate LLM outputs against factual constraints.",
      evaluation_topics: ["Self-Consistency Overhead", "Output Guardrails Latency", "Factual Alignment Metrics"]
    },
    5: {
      day: 5,
      module: "Module 1: Prompt Engineering & LLM Architecture",
      title: "DSPy & Automated Prompt Optimization",
      key_concepts: ["Teleprompters", "MIPO/BootstrapFewShot", "Compiled Prompts"],
      tools: ["DSPy Framework"],
      objectives: "Replace manual prompt engineering with algorithmic prompt optimization.",
      evaluation_topics: ["DSPy Compilation Tradeoffs", "Metric-Driven Prompt Tuning", "Dataset Curation"]
    },

    // RAG & Vector DBs
    6: {
      day: 6,
      module: "Module 2: RAG & Vector Databases",
      title: "Vector Embeddings & Similarity Metrics",
      key_concepts: ["Cosine Similarity", "Dot Product", "Euclidean Distance", "High-Dimensional Spaces"],
      tools: ["OpenAI Embeddings", "Cohere Embed v3", "SentenceTransformers"],
      objectives: "Master embedding models, dimension reduction, and metric selection for semantic search.",
      evaluation_topics: ["Embedding Distance Selection", "Asymmetric Retrieval", "Normalized Vector Search"]
    },
    7: {
      day: 7,
      module: "Module 2: RAG & Vector Databases",
      title: "Vector DB Architecture & HNSW Indexing",
      key_concepts: ["HNSW Graphs", "IVFFlat", "Product Quantization (PQ)", "Index Build Speeds"],
      tools: ["Pinecone", "Qdrant", "Milvus", "pgvector"],
      objectives: "Configure vector indexes for sub-50ms latency over millions of vectors.",
      evaluation_topics: ["HNSW M & ef_construction Parameters", "Memory Footprint vs Precision", "Quantization Trade-offs"]
    },
    8: {
      day: 8,
      module: "Module 2: RAG & Vector Databases",
      title: "Chunking Strategies & Document Ingestion",
      key_concepts: ["Semantic Chunking", "Parent-Child Chunks", "Sliding Windows", "Recursive Character Splitting"],
      tools: ["Unstructured.io", "LlamaIndex Splitters"],
      objectives: "Design ingestion pipelines that preserve context and structure across complex PDFs and tables.",
      evaluation_topics: ["Semantic Boundary Detection", "Small-to-Big Retrieval Pattern", "PDF Table Chunking"]
    },
    9: {
      day: 9,
      module: "Module 2: RAG & Vector Databases",
      title: "Hybrid Search & BM25 Sparse Vector Fusion",
      key_concepts: ["Reciprocal Rank Fusion (RRF)", "BM25 Keyword Search", "Sparse-Dense Hybrid"],
      tools: ["Qdrant Hybrid", "Elasticsearch Vector Search"],
      objectives: "Combine exact keyword matching with semantic vector search using RRF scoring.",
      evaluation_topics: ["RRF Alpha Parameter Tuning", "Out-of-Vocabulary Domain Search", "Hybrid Re-ranking Overhead"]
    },
    10: {
      day: 10,
      module: "Module 2: RAG & Vector Databases",
      title: "Re-ranking Models & Context Compression",
      key_concepts: ["Cross-Encoder Re-ranking", "Cohere Rerank", "LLM Context Compression"],
      tools: ["Cohere Rerank API", "FlashRank", "BGE-Reranker"],
      objectives: "Filter top-K retrieved documents using cross-encoders to eliminate context noise.",
      evaluation_topics: ["Bi-Encoder vs Cross-Encoder Latency", "Top-K Selection Strategy", "Lost-in-the-Middle Effect"]
    },
    11: {
      day: 11,
      module: "Module 2: RAG & Vector Databases",
      title: "Advanced RAG Architecture (Corrective & Speculative RAG)",
      key_concepts: ["CRAG (Corrective RAG)", "Self-RAG", "Sub-Query Decomposition", "Query Rewriting"],
      tools: ["LlamaIndex Advanced RAG", "LangGraph RAG"],
      objectives: "Build adaptive RAG pipelines that rewrite queries and dynamically fallback to web search.",
      evaluation_topics: ["Corrective Loop Guardrails", "Sub-Query Routing Logic", "RAG Triad Metrics (Ragas)"]
    },
    12: {
      day: 12,
      module: "Module 2: RAG & Vector Databases",
      title: "RAG Evaluation Frameworks & Benchmarking",
      key_concepts: ["Faithfulness", "Answer Relevance", "Context Recall", "Context Precision"],
      tools: ["Ragas Framework", "DeepEval", "Arize Phoenix"],
      objectives: "Automate RAG evaluation pipelines using synthetic testsets and LLM-as-a-judge.",
      evaluation_topics: ["Synthetic Question Generation", "LLM-as-a-Judge Bias Mitigation", "CI/CD Evaluation Gates"]
    },

    // Agentic AI
    13: {
      day: 13,
      module: "Module 3: Agentic AI & Tool Calling",
      title: "Agent Architecture & ReAct Loop",
      key_concepts: ["Reasoning + Action (ReAct)", "Tool Definitions", "Thought-Action-Observation Cycle"],
      tools: ["LangChain Agents", "LlamaIndex ReAct", "Custom Agent Loops"],
      objectives: "Implement custom ReAct agent loops from scratch without black-box framework abstractions.",
      evaluation_topics: ["ReAct Infinte Loop Prevention", "Tool Error Recovery", "State Management in ReAct"]
    },
    14: {
      day: 14,
      module: "Module 3: Agentic AI & Tool Calling",
      title: "Multi-Agent Orchestration & Communication",
      key_concepts: ["Supervisor Pattern", "Hierarchical Teams", "Peer-to-Peer Agent Handoffs"],
      tools: ["LangGraph", "AutoGen", "CrewAI"],
      objectives: "Orchestrate specialized multi-agent teams with shared state and deterministic state graphs.",
      evaluation_topics: ["Supervisor Handoff Bottlenecks", "Shared State Synchronization", "Cyclic Agent Workflows"]
    },
    15: {
      day: 15,
      module: "Module 3: Agentic AI & Tool Calling",
      title: "Agentic Memory Systems (Short-term & Long-term)",
      key_concepts: ["Episodic Memory", "Semantic Memory", "Entity Memory", "State Persistence"],
      tools: ["MemGPT / Letta", "Zep", "LangGraph Checkpointers"],
      objectives: "Provide agents with persistent long-term memory across chat sessions and tool executions.",
      evaluation_topics: ["Memory Summarization Triggers", "Vector Memory Retrieval Latency", "Memory Consistency"]
    },
    16: {
      day: 16,
      module: "Module 3: Agentic AI & Tool Calling",
      title: "Human-in-the-Loop (HITL) & Approval Workflows",
      key_concepts: ["Breakpoints", "Human Approval Gates", "Time-Travel State Rewriting"],
      tools: ["LangGraph Breakpoints", "Temporal.io"],
      objectives: "Build safety-critical agent workflows that pause for human authorization before executing actions.",
      evaluation_topics: ["State Serialization during Pauses", "Timeout & Escalation Handling", "Audit Logging"]
    },
    17: {
      day: 17,
      module: "Module 3: Agentic AI & Tool Calling",
      title: "Code Execution & Sandbox Environments",
      key_concepts: ["Dynamic Code Generation", "Isolated Docker Execution", "E2B Sandboxes"],
      tools: ["E2B Data Analysis Sandbox", "Docker SDK", "Pyodide"],
      objectives: "Safely execute agent-generated Python code in secure, isolated sandbox environments.",
      evaluation_topics: ["Sandbox Security Boundaries", "Resource Allocation Limits", "Error Feedback Loops to LLM"]
    },
    18: {
      day: 18,
      module: "Module 3: Agentic AI & Tool Calling",
      title: "Plan-and-Solve & Structured Problem Decomposition",
      key_concepts: ["Planner-Executor Architecture", "Dynamic Plan Revision", "Sub-goal Tracking"],
      tools: ["LangGraph Plan-and-Execute", "Custom Planners"],
      objectives: "Deconstruct complex multi-step user tasks into actionable execution graphs.",
      evaluation_topics: ["Plan Re-evaluation Triggers", "Cascading Failure Mitigation", "Goal Satisfaction Metrics"]
    },
    19: {
      day: 19,
      module: "Module 3: Agentic AI & Tool Calling",
      title: "Agent Reliability & Fallback Strategies",
      key_concepts: ["Circuit Breakers", "Exponential Backoff", "Alternative Tool Routing"],
      tools: ["Tenacity", "Resilience4j Patterns"],
      objectives: "Ensure 99.9% agent execution uptime under upstream tool rate limits and API outages.",
      evaluation_topics: ["Tool Degradation Fallbacks", "Rate-limit Queueing", "Deterministic Emergency Brakes"]
    },

    // MCP
    20: {
      day: 20,
      module: "Module 4: Model Context Protocol (MCP)",
      title: "MCP Architecture & Protocol Overview",
      key_concepts: ["MCP Clients & Servers", "Resources, Prompts & Tools", "JSON-RPC 2.0 Transport"],
      tools: ["@modelcontextprotocol/sdk", "Anthropic Claude Desktop"],
      objectives: "Understand the core spec of Model Context Protocol for unifying AI tool interop.",
      evaluation_topics: ["MCP Client-Server Lifecycle", "JSON-RPC Message Framing", "Resource URI Schemes"]
    },
    21: {
      day: 21,
      module: "Module 4: Model Context Protocol (MCP)",
      title: "Building Custom MCP Servers (Node.js & Python)",
      key_concepts: ["MCP Tool Registration", "STDIO Transport", "SSE Transport", "Resource Providers"],
      tools: ["MCP Python SDK", "MCP TypeScript SDK"],
      objectives: "Construct custom MCP servers that expose local databases, APIs, and file structures.",
      evaluation_topics: ["STDIO vs SSE Transport Scenarios", "Tool Argument Schema Validation", "Error Code Standardizing"]
    },
    22: {
      day: 22,
      module: "Module 4: Model Context Protocol (MCP)",
      title: "MCP Security & Capability Negotiation",
      key_concepts: ["Capability Flags", "Authentication Headers", "Tool Scoping", "Access Controls"],
      tools: ["MCP Security Middleware", "OAuth2 Token Validation"],
      objectives: "Secure MCP endpoints against unauthorized tool execution and data leakage.",
      evaluation_topics: ["Capability Negotiation Handshake", "Resource Permission Scoping", "Sandboxed Server Execution"]
    },
    23: {
      day: 23,
      module: "Module 4: Model Context Protocol (MCP)",
      title: "Dynamic MCP Tool Discovery & Routing",
      key_concepts: ["Dynamic Tool Loading", "Vector Indexing of MCP Schemas", "Tool Selection Latency"],
      tools: ["MCP Hubs", "FastMCP"],
      objectives: "Scale client capabilities to 100+ MCP tools using dynamic vector indexing of tool descriptions.",
      evaluation_topics: ["Tool Description Search Optimization", "Context Window Budgeting for Tools", "Collision Resolution"]
    },
    24: {
      day: 24,
      module: "Module 4: Model Context Protocol (MCP)",
      title: "Enterprise Systems Integration via MCP",
      key_concepts: ["Legacy DB Adapters", "GitHub & Slack MCP Adapters", "Enterprise Data Gateways"],
      tools: ["Postgres MCP Server", "Filesystem MCP Server"],
      objectives: "Bridge enterprise databases and SaaS tools into an integrated MCP AI agent ecosystem.",
      evaluation_topics: ["Database Connection Pooling in MCP", "Streamed Progress Reporting", "Multi-tenant Isolation"]
    },

    // Deployment
    25: {
      day: 25,
      module: "Module 5: AI Deployment & Infrastructure",
      title: "LLM Serving & Inference Engines (vLLM, Ollama)",
      key_concepts: ["PagedAttention", "Continuous Batching", "Tensor Parallelism", "Quantization (AWQ/GPTQ)"],
      tools: ["vLLM", "TGI (Text Generation Inference)", "Ollama"],
      objectives: "Deploy high-throughput open-source model serving infrastructure with vLLM.",
      evaluation_topics: ["PagedAttention Memory Benefits", "Continuous Batching vs Naive Batching", "KV Cache Quantization"]
    },
    26: {
      day: 26,
      module: "Module 5: AI Deployment & Infrastructure",
      title: "LLM Streaming & Real-time WebSockets",
      key_concepts: ["Server-Sent Events (SSE)", "WebSocket Streaming", "Time-To-First-Token (TTFT)"],
      tools: ["FastAPI SSE", "Node.js ReadableStreams"],
      objectives: "Deliver low-latency streaming text responses with sub-200ms TTFT.",
      evaluation_topics: ["TTFT vs Inter-Token Latency", "Stream Reconnection Resilience", "Client-side Buffer Management"]
    },
    27: {
      day: 27,
      module: "Module 5: AI Deployment & Infrastructure",
      title: "Model Fine-Tuning & LoRA/QLoRA Optimization",
      key_concepts: ["Low-Rank Adaptation (LoRA)", "4-bit NormalFloat (NF4)", "SFT (Supervised Fine-Tuning)"],
      tools: ["Unsloth", "PEFT", "TRL"],
      objectives: "Fine-tune open-weight models on custom domain datasets using minimal GPU memory.",
      evaluation_topics: ["LoRA Rank (r) & Alpha Selection", "Catastrophic Forgetting Prevention", "Dataset Formatting for SFT"]
    },
    28: {
      day: 28,
      module: "Module 5: AI Deployment & Infrastructure",
      title: "AI Observability, Tracing & Cost Tracking",
      key_concepts: ["OpenTelemetry Spans", "Token Spend Tracking", "Latency Breakdown", "Trace Visualization"],
      tools: ["LangSmith", "Arize Phoenix", "OpenInference"],
      objectives: "Instrument production AI workloads with full OpenTelemetry request tracing and cost analytics.",
      evaluation_topics: ["Distributed Tracing Across Agents", "Latency Bottleneck Identification", "Cost Anomaly Alerting"]
    },

    // Production AI Systems
    29: {
      day: 29,
      module: "Module 6: Production AI Systems & Governance",
      title: "Semantic Caching & Cost Optimization",
      key_concepts: ["Vector Caching", "Cache Invalidation", "Prompt Hash Match vs Embedding Match"],
      tools: ["Redis Vector Cache", "GPTCache"],
      objectives: "Reduce LLM API costs by 40%+ using high-precision semantic caching.",
      evaluation_topics: ["Similarity Threshold Tuning for Cache", "Cache Stale Invalidation", "Dynamic TTL"]
    },
    30: {
      day: 30,
      module: "Module 6: Production AI Systems & Governance",
      title: "AI Security: Prompt Injection & Red Teaming",
      key_concepts: ["Indirect Prompt Injection", "Data Exfiltration Vectors", "Jailbreak Defense"],
      tools: ["Lakera Guard", "Promptfoo", "Garak Red Teaming"],
      objectives: "Harden agentic systems against malicious prompt injection and privileged execution leaks.",
      evaluation_topics: ["Indirect Injection via RAG Docs", "System Prompt Extraction Defenses", "Automated Red Teaming"]
    },
    31: {
      day: 31,
      module: "Module 6: Production AI Systems & Governance",
      title: "Production System Architecture & Capstone Review",
      key_concepts: ["End-to-End System Design", "SLA & Reliability", "Fail-safe Architectures"],
      tools: ["Full Stack AI Blueprint"],
      objectives: "Design end-to-end production AI system architectures and present engineering decisions.",
      evaluation_topics: ["Trade-off Defense (Latency vs Accuracy vs Cost)", "Architecture Disaster Recovery", "Production SLA Guarantees"]
    }
  }
};
