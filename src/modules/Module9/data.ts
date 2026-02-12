/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Evaluation",
  "Key Metrics",
  "Test Cases",
  "LLM-as-Judge",
  "Evaluation Run",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why evaluating AI agents is critical",
  "Accuracy, latency, cost, tool correctness, completion rate",
  "Unit, integration, and end-to-end test types",
  "Using an LLM to evaluate another LLM's output",
  "Running a batch evaluation with animated results",
  "Testing strategy and deployment workflow",
] as const;

/** Best practice for evaluation strategy */
export interface EvalBestPractice {
  title: string;
  description: string;
}

/** Best practices for AI agent evaluation */
export const EVAL_BEST_PRACTICES: EvalBestPractice[] = [
  {
    title: "Automate regression tests",
    description:
      "Run your evaluation suite on every pull request. Catch quality regressions before they reach production by comparing metrics against baseline thresholds.",
  },
  {
    title: "Use LLM-as-Judge for subjective criteria",
    description:
      "Human evaluation does not scale. Use a strong LLM to score outputs on criteria like helpfulness, accuracy, and formatting with a structured rubric.",
  },
  {
    title: "Track metrics over time",
    description:
      "Store evaluation results in a dashboard. Monitor trends in accuracy, latency, and cost across model versions so you can spot degradation early.",
  },
  {
    title: "Test at every layer",
    description:
      "Combine unit tests for individual tools, integration tests for tool chains, and end-to-end tests for full workflows to cover all failure modes.",
  },
];
