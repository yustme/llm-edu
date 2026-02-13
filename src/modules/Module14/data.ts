/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "What are Knowledge Graphs",
  "Building KGs from Text",
  "Querying Knowledge Graphs",
  "Interactive Graph Explorer",
  "KGs + LLMs",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Nodes, edges, and triples -- the building blocks of knowledge graphs",
  "NER and relation extraction: turning raw text into structured knowledge",
  "Single-hop, multi-hop, and path-finding query patterns",
  "Explore a knowledge graph interactively with search and filtering",
  "How LLMs leverage knowledge graphs for grounding and reasoning",
  "When to use KGs, comparison with vector DBs, and tooling overview",
] as const;
