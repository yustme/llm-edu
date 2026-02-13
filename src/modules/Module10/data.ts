/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Optimization",
  "Cost Breakdown",
  "Latency Breakdown",
  "Optimization Strategies",
  "Optimization Demo",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why cost and latency matter for production agents",
  "Where costs come from: tokens, tool calls, model choice",
  "Latency sources: model inference, tool execution, network",
  "Techniques to reduce both cost and latency",
  "Naive vs optimized agent side-by-side",
  "Decision framework and optimization checklist",
] as const;

/** An optimization technique with its impact */
export interface OptimizationTechnique {
  id: string;
  name: string;
  description: string;
  costReduction: number;
  latencyReduction: number;
  label: string;
}

/** Four key optimization techniques with measurable impacts */
export const OPTIMIZATION_TECHNIQUES: OptimizationTechnique[] = [
  {
    id: "caching",
    name: "Caching",
    description:
      "Cache frequent queries and embeddings to avoid redundant LLM calls. Semantic caching matches similar queries to cached responses.",
    costReduction: 40,
    latencyReduction: 30,
    label: "-40% cost",
  },
  {
    id: "model-routing",
    name: "Model Routing",
    description:
      "Route simple queries to smaller, cheaper models (e.g., Haiku) and only use powerful models (e.g., Sonnet) for complex tasks.",
    costReduction: 30,
    latencyReduction: 20,
    label: "-30% cost",
  },
  {
    id: "prompt-optimization",
    name: "Prompt Optimization",
    description:
      "Reduce token count by trimming verbose system prompts, using concise instructions, and removing unnecessary context.",
    costReduction: 20,
    latencyReduction: 15,
    label: "-20% tokens",
  },
  {
    id: "parallel-tools",
    name: "Parallel Tool Calls",
    description:
      "Execute independent tool calls simultaneously instead of sequentially. Cuts wait time when multiple tools are needed.",
    costReduction: 0,
    latencyReduction: 50,
    label: "-50% latency",
  },
];

/** Checklist item for the summary step */
export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

/** Optimization checklist for the summary step */
export const OPTIMIZATION_CHECKLIST: ChecklistItem[] = [
  {
    id: "measure-baseline",
    label: "Measure baseline cost and latency",
    description: "Establish metrics before optimizing so you can track improvements.",
  },
  {
    id: "identify-bottleneck",
    label: "Identify the biggest bottleneck",
    description: "Is it model inference, tool calls, or token volume? Optimize the largest contributor first.",
  },
  {
    id: "apply-caching",
    label: "Add caching for repeated queries",
    description: "Semantic caching can eliminate up to 40% of LLM calls for common questions.",
  },
  {
    id: "route-models",
    label: "Implement model routing",
    description: "Use a small classifier to route simple queries to cheaper models.",
  },
  {
    id: "optimize-prompts",
    label: "Trim and optimize prompts",
    description: "Remove unnecessary context, use concise instructions, and minimize few-shot examples.",
  },
  {
    id: "parallelize-tools",
    label: "Parallelize independent tool calls",
    description: "Run non-dependent tool calls concurrently to cut latency in half.",
  },
  {
    id: "measure-again",
    label: "Measure after each change",
    description: "Validate that optimizations actually improved metrics without degrading quality.",
  },
];
