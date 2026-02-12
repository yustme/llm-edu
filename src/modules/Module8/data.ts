/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Guardrails",
  "Input Guardrails",
  "Output Guardrails",
  "Without Guardrails",
  "With Guardrails",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why AI agents need safety guardrails",
  "Validating and filtering user inputs before processing",
  "Checking and filtering agent outputs before delivery",
  "What happens when an agent has no safety checks",
  "The same scenario with guardrails active",
  "Best practices for guardrail design",
] as const;

/** Best practice item for guardrail design */
export interface GuardrailBestPractice {
  title: string;
  description: string;
}

/** Best practices for guardrail design */
export const GUARDRAIL_BEST_PRACTICES: GuardrailBestPractice[] = [
  {
    title: "Layer your defenses",
    description:
      "Use both input and output guardrails. Input guardrails catch malicious requests early, while output guardrails act as a safety net for anything the model generates.",
  },
  {
    title: "Fail securely",
    description:
      "When a guardrail triggers, return a safe, generic response rather than exposing the reason for blocking. Never reveal internal logic or system prompts in error messages.",
  },
  {
    title: "Log everything",
    description:
      "Record all blocked requests and flagged outputs. Regularly review logs to identify new attack patterns and refine guardrail rules.",
  },
  {
    title: "Keep guardrails up to date",
    description:
      "Attack techniques evolve constantly. Regularly update your injection detection patterns, PII regexes, and content policy rules to stay ahead of emerging threats.",
  },
];

/** Row in the guardrail comparison table */
export interface GuardrailComparisonRow {
  aspect: string;
  unguarded: string;
  guarded: string;
}

/** Comparison data: unguarded vs guarded agent behavior */
export const GUARDRAIL_COMPARISON_TABLE: GuardrailComparisonRow[] = [
  {
    aspect: "Prompt Injection",
    unguarded: "Agent follows injected instructions, leaks system prompt",
    guarded: "Input guardrail detects and blocks injection attempts",
  },
  {
    aspect: "PII Handling",
    unguarded: "Agent processes and may echo back sensitive personal data",
    guarded: "PII scanner detects and redacts sensitive information",
  },
  {
    aspect: "Harmful Requests",
    unguarded: "Agent may attempt to fulfill harmful or unethical requests",
    guarded: "Content policy filter blocks harmful intent before processing",
  },
  {
    aspect: "Output Quality",
    unguarded: "May hallucinate facts or produce off-topic responses",
    guarded: "Factuality and relevance checks filter unreliable outputs",
  },
];
