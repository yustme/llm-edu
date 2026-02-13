// ---------------------------------------------------------------------------
// Model context window specifications
// ---------------------------------------------------------------------------

export interface ModelSpec {
  name: string;
  provider: string;
  contextWindow: number;
  maxOutput: number;
  inputCostPer1k: number;
  outputCostPer1k: number;
  color: string;
}

export const MODEL_SPECS: ModelSpec[] = [
  {
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128_000,
    maxOutput: 16_384,
    inputCostPer1k: 0.005,
    outputCostPer1k: 0.015,
    color: "emerald",
  },
  {
    name: "GPT-4o Mini",
    provider: "OpenAI",
    contextWindow: 128_000,
    maxOutput: 16_384,
    inputCostPer1k: 0.00015,
    outputCostPer1k: 0.0006,
    color: "green",
  },
  {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: 200_000,
    maxOutput: 8_192,
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
    color: "violet",
  },
  {
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    contextWindow: 200_000,
    maxOutput: 4_096,
    inputCostPer1k: 0.00025,
    outputCostPer1k: 0.00125,
    color: "purple",
  },
  {
    name: "Llama 3.1 8B",
    provider: "Meta",
    contextWindow: 128_000,
    maxOutput: 4_096,
    inputCostPer1k: 0.0001,
    outputCostPer1k: 0.0001,
    color: "blue",
  },
  {
    name: "Mistral Large",
    provider: "Mistral",
    contextWindow: 128_000,
    maxOutput: 8_192,
    inputCostPer1k: 0.002,
    outputCostPer1k: 0.006,
    color: "orange",
  },
  {
    name: "Gemini 1.5 Pro",
    provider: "Google",
    contextWindow: 2_000_000,
    maxOutput: 8_192,
    inputCostPer1k: 0.00125,
    outputCostPer1k: 0.005,
    color: "sky",
  },
];

// ---------------------------------------------------------------------------
// Example prompts for the token counter demo
// ---------------------------------------------------------------------------

export interface ExamplePrompt {
  label: string;
  systemPrompt: string;
  userPrompt: string;
}

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    label: "Simple Question",
    systemPrompt: "You are a helpful assistant.",
    userPrompt: "What is the capital of France?",
  },
  {
    label: "Data Analysis",
    systemPrompt:
      "You are a data analyst. Analyze the provided dataset and return insights in JSON format. Focus on trends, outliers, and actionable recommendations. Always cite specific numbers from the data.",
    userPrompt:
      "Here is our Q4 sales data by region: North America had $4.2M revenue with 12% growth, Europe had $2.8M with 8% growth, APAC had $1.9M with 22% growth, and LATAM had $0.8M with -3% decline. Total headcount is 450 across all regions. Marketing spend was $1.2M. What are the key trends and what should we focus on next quarter?",
  },
  {
    label: "Code Review",
    systemPrompt:
      "You are a senior software engineer reviewing code. Check for bugs, performance issues, security vulnerabilities, and style violations. Provide specific line-by-line feedback. Follow the team coding standards: use TypeScript strict mode, prefer const over let, always handle errors explicitly, and document public APIs with JSDoc.",
    userPrompt:
      'Review this TypeScript function:\n\nfunction fetchUserData(userId: string) {\n  let response = fetch("/api/users/" + userId);\n  let data = response.json();\n  if (data.error) {\n    console.log("Error:", data.error);\n  }\n  return data;\n}\n\nfunction processUsers(ids: string[]) {\n  let results = [];\n  for (let i = 0; i < ids.length; i++) {\n    results.push(fetchUserData(ids[i]));\n  }\n  return results;\n}',
  },
  {
    label: "RAG with Context",
    systemPrompt:
      "You are a customer support agent for TechCorp. Answer questions based ONLY on the provided context documents. If the answer is not in the context, say so. Never make up information. Always cite which document section your answer comes from.",
    userPrompt:
      "Context documents:\n\n[Doc 1 - Return Policy]\nTechCorp offers a 30-day return policy for all hardware products purchased directly from our store. Items must be in original packaging and unused condition. Refunds are processed within 5-7 business days. Software licenses are non-refundable once activated. Enterprise customers with support contracts may have extended return windows as specified in their agreement.\n\n[Doc 2 - Warranty Information]\nAll TechCorp hardware products come with a standard 2-year manufacturer warranty covering defects in materials and workmanship. The warranty does not cover damage from misuse, accidents, or unauthorized modifications. Extended warranty plans (3-year and 5-year) are available for purchase within 30 days of the original purchase date.\n\n[Doc 3 - Shipping]\nStandard shipping is free for orders over $50. Express shipping (2-day) is available for $12.99. Overnight shipping is $24.99. International shipping rates vary by destination. Orders placed before 2 PM EST ship the same business day.\n\nQuestion: I bought a laptop 45 days ago and it stopped working. What are my options?",
  },
];

// ---------------------------------------------------------------------------
// Overflow strategy descriptions
// ---------------------------------------------------------------------------

export interface OverflowStrategy {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
}

export const OVERFLOW_STRATEGIES: OverflowStrategy[] = [
  {
    id: "truncation",
    name: "Truncation",
    description:
      "Remove the oldest messages from the conversation history, keeping only the most recent ones that fit within the context window.",
    pros: [
      "Simple to implement",
      "Predictable behavior",
      "Low computational overhead",
    ],
    cons: [
      "Loses early context entirely",
      "Can break multi-step reasoning",
      "No awareness of message importance",
    ],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description:
      "Keep the system prompt and recent messages within a fixed window size. As new messages arrive, the oldest user/assistant turns slide out.",
    pros: [
      "Preserves system instructions",
      "Good for chat applications",
      "Maintains recent context",
    ],
    cons: [
      "Still loses older context",
      "Window size needs tuning",
      "Important early details may be lost",
    ],
  },
  {
    id: "summarization",
    name: "Summarization",
    description:
      "Use an LLM to compress older conversation history into a concise summary, then prepend it to the current context window.",
    pros: [
      "Preserves key information",
      "Adapts to content importance",
      "Best context retention",
    ],
    cons: [
      "Adds latency and cost (extra LLM call)",
      "Summary may lose nuance",
      "Risk of compounding errors",
    ],
  },
];

// ---------------------------------------------------------------------------
// Optimization techniques for Step 5
// ---------------------------------------------------------------------------

export interface ContextOptimization {
  id: string;
  name: string;
  description: string;
  savings: string;
  example: string;
}

export const CONTEXT_OPTIMIZATIONS: ContextOptimization[] = [
  {
    id: "prompt-compression",
    name: "Prompt Compression",
    description:
      "Reduce verbose system prompts by removing filler words, consolidating instructions, and using structured formats like YAML or bullet points instead of prose.",
    savings: "30-50% token reduction",
    example:
      "Before: 'You are a helpful AI assistant that specializes in analyzing data...'\nAfter: 'Role: Data analyst. Output: JSON insights.'",
  },
  {
    id: "few-shot-selection",
    name: "Dynamic Few-Shot Selection",
    description:
      "Instead of including all examples in the prompt, use semantic similarity to select only the most relevant 2-3 examples for the current query.",
    savings: "40-70% token reduction",
    example:
      "Fixed: 10 examples always included (2000 tokens)\nDynamic: 2-3 relevant examples selected (400-600 tokens)",
  },
  {
    id: "context-caching",
    name: "Context Caching",
    description:
      "Cache the system prompt and tool definitions so they do not need to be re-tokenized on every request. Supported by Anthropic and OpenAI APIs.",
    savings: "Up to 90% cost reduction on cached prefix",
    example:
      "System prompt (1500 tokens) cached for 5 min.\nSubsequent calls only pay for new user messages.",
  },
  {
    id: "chunked-retrieval",
    name: "Chunked Retrieval (RAG)",
    description:
      "Retrieve only the most relevant document chunks instead of full documents. Use smaller chunk sizes and re-ranking to maximize information density.",
    savings: "60-80% context reduction",
    example:
      "Full doc: 15000 tokens\nTop-3 chunks: 1500 tokens (with re-ranking)",
  },
  {
    id: "tool-result-trimming",
    name: "Tool Result Trimming",
    description:
      "Truncate or summarize tool call results before inserting them back into the context. Remove metadata, format compactly, and keep only relevant fields.",
    savings: "50-70% per tool result",
    example:
      "Raw API response: 800 tokens\nTrimmed to relevant fields: 150 tokens",
  },
];

// ---------------------------------------------------------------------------
// Token counter configuration
// ---------------------------------------------------------------------------

/** Approximate multiplier: 1 whitespace-split word ~ this many tokens */
export const WORD_TO_TOKEN_RATIO = 1.3;

/** Default context window size for the token counter (in tokens) */
export const DEFAULT_CONTEXT_WINDOW_SIZE = 128_000;

/** Default response reservation (in tokens) */
export const DEFAULT_RESPONSE_RESERVATION = 4_096;

/** Maximum context window for the interactive selector */
export const MAX_CONTEXT_WINDOW_SIZE = 200_000;
