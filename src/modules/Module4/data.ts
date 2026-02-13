/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Why Structured Output",
  "JSON Schema",
  "Function Calling",
  "Interactive Schema Builder",
  "Validation & Error Recovery",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Free text is unpredictable - structured output makes LLM responses parseable and validated",
  "JSON Schema defines the shape, types, and constraints your output must satisfy",
  "Tool use pattern: define tools with schemas, LLM selects tool and fills parameters",
  "Choose a schema template, see the schema, and compare valid vs invalid output",
  "Parse, validate, and retry: the pipeline that ensures reliable structured output",
  "When to use JSON mode, function calling, or prompt-based approaches",
] as const;
