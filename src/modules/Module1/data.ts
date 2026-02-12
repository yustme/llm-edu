/** Comparison table data: feature differences between LLM and Agent */
export interface ComparisonRow {
  feature: string;
  llm: string;
  agent: string;
}

export const COMPARISON_TABLE: ComparisonRow[] = [
  {
    feature: "Data Access",
    llm: "No access to external data; limited to training data and conversation context",
    agent: "Can query databases, call APIs, read files, and access real-time data via tools",
  },
  {
    feature: "Reasoning",
    llm: "Single-pass text generation without iterative problem solving",
    agent: "Multi-step reasoning loop: Think, Act, Observe, repeat until solved",
  },
  {
    feature: "Actions",
    llm: "Can only generate text responses; cannot execute code or interact with systems",
    agent: "Can execute SQL, call APIs, run code, send emails, and perform real-world actions",
  },
  {
    feature: "Response Quality",
    llm: "Generic, often apologetic responses when asked about specific data",
    agent: "Data-driven, specific answers with actual numbers and contextual insights",
  },
];

/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction",
  "Plain LLM Demo",
  "What is an Agent?",
  "Agent Demo",
  "Comparison",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "LLMs are powerful, but they have limitations",
  "See how a plain LLM handles a data question",
  "Agent = LLM + Tools + Reasoning Loop + Memory",
  "Watch an agent solve the same question step by step",
  "Side-by-side comparison of LLM vs Agent responses",
  "Key takeaways and architecture recap",
] as const;

/** Architecture diagram labels for the summary step */
export const ARCHITECTURE_LABELS = {
  llm: "LLM",
  tools: "Tools",
  reasoningLoop: "Reasoning Loop",
  memory: "Memory",
  toolExamples: ["SQL Database", "REST API", "File System", "Web Search"],
  reasoningSteps: ["Think", "Act", "Observe"],
  memoryTypes: ["Conversation History", "Context Window"],
} as const;

/** Agent component descriptions for Step 3 */
export const AGENT_COMPONENTS = {
  tools: {
    title: "Tools",
    description:
      "External capabilities the agent can invoke - run SQL queries, call APIs, read files, execute code, and interact with real-world systems.",
  },
  reasoningLoop: {
    title: "Reasoning Loop",
    description:
      "The Think-Act-Observe cycle that allows agents to break problems into steps, take actions, evaluate results, and iterate until the task is complete.",
  },
  memory: {
    title: "Memory",
    description:
      "The agent maintains conversation history and accumulated context, allowing it to reference previous results and build on earlier reasoning.",
  },
} as const;
