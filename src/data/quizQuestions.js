/**
 * 10-Question Structured Interview Quiz
 * Mix of MCQ (with options) and free-text questions
 * Basic AI Cohort concepts — approachable for all levels
 */
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    type: "mcq",
    category: "Fundamentals",
    categoryColor: "#3B82F6",
    question: "What does RAG stand for in AI systems?",
    options: [
      "Random Access Generation",
      "Retrieval-Augmented Generation",
      "Rapid Agent Graphs",
      "Recursive Attention Grounding"
    ],
    correctIndex: 1,
    explanation: "RAG (Retrieval-Augmented Generation) is a technique that enhances LLM responses by first retrieving relevant documents from a knowledge base before generating an answer."
  },
  {
    id: 2,
    type: "mcq",
    category: "Vector Databases",
    categoryColor: "#00F2FE",
    question: "Which similarity metric is most commonly used when comparing two embedding vectors?",
    options: [
      "Manhattan Distance",
      "Pearson Correlation",
      "Cosine Similarity",
      "Hamming Distance"
    ],
    correctIndex: 2,
    explanation: "Cosine Similarity measures the angle between two vectors and is ideal for embeddings because it captures semantic direction regardless of magnitude."
  },
  {
    id: 3,
    type: "text",
    category: "Prompt Engineering",
    categoryColor: "#8B5CF6",
    question: "In your own words, what is prompt engineering and why is it important for working with AI models?",
    placeholder: "Describe what prompt engineering means and how it helps get better results from AI...",
    minWords: 15
  },
  {
    id: 4,
    type: "mcq",
    category: "Agentic AI",
    categoryColor: "#10B981",
    question: "In a ReAct (Reasoning + Acting) agent loop, what is the correct order of steps?",
    options: [
      "Action → Observation → Thought",
      "Thought → Observation → Action",
      "Thought → Action → Observation",
      "Observation → Action → Thought"
    ],
    correctIndex: 2,
    explanation: "A ReAct loop follows: Thought (reasoning about the goal) → Action (calling a tool) → Observation (receiving tool output), repeating until the task is complete."
  },
  {
    id: 5,
    type: "mcq",
    category: "Model Context Protocol",
    categoryColor: "#EC4899",
    question: "What does MCP (Model Context Protocol) primarily help AI agents do?",
    options: [
      "Train language models faster",
      "Compress large datasets",
      "Connect to external tools and data sources in a standardized way",
      "Visualize neural network layers"
    ],
    correctIndex: 2,
    explanation: "MCP is an open protocol that enables AI models to securely connect to external tools, APIs, and data sources using a standardized client-server interface."
  },
  {
    id: 6,
    type: "text",
    category: "Vector Databases",
    categoryColor: "#00F2FE",
    question: "Imagine you are building a smart FAQ chatbot. How would you use a vector database to help it answer questions accurately?",
    placeholder: "Walk through how you would store FAQs, convert them to embeddings, and retrieve the right answer...",
    minWords: 20
  },
  {
    id: 7,
    type: "mcq",
    category: "AI Deployment",
    categoryColor: "#F59E0B",
    question: "What is the primary advantage of vLLM's PagedAttention mechanism for LLM serving?",
    options: [
      "It makes model training 10x faster",
      "It manages GPU memory for the KV cache efficiently, enabling higher throughput",
      "It automatically fine-tunes models on new data",
      "It converts PyTorch models to ONNX format"
    ],
    correctIndex: 1,
    explanation: "PagedAttention divides GPU memory for the KV cache into non-contiguous pages (like OS virtual memory), allowing much higher batch sizes and throughput with no memory waste."
  },
  {
    id: 8,
    type: "mcq",
    category: "RAG Systems",
    categoryColor: "#00F2FE",
    question: "Which of the following best describes 'chunking' in a RAG pipeline?",
    options: [
      "Splitting an AI model into smaller sub-models",
      "Breaking large documents into smaller, manageable text segments for indexing",
      "Grouping similar API calls together for efficiency",
      "Compressing vector embeddings to save storage space"
    ],
    correctIndex: 1,
    explanation: "Chunking splits large documents (PDFs, articles, etc.) into smaller text segments so that each chunk can be meaningfully embedded and retrieved for a user's query."
  },
  {
    id: 9,
    type: "text",
    category: "Production AI",
    categoryColor: "#10B981",
    question: "What does 'AI Observability' mean, and why should you care about it in a real-world AI product?",
    placeholder: "Think about what could go wrong in a deployed AI system and how you'd monitor it...",
    minWords: 15
  },
  {
    id: 10,
    type: "text",
    category: "Personal Goals",
    categoryColor: "#F43F5E",
    question: "After completing the 31-Day AI Engineering Cohort, what is one real-world AI project you would want to build and why?",
    placeholder: "Describe your project idea — what problem it solves, what AI technologies you would use...",
    minWords: 20
  }
];

export const QUIZ_META = {
  totalQuestions: 10,
  mcqCount: 6,
  textCount: 4,
  estimatedMinutes: 8
};
