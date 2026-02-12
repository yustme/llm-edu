/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction",
  "Meet the Agents",
  "Workflow Overview",
  "Step-by-Step Animation",
  "Message Detail",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why do we need multiple agents?",
  "Meet the three specialized agents",
  "How agents collaborate on a task",
  "Watch agents solve a task step by step",
  "Browse individual agent messages",
  "Key takeaways and architecture recap",
] as const;

/** Key benefits of multi-agent architecture */
export const MULTI_AGENT_BENEFITS = [
  {
    title: "Specialization",
    description:
      "Each agent focuses on what it does best - analysis, data engineering, or reporting.",
  },
  {
    title: "Scalability",
    description:
      "Add new agents without modifying existing ones. Each agent is independent.",
  },
  {
    title: "Parallel Processing",
    description:
      "Independent tasks can run simultaneously across different agents.",
  },
  {
    title: "Separation of Concerns",
    description:
      "Clear boundaries between responsibilities reduce complexity and errors.",
  },
] as const;

/** Pros and cons for the summary step */
export const PROS_AND_CONS = {
  pros: [
    "Each agent is an expert in its domain",
    "Easy to add, remove, or swap agents",
    "Complex tasks are broken into manageable parts",
    "Agents can be developed and tested independently",
    "Natural fault isolation between components",
  ],
  cons: [
    "Increased communication overhead between agents",
    "More complex orchestration and error handling",
    "Potential latency from multi-hop message passing",
    "Requires clear interface definitions between agents",
    "Debugging distributed workflows is more difficult",
  ],
} as const;
