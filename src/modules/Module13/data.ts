/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Limitations of Standard RAG",
  "Knowledge Graph Construction",
  "Community Detection",
  "Query Flow Demo",
  "Graph vs Vector Comparison",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why standard RAG fails at relationship and multi-hop queries",
  "From raw text to entities, relationships, and graph structures",
  "Clustering nodes into communities with hierarchical summaries",
  "Local search and global search paths through the knowledge graph",
  "When to use vector RAG, graph RAG, or a hybrid approach",
  "Architecture overview and key takeaways",
] as const;

/** Key takeaways for the summary step */
export interface GraphRagTakeaway {
  title: string;
  description: string;
}

export const KEY_TAKEAWAYS: GraphRagTakeaway[] = [
  {
    title: "GraphRAG adds structure to retrieval",
    description:
      "By organizing knowledge as entities and relationships instead of flat chunks, GraphRAG enables multi-hop reasoning and relationship-aware answers that standard vector RAG cannot achieve.",
  },
  {
    title: "Community summaries enable global understanding",
    description:
      "Hierarchical community detection and summarization give the LLM a bird's-eye view of the entire knowledge base, making it possible to answer broad thematic questions.",
  },
  {
    title: "Local and global search complement each other",
    description:
      "Local search traverses specific entity neighborhoods for precise queries, while global search aggregates community summaries for holistic questions. A query router picks the right strategy.",
  },
  {
    title: "Graph construction is the main cost",
    description:
      "Entity extraction, relationship mapping, and community detection require significant upfront processing. This investment pays off when queries demand structural reasoning.",
  },
] as const;
