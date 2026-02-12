/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Tool Use",
  "Tool Definitions",
  "Single Tool Call",
  "Multi-Tool Chain",
  "Error Handling",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why LLMs need external tools",
  "How tools are defined with JSON schemas",
  "A single tool call in action",
  "Chaining multiple tools together",
  "Handling tool failures gracefully",
  "Best practices for tool design",
] as const;

/** Best practices for tool design */
export const TOOL_USE_BEST_PRACTICES = [
  {
    title: "Write Clear Descriptions",
    description:
      "Tool descriptions are the primary way LLMs understand what a tool does. Write precise, unambiguous descriptions that include expected input formats and what the tool returns.",
  },
  {
    title: "Validate Inputs",
    description:
      "Always validate tool inputs before execution. Use JSON Schema constraints (type, required, enum) to catch invalid arguments early and provide clear error messages.",
  },
  {
    title: "Handle Errors Gracefully",
    description:
      "Tools should return structured error responses instead of crashing. This lets the LLM understand what went wrong and either retry with corrected inputs or inform the user.",
  },
  {
    title: "Keep Tools Focused",
    description:
      "Each tool should do one thing well. Instead of a single do-everything tool, create small, composable tools that the LLM can chain together for complex workflows.",
  },
] as const;

/** Comparison table: LLM without tools vs with tools */
export interface ToolUseComparisonRow {
  feature: string;
  withoutTools: string;
  withTools: string;
}

export const TOOL_USE_COMPARISON_TABLE: ToolUseComparisonRow[] = [
  {
    feature: "Mathematical Calculations",
    withoutTools:
      "Approximates answers, often makes errors with large numbers or complex arithmetic",
    withTools:
      "Delegates to a calculator tool for precise, verified results every time",
  },
  {
    feature: "Real-Time Data",
    withoutTools:
      "Limited to training data with a fixed knowledge cutoff, cannot access current information",
    withTools:
      "Calls live APIs to fetch current weather, stock prices, news, and other real-time data",
  },
  {
    feature: "Database Access",
    withoutTools:
      "Cannot query databases or access structured data stores of any kind",
    withTools:
      "Executes SQL queries against databases and processes the returned results",
  },
  {
    feature: "Reliability",
    withoutTools:
      "May hallucinate facts or produce plausible-sounding but incorrect answers",
    withTools:
      "Grounds responses in actual tool outputs, significantly reducing hallucinations",
  },
];
