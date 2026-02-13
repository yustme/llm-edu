/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to RAG",
  "RAG Architecture",
  "Without RAG",
  "With RAG",
  "Comparison",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why LLMs need external knowledge",
  "The RAG pipeline: Query, Embed, Retrieve, Generate",
  "LLM answers domain questions without external knowledge",
  "The same question with retrieved context",
  "Side-by-side: with vs without RAG",
  "Key takeaways and best practices",
] as const;

/** Comparison table data: feature differences with and without RAG */
export interface RagComparisonRow {
  feature: string;
  withoutRag: string;
  withRag: string;
}

export const RAG_COMPARISON_TABLE: RagComparisonRow[] = [
  {
    feature: "Knowledge Source",
    withoutRag:
      "Limited to training data with a fixed knowledge cutoff date",
    withRag:
      "Training data plus up-to-date documents from a curated knowledge base",
  },
  {
    feature: "Accuracy",
    withoutRag:
      "Prone to hallucination when asked about domain-specific or recent topics",
    withRag:
      "Grounded in retrieved documents, significantly reducing hallucinations",
  },
  {
    feature: "Transparency",
    withoutRag:
      "No way to verify where the answer came from or trace its sources",
    withRag:
      "Answers include source citations, enabling verification and auditing",
  },
  {
    feature: "Maintenance",
    withoutRag:
      "Requires expensive fine-tuning or retraining to incorporate new data",
    withRag:
      "Simply update the document index to add, remove, or refresh knowledge",
  },
  {
    feature: "Cost",
    withoutRag:
      "Fine-tuning is expensive and time-consuming for every knowledge update",
    withRag:
      "Embedding and indexing documents is cheap and can run incrementally",
  },
];

/** RAG pipeline stage labels for the architecture diagram */
export const RAG_PIPELINE_STAGES = [
  {
    label: "User Query",
    description: "Natural language question from the user",
  },
  {
    label: "Embedding Model",
    description: "Converts the query into a vector representation",
  },
  {
    label: "Vector Search",
    description: "Finds the most similar document chunks by cosine distance",
  },
  {
    label: "Retrieved Chunks",
    description: "Top-k document fragments ranked by relevance",
  },
  {
    label: "LLM + Context",
    description: "The LLM receives the query together with retrieved chunks",
  },
  {
    label: "Answer",
    description: "A grounded, cited response based on real documents",
  },
] as const;

/** Best practices cards for the summary step */
export const RAG_BEST_PRACTICES = [
  {
    title: "Use Quality Documents",
    description:
      "The quality of your RAG output is bounded by the quality of your indexed documents. Curate, clean, and keep your knowledge base current.",
  },
  {
    title: "Chunk Strategically",
    description:
      "Split documents into semantically meaningful chunks. Too large and you waste context; too small and you lose meaning.",
  },
  {
    title: "Evaluate Retrieval",
    description:
      "Measure retrieval precision and recall independently from generation quality. Poor retrieval cannot be compensated by a better LLM.",
  },
  {
    title: "Monitor & Iterate",
    description:
      "Track which queries fail, which chunks are retrieved, and where hallucinations occur. Use this feedback to improve your pipeline.",
  },
] as const;
