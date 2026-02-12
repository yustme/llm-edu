/** Represents a single agent in an orchestration pattern */
export interface OrchestrationAgent {
  id: string;
  name: string;
  role: string;
  /** Tailwind color name like "blue", "green", "purple" */
  color: string;
}

/** Describes an orchestration pattern with its agents and flow */
export interface OrchestrationPattern {
  name: string;
  description: string;
  agents: OrchestrationAgent[];
  /** Descriptions of flow steps */
  flow: string[];
}

/** Sequential pipeline: extract -> transform -> load */
export const SEQUENTIAL_PATTERN: OrchestrationPattern = {
  name: "Sequential Pipeline",
  description:
    "Agents work in sequence. Each agent receives the output of the previous one and passes its result to the next.",
  agents: [
    {
      id: "extractor",
      name: "Extractor",
      role: "Reads raw data from source",
      color: "blue",
    },
    {
      id: "transformer",
      name: "Transformer",
      role: "Cleans and structures data",
      color: "amber",
    },
    {
      id: "loader",
      name: "Loader",
      role: "Writes data to destination",
      color: "green",
    },
  ],
  flow: [
    "User submits a data processing request",
    "Extractor reads raw data from the source system",
    "Transformer cleans, validates, and restructures the data",
    "Loader writes the processed data to the target system",
    "Final result is returned to the user",
  ],
};

/** Parallel fan-out: orchestrator splits work across workers, then merges */
export const PARALLEL_PATTERN: OrchestrationPattern = {
  name: "Parallel Fan-Out",
  description:
    "An orchestrator splits the task into independent sub-tasks, fan-out agents work concurrently, and results are merged.",
  agents: [
    {
      id: "orchestrator",
      name: "Orchestrator",
      role: "Splits task into sub-tasks",
      color: "purple",
    },
    {
      id: "worker-a",
      name: "Researcher",
      role: "Searches web sources",
      color: "blue",
    },
    {
      id: "worker-b",
      name: "Analyst",
      role: "Analyzes internal data",
      color: "amber",
    },
    {
      id: "worker-c",
      name: "Fact-Checker",
      role: "Verifies claims and sources",
      color: "green",
    },
    {
      id: "merger",
      name: "Merger",
      role: "Combines and deduplicates results",
      color: "rose",
    },
  ],
  flow: [
    "User submits a research question",
    "Orchestrator decomposes the question into independent sub-tasks",
    "Three workers execute their sub-tasks in parallel",
    "Merger combines all results into a single coherent answer",
    "Final merged result is returned to the user",
  ],
};

/** Router: classify query and route to specialist */
export const ROUTER_PATTERN: OrchestrationPattern = {
  name: "Router Pattern",
  description:
    "A router agent classifies the incoming query and routes it to the most appropriate specialist agent.",
  agents: [
    {
      id: "router",
      name: "Router",
      role: "Classifies query intent",
      color: "purple",
    },
    {
      id: "specialist-code",
      name: "Code Expert",
      role: "Handles programming questions",
      color: "blue",
    },
    {
      id: "specialist-data",
      name: "Data Expert",
      role: "Handles data analysis queries",
      color: "amber",
    },
    {
      id: "specialist-general",
      name: "General Expert",
      role: "Handles general knowledge questions",
      color: "green",
    },
  ],
  flow: [
    "User submits a query",
    "Router classifies the query intent (code, data, or general)",
    "Query is forwarded to the matching specialist",
    "Specialist generates a domain-specific response",
    "Response is returned to the user",
  ],
};

/** Evaluator-optimizer: generate, evaluate, improve loop */
export const EVALUATOR_PATTERN: OrchestrationPattern = {
  name: "Evaluator-Optimizer Loop",
  description:
    "A generator produces output, an evaluator scores it, and if the quality is insufficient, the generator refines its output in a loop.",
  agents: [
    {
      id: "generator",
      name: "Generator",
      role: "Produces initial output",
      color: "blue",
    },
    {
      id: "evaluator",
      name: "Evaluator",
      role: "Scores output quality",
      color: "amber",
    },
  ],
  flow: [
    "User submits a quality-sensitive request",
    "Generator produces an initial draft",
    "Evaluator scores the draft against quality criteria",
    "If score is below threshold, Generator refines with feedback",
    "Loop repeats until quality threshold is met",
  ],
};

/** Query type options for the router pattern demo */
export const ROUTER_QUERY_TYPES = [
  {
    label: "How do I write a React hook?",
    targetAgentId: "specialist-code",
    type: "Code",
  },
  {
    label: "Show me sales trends for Q4",
    targetAgentId: "specialist-data",
    type: "Data",
  },
  {
    label: "What is the capital of France?",
    targetAgentId: "specialist-general",
    type: "General",
  },
] as const;

/** Iteration data for the evaluator-optimizer demo */
export const EVALUATOR_ITERATIONS = [
  { iteration: 1, score: 65, feedback: "Missing key details and examples" },
  { iteration: 2, score: 82, feedback: "Good structure, needs more depth" },
  { iteration: 3, score: 94, feedback: "Meets quality threshold" },
] as const;
