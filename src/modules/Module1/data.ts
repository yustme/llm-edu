/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to Tokenization",
  "BPE Tokenizer",
  "From Tokens to Vectors",
  "Interactive Tokenizer Demo",
  "Embedding Space",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "Why machines need numbers, not text - the tokenization pipeline",
  "How Byte Pair Encoding iteratively merges characters into subwords",
  "Embedding lookup transforms token IDs into dense semantic vectors",
  "Try the tokenizer yourself with different texts and languages",
  "Visualize how similar words cluster together in vector space",
  "Comparison of tokenization approaches and key takeaways",
] as const;

/** Pipeline stage for the intro animation */
export interface PipelineStage {
  id: string;
  label: string;
  content: string;
  color: string;
}

/** Stages of the text-to-numbers pipeline */
export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "text",
    label: "Raw Text",
    content: '"Hello world"',
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    id: "tokenizer",
    label: "Tokenizer",
    content: "BPE / WordPiece",
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
  {
    id: "ids",
    label: "Token IDs",
    content: "[15496, 995]",
    color: "bg-green-100 border-green-300 text-green-700",
  },
  {
    id: "embeddings",
    label: "Embeddings",
    content: "[0.12, -0.34, ...]",
    color: "bg-amber-100 border-amber-300 text-amber-700",
  },
  {
    id: "model",
    label: "LLM",
    content: "Transformer",
    color: "bg-red-100 border-red-300 text-red-700",
  },
];

/** Tokenization approach for the comparison table */
export interface TokenizationApproach {
  id: string;
  name: string;
  example: string;
  vocabSize: string;
  pros: string[];
  cons: string[];
}

/** Comparison data for character vs word vs subword tokenization */
export const TOKENIZATION_APPROACHES: TokenizationApproach[] = [
  {
    id: "character",
    name: "Character-level",
    example: '"cat" -> ["c", "a", "t"]',
    vocabSize: "~256",
    pros: [
      "Tiny vocabulary",
      "Handles any text",
      "No unknown tokens",
    ],
    cons: [
      "Very long sequences",
      "Hard to learn meaning",
      "Slow processing",
    ],
  },
  {
    id: "word",
    name: "Word-level",
    example: '"the cat" -> ["the", "cat"]',
    vocabSize: "~100,000+",
    pros: [
      "Intuitive splits",
      "Short sequences",
      "Easy to understand",
    ],
    cons: [
      "Huge vocabulary",
      "Cannot handle unseen words",
      "Poor for morphology",
    ],
  },
  {
    id: "subword",
    name: "Subword (BPE)",
    example: '"unhappy" -> ["un", "happy"]',
    vocabSize: "~30,000-100,000",
    pros: [
      "Balanced vocab size",
      "Handles rare words",
      "Captures morphology",
    ],
    cons: [
      "Non-intuitive splits",
      "Language-dependent",
      "Requires training",
    ],
  },
];
