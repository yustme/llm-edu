/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Why Chunking",
  "Basic Strategies",
  "Advanced Strategies",
  "Interactive Chunking Demo",
  "Chunk Size Tradeoffs",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why documents must be split into chunks for RAG pipelines",
  "Fixed-size, sentence-based, and paragraph-based splitting",
  "Recursive splitting, semantic grouping, and sliding window overlap",
  "Try different chunking strategies on sample text interactively",
  "Understanding the impact of chunk size on retrieval quality",
  "Decision matrix and best practices for choosing a strategy",
] as const;
