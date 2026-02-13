// ----------------------------------------------------------------
// Mock data for Module 19 - Chunking Strategies
// ----------------------------------------------------------------

/** Sample text used for chunking demonstrations */
export const SAMPLE_TEXT = `Artificial intelligence has transformed how organizations process and analyze data. Machine learning models can now handle tasks that previously required extensive human expertise, from natural language understanding to complex pattern recognition across massive datasets.

One of the most significant developments in recent years is the emergence of large language models (LLMs). These models are trained on vast corpora of text and can generate human-like responses, translate languages, summarize documents, and even write code. However, LLMs have a fundamental limitation: they can only process a fixed amount of text at a time, known as the context window.

Retrieval-Augmented Generation (RAG) addresses this limitation by combining LLMs with external knowledge retrieval. Instead of relying solely on the model's training data, RAG systems first search a knowledge base for relevant information, then provide that context to the LLM along with the user's question. This approach produces more accurate, up-to-date, and verifiable answers.

The quality of a RAG system depends heavily on how documents are split into smaller pieces called chunks. If chunks are too large, they may contain irrelevant information that dilutes the answer. If chunks are too small, they may lack sufficient context for the model to generate a coherent response. Finding the right chunking strategy is therefore critical for building effective RAG pipelines.`;

/** Shorter sample for the comparison view to keep the columns readable */
export const COMPARISON_SAMPLE_TEXT = `Artificial intelligence has transformed how organizations process data. Machine learning models handle tasks that previously required human expertise.

Large language models are trained on vast text corpora. They can generate responses, translate languages, and summarize documents. However, they have a fixed context window limitation.

RAG addresses this by combining LLMs with external knowledge retrieval. The system searches a knowledge base first, then provides context to the LLM. This produces more accurate and verifiable answers.`;

/** Strategy metadata for UI cards and labels */
export interface ChunkingStrategyInfo {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export const CHUNKING_STRATEGIES: ChunkingStrategyInfo[] = [
  {
    id: "fixed",
    name: "Fixed Size",
    description:
      "Split text every N characters regardless of content boundaries. The simplest approach.",
    pros: [
      "Simple to implement",
      "Predictable chunk sizes",
      "Works with any text format",
    ],
    cons: [
      "Breaks mid-sentence or mid-word",
      "No semantic awareness",
      "Context lost at boundaries",
    ],
    bestFor: "Uniform data, logs, or when exact chunk sizes are required",
  },
  {
    id: "sentence",
    name: "Sentence-Based",
    description:
      "Split text at sentence boundaries, keeping each sentence as a complete unit.",
    pros: [
      "Preserves sentence integrity",
      "Natural reading boundaries",
      "Better semantic coherence",
    ],
    cons: [
      "Variable chunk sizes",
      "Very long sentences cause large chunks",
      "Abbreviations can confuse splitting",
    ],
    bestFor: "Articles, documentation, well-structured prose",
  },
  {
    id: "paragraph",
    name: "Paragraph-Based",
    description:
      "Split text at paragraph boundaries (double newlines), preserving topical units.",
    pros: [
      "Preserves topical coherence",
      "Natural document structure",
      "Good context within chunks",
    ],
    cons: [
      "Highly variable chunk sizes",
      "Long paragraphs create oversized chunks",
      "Short paragraphs may lack context",
    ],
    bestFor: "Blog posts, reports, structured documents",
  },
  {
    id: "recursive",
    name: "Recursive",
    description:
      "Try paragraph splitting first, then sentence splitting for chunks that exceed the size limit. Multi-level approach.",
    pros: [
      "Balances size and semantic coherence",
      "Adapts to content structure",
      "Handles varied document formats",
    ],
    cons: [
      "More complex to implement",
      "Requires tuning size thresholds",
      "Behavior depends on separator hierarchy",
    ],
    bestFor: "General-purpose RAG, mixed-format documents",
  },
];

/** Decision matrix for the summary step */
export interface DecisionMatrixRow {
  documentType: string;
  recommendedStrategy: string;
  chunkSize: string;
  overlap: string;
  reason: string;
}

export const DECISION_MATRIX: DecisionMatrixRow[] = [
  {
    documentType: "Technical Documentation",
    recommendedStrategy: "Recursive",
    chunkSize: "300-500 chars",
    overlap: "10-15%",
    reason: "Preserves section hierarchy while keeping chunks manageable",
  },
  {
    documentType: "Legal Contracts",
    recommendedStrategy: "Paragraph",
    chunkSize: "400-600 chars",
    overlap: "15-20%",
    reason: "Each clause/paragraph is a self-contained unit",
  },
  {
    documentType: "Chat Logs / Transcripts",
    recommendedStrategy: "Sentence",
    chunkSize: "200-300 chars",
    overlap: "5-10%",
    reason: "Short turns; sentence boundaries match conversation flow",
  },
  {
    documentType: "Research Papers",
    recommendedStrategy: "Recursive",
    chunkSize: "400-600 chars",
    overlap: "10-15%",
    reason: "Sections vary widely; recursive adapts to structure",
  },
  {
    documentType: "Product Catalogs",
    recommendedStrategy: "Fixed Size",
    chunkSize: "150-250 chars",
    overlap: "0%",
    reason: "Entries are short and uniform; overlap adds noise",
  },
  {
    documentType: "News Articles",
    recommendedStrategy: "Paragraph",
    chunkSize: "300-500 chars",
    overlap: "10%",
    reason: "Inverted pyramid structure maps well to paragraphs",
  },
];

/** Best practices checklist for the summary step */
export const BEST_PRACTICES: string[] = [
  "Start with recursive chunking as a baseline",
  "Use overlap of 10-15% to preserve context at boundaries",
  "Keep chunk sizes between 200-600 characters for most use cases",
  "Test retrieval quality with different chunk sizes on real queries",
  "Match chunk size to your embedding model's optimal input length",
  "Consider metadata (source, section title) alongside chunk text",
  "Monitor retrieval precision and recall to tune your strategy",
];

/** Chunk color palette for visual differentiation */
export const CHUNK_COLORS = [
  { bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800", text: "text-blue-800 dark:text-blue-200" },
  { bg: "bg-green-50 dark:bg-green-950/40", border: "border-green-200 dark:border-green-800", text: "text-green-800 dark:text-green-200" },
  { bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800", text: "text-amber-800 dark:text-amber-200" },
  { bg: "bg-purple-50 dark:bg-purple-950/40", border: "border-purple-200 dark:border-purple-800", text: "text-purple-800 dark:text-purple-200" },
  { bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-800", text: "text-rose-800 dark:text-rose-200" },
  { bg: "bg-teal-50 dark:bg-teal-950/40", border: "border-teal-200 dark:border-teal-800", text: "text-teal-800 dark:text-teal-200" },
  { bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-200 dark:border-orange-800", text: "text-orange-800 dark:text-orange-200" },
  { bg: "bg-indigo-50 dark:bg-indigo-950/40", border: "border-indigo-200 dark:border-indigo-800", text: "text-indigo-800 dark:text-indigo-200" },
] as const;

/** Labels for the recursive split diagram levels */
export const RECURSIVE_LEVELS = [
  { label: "Full Document", description: "The complete input text before any splitting" },
  { label: "Sections", description: "Split by paragraph boundaries (double newlines)" },
  { label: "Sentences", description: "Paragraphs exceeding size limit are split into sentences" },
  { label: "Final Chunks", description: "All chunks are now within the target size range" },
] as const;
