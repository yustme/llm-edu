/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Orchestration",
  "Sequential Pipeline",
  "Parallel Fan-Out",
  "Router Pattern",
  "Evaluator-Optimizer",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why orchestration patterns matter for complex tasks",
  "Agents working in sequence like a pipeline",
  "Fan-out work to parallel agents, then merge results",
  "Route queries to specialized agents based on intent",
  "Generate, evaluate, and improve in a loop",
  "Pattern comparison and decision framework",
] as const;

/** Row in the pattern comparison table */
export interface PatternComparisonRow {
  pattern: string;
  bestFor: string;
  complexity: string;
  latency: string;
}

/** Comparison data for the summary step */
export const PATTERN_COMPARISON: PatternComparisonRow[] = [
  {
    pattern: "Sequential",
    bestFor: "Multi-step pipelines where each step depends on the previous",
    complexity: "Low",
    latency: "High (sum of all steps)",
  },
  {
    pattern: "Parallel",
    bestFor: "Independent sub-tasks that can run concurrently",
    complexity: "Medium",
    latency: "Low (longest branch)",
  },
  {
    pattern: "Router",
    bestFor: "Queries requiring different specialist handling",
    complexity: "Medium",
    latency: "Low (single specialist)",
  },
  {
    pattern: "Evaluator-Optimizer",
    bestFor: "Quality-sensitive outputs that benefit from iterative refinement",
    complexity: "High",
    latency: "Variable (depends on iterations)",
  },
];
