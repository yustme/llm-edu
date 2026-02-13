// -----------------------------------------------------------------------
// Mock data for Module 14: Tokenization & Vectorization
// -----------------------------------------------------------------------

// -- Types --------------------------------------------------------------

/** A single entry in the BPE vocabulary: subword string -> token ID */
export interface BpeVocabEntry {
  token: string;
  id: number;
}

/** A single merge stage in the BPE animation */
export interface BpeMergeStage {
  /** Current subword splits after this merge */
  tokens: string[];
  /** The merge rule applied to reach this stage (null for the initial split) */
  mergeRule: string | null;
  /** Human-readable description of the stage */
  label: string;
}

/** A preset text example for the tokenizer demo */
export interface PresetExample {
  id: string;
  label: string;
  text: string;
}

/** A word with 2D coordinates for the embedding scatter plot */
export interface EmbeddingPoint {
  word: string;
  x: number;
  y: number;
  cluster: EmbeddingCluster;
}

/** Cluster category for embedding scatter */
export type EmbeddingCluster = "food" | "royalty" | "tech" | "animals";

/** A word with its embedding vector dimensions for the heatmap */
export interface EmbeddingVector {
  word: string;
  dimensions: number[];
}

// -- BPE Vocabulary (simplified, ~200 common subwords) ------------------

export const BPE_VOCABULARY: BpeVocabEntry[] = [
  // Single characters (fallback)
  { token: " ", id: 220 },
  { token: "a", id: 64 },
  { token: "b", id: 65 },
  { token: "c", id: 66 },
  { token: "d", id: 67 },
  { token: "e", id: 68 },
  { token: "f", id: 69 },
  { token: "g", id: 70 },
  { token: "h", id: 71 },
  { token: "i", id: 72 },
  { token: "j", id: 73 },
  { token: "k", id: 74 },
  { token: "l", id: 75 },
  { token: "m", id: 76 },
  { token: "n", id: 77 },
  { token: "o", id: 78 },
  { token: "p", id: 79 },
  { token: "q", id: 80 },
  { token: "r", id: 81 },
  { token: "s", id: 82 },
  { token: "t", id: 83 },
  { token: "u", id: 84 },
  { token: "v", id: 85 },
  { token: "w", id: 86 },
  { token: "x", id: 87 },
  { token: "y", id: 88 },
  { token: "z", id: 89 },
  { token: "A", id: 32 },
  { token: "B", id: 33 },
  { token: "C", id: 34 },
  { token: "D", id: 35 },
  { token: "E", id: 36 },
  { token: "F", id: 37 },
  { token: "G", id: 38 },
  { token: "H", id: 39 },
  { token: "I", id: 40 },
  { token: "J", id: 41 },
  { token: "K", id: 42 },
  { token: "L", id: 43 },
  { token: "M", id: 44 },
  { token: "N", id: 45 },
  { token: "O", id: 46 },
  { token: "P", id: 47 },
  { token: "Q", id: 48 },
  { token: "R", id: 49 },
  { token: "S", id: 50 },
  { token: "T", id: 51 },
  { token: "U", id: 52 },
  { token: "V", id: 53 },
  { token: "W", id: 54 },
  { token: "X", id: 55 },
  { token: "Y", id: 56 },
  { token: "Z", id: 57 },
  { token: "0", id: 15 },
  { token: "1", id: 16 },
  { token: "2", id: 17 },
  { token: "3", id: 18 },
  { token: "4", id: 19 },
  { token: "5", id: 20 },
  { token: "6", id: 21 },
  { token: "7", id: 22 },
  { token: "8", id: 23 },
  { token: "9", id: 24 },
  { token: ".", id: 13 },
  { token: ",", id: 11 },
  { token: "!", id: 0 },
  { token: "?", id: 30 },
  { token: ":", id: 25 },
  { token: ";", id: 26 },
  { token: "(", id: 7 },
  { token: ")", id: 8 },
  { token: "{", id: 90 },
  { token: "}", id: 92 },
  { token: "[", id: 58 },
  { token: "]", id: 60 },
  { token: "'", id: 6 },
  { token: '"', id: 1 },
  { token: "-", id: 12 },
  { token: "_", id: 62 },
  { token: "/", id: 14 },
  { token: "=", id: 28 },
  { token: "+", id: 10 },
  { token: "\n", id: 198 },

  // Common 2-char subwords
  { token: "th", id: 400 },
  { token: "he", id: 401 },
  { token: "in", id: 402 },
  { token: "er", id: 403 },
  { token: "an", id: 404 },
  { token: "re", id: 405 },
  { token: "on", id: 406 },
  { token: "en", id: 407 },
  { token: "at", id: 408 },
  { token: "or", id: 409 },
  { token: "es", id: 410 },
  { token: "is", id: 411 },
  { token: "it", id: 412 },
  { token: "al", id: 413 },
  { token: "ar", id: 414 },
  { token: "st", id: 415 },
  { token: "to", id: 416 },
  { token: "nt", id: 417 },
  { token: "ng", id: 418 },
  { token: "se", id: 419 },
  { token: "ha", id: 420 },
  { token: "le", id: 421 },
  { token: "ou", id: 422 },
  { token: "io", id: 423 },
  { token: "de", id: 424 },
  { token: "ve", id: 425 },
  { token: "ed", id: 426 },
  { token: "te", id: 427 },
  { token: "ti", id: 428 },
  { token: "ne", id: 429 },
  { token: "as", id: 430 },
  { token: "ra", id: 431 },
  { token: "ri", id: 432 },
  { token: "li", id: 433 },
  { token: "co", id: 434 },
  { token: "ce", id: 435 },
  { token: "di", id: 436 },
  { token: "si", id: 437 },
  { token: "un", id: 438 },
  { token: "ma", id: 439 },
  { token: "el", id: 440 },
  { token: "lo", id: 441 },
  { token: "la", id: 442 },
  { token: "ch", id: 443 },
  { token: "ly", id: 444 },
  { token: "us", id: 445 },
  { token: "ow", id: 446 },
  { token: "me", id: 447 },
  { token: "no", id: 448 },
  { token: "do", id: 449 },

  // Common 3-char subwords
  { token: "the", id: 500 },
  { token: "ing", id: 501 },
  { token: "and", id: 502 },
  { token: "tion", id: 503 },
  { token: "ent", id: 504 },
  { token: "ion", id: 505 },
  { token: "ter", id: 506 },
  { token: "for", id: 507 },
  { token: "hat", id: 508 },
  { token: "tha", id: 509 },
  { token: "all", id: 510 },
  { token: "not", id: 511 },
  { token: "ess", id: 512 },
  { token: "con", id: 513 },
  { token: "are", id: 514 },
  { token: "pro", id: 515 },
  { token: "was", id: 516 },
  { token: "her", id: 517 },
  { token: "one", id: 518 },
  { token: "our", id: 519 },
  { token: "out", id: 520 },
  { token: "you", id: 521 },
  { token: "day", id: 522 },
  { token: "had", id: 523 },
  { token: "has", id: 524 },
  { token: "his", id: 525 },
  { token: "how", id: 526 },
  { token: "man", id: 527 },
  { token: "new", id: 528 },
  { token: "now", id: 529 },
  { token: "old", id: 530 },
  { token: "see", id: 531 },
  { token: "way", id: 532 },
  { token: "who", id: 533 },
  { token: "com", id: 534 },
  { token: "get", id: 535 },
  { token: "hap", id: 536 },
  { token: "app", id: 537 },
  { token: "ine", id: 538 },
  { token: "nes", id: 539 },
  { token: "pre", id: 540 },

  // Common 4+ char subwords
  { token: "that", id: 600 },
  { token: "with", id: 601 },
  { token: "have", id: 602 },
  { token: "this", id: 603 },
  { token: "will", id: 604 },
  { token: "your", id: 605 },
  { token: "from", id: 606 },
  { token: "they", id: 607 },
  { token: "been", id: 608 },
  { token: "call", id: 609 },
  { token: "each", id: 610 },
  { token: "make", id: 611 },
  { token: "like", id: 612 },
  { token: "long", id: 613 },
  { token: "look", id: 614 },
  { token: "many", id: 615 },
  { token: "some", id: 616 },
  { token: "time", id: 617 },
  { token: "very", id: 618 },
  { token: "when", id: 619 },
  { token: "word", id: 620 },
  { token: "work", id: 621 },
  { token: "data", id: 622 },
  { token: "model", id: 623 },
  { token: "token", id: 624 },
  { token: "text", id: 625 },
  { token: "Hello", id: 626 },
  { token: "world", id: 627 },
  { token: "function", id: 628 },
  { token: "return", id: 629 },
  { token: "const", id: 630 },
  { token: "import", id: 631 },
  { token: "export", id: 632 },
  { token: "class", id: 633 },
  { token: "happy", id: 634 },
  { token: "unhappy", id: 635 },
  { token: "ness", id: 636 },
  { token: "happ", id: 637 },

  // Czech subwords
  { token: "ov", id: 700 },
  { token: "sk", id: 701 },
  { token: "je", id: 702 },
  { token: "na", id: 703 },
  { token: "po", id: 704 },
  { token: "pr", id: 705 },
  { token: "za", id: 706 },
  { token: "od", id: 707 },
  { token: "vy", id: 708 },
  { token: "ro", id: 709 },
  { token: "ni", id: 710 },
  { token: "ky", id: 711 },
  { token: "mi", id: 712 },
  { token: "ci", id: 713 },
  { token: "ko", id: 714 },
  { token: "em", id: 715 },
];

// -- BPE Merge Stages (for "unhappiness" animation) --------------------

export const BPE_MERGE_STAGES: BpeMergeStage[] = [
  {
    tokens: ["u", "n", "h", "a", "p", "p", "i", "n", "e", "s", "s"],
    mergeRule: null,
    label: "Initial character-level split",
  },
  {
    tokens: ["u", "n", "h", "a", "p", "p", "in", "e", "s", "s"],
    mergeRule: "i + n -> in",
    label: "Merge frequent pair: i + n",
  },
  {
    tokens: ["un", "h", "a", "p", "p", "in", "e", "s", "s"],
    mergeRule: "u + n -> un",
    label: "Merge frequent pair: u + n",
  },
  {
    tokens: ["un", "ha", "p", "p", "in", "e", "s", "s"],
    mergeRule: "h + a -> ha",
    label: "Merge frequent pair: h + a",
  },
  {
    tokens: ["un", "ha", "p", "p", "in", "es", "s"],
    mergeRule: "e + s -> es",
    label: "Merge frequent pair: e + s",
  },
  {
    tokens: ["un", "ha", "pp", "in", "es", "s"],
    mergeRule: "p + p -> pp",
    label: "Merge frequent pair: p + p",
  },
  {
    tokens: ["un", "happ", "in", "ess"],
    mergeRule: "ha + pp -> happ, es + s -> ess",
    label: "Multi-merges: ha+pp and es+s",
  },
  {
    tokens: ["un", "happi", "ness"],
    mergeRule: "happ + in -> happi, ess -> ness",
    label: "Continue merging into larger subwords",
  },
  {
    tokens: ["unhappi", "ness"],
    mergeRule: "un + happi -> unhappi",
    label: "Final merge: prefix joins stem",
  },
];

// -- Preset Text Examples -----------------------------------------------

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: "english",
    label: "English",
    text: "The quick brown fox jumps over the lazy dog.",
  },
  {
    id: "czech",
    label: "Czech",
    text: "Jak se vam dari? Dnes je krasny den.",
  },
  {
    id: "code",
    label: "Code",
    text: 'const data = await fetch("/api/tokens");',
  },
  {
    id: "emoji",
    label: "Emoji",
    text: "Hello world! I love AI and NLP. 2024 is great!",
  },
];

// -- Embedding Scatter Data (2D projections) ----------------------------

export const EMBEDDING_SCATTER_DATA: EmbeddingPoint[] = [
  // Food cluster
  { word: "apple", x: 120, y: 280, cluster: "food" },
  { word: "banana", x: 145, y: 310, cluster: "food" },
  { word: "orange", x: 105, y: 330, cluster: "food" },
  { word: "grape", x: 160, y: 295, cluster: "food" },
  { word: "mango", x: 130, y: 345, cluster: "food" },

  // Royalty cluster
  { word: "king", x: 350, y: 80, cluster: "royalty" },
  { word: "queen", x: 380, y: 110, cluster: "royalty" },
  { word: "prince", x: 330, y: 125, cluster: "royalty" },
  { word: "princess", x: 365, y: 145, cluster: "royalty" },
  { word: "throne", x: 395, y: 90, cluster: "royalty" },

  // Tech cluster
  { word: "computer", x: 340, y: 320, cluster: "tech" },
  { word: "software", x: 370, y: 340, cluster: "tech" },
  { word: "algorithm", x: 310, y: 355, cluster: "tech" },
  { word: "database", x: 355, y: 370, cluster: "tech" },
  { word: "network", x: 385, y: 310, cluster: "tech" },

  // Animals cluster
  { word: "cat", x: 130, y: 90, cluster: "animals" },
  { word: "dog", x: 155, y: 70, cluster: "animals" },
  { word: "bird", x: 110, y: 110, cluster: "animals" },
  { word: "fish", x: 170, y: 95, cluster: "animals" },
  { word: "horse", x: 140, y: 130, cluster: "animals" },
];

// -- Cluster display configuration --------------------------------------

export const CLUSTER_COLORS: Record<EmbeddingCluster, string> = {
  food: "#22c55e",
  royalty: "#a855f7",
  tech: "#3b82f6",
  animals: "#f97316",
};

export const CLUSTER_LABELS: Record<EmbeddingCluster, string> = {
  food: "Food",
  royalty: "Royalty",
  tech: "Technology",
  animals: "Animals",
};

// -- Embedding Heatmap Data (mock high-dimensional vectors) -------------

/** Number of embedding dimensions to display in the heatmap */
export const HEATMAP_DIMENSION_COUNT = 20;

export const EMBEDDING_VECTORS: EmbeddingVector[] = [
  {
    word: "king",
    dimensions: [0.8, -0.2, 0.5, 0.9, -0.1, 0.3, -0.6, 0.7, 0.1, -0.4, 0.6, 0.2, -0.3, 0.8, -0.5, 0.4, 0.1, -0.7, 0.3, 0.9],
  },
  {
    word: "queen",
    dimensions: [0.7, -0.3, 0.6, 0.8, 0.2, 0.4, -0.5, 0.6, 0.0, -0.3, 0.7, 0.3, -0.2, 0.7, -0.4, 0.5, 0.2, -0.6, 0.4, 0.8],
  },
  {
    word: "apple",
    dimensions: [-0.3, 0.7, -0.1, 0.2, 0.8, -0.6, 0.4, -0.2, 0.5, 0.9, -0.1, -0.5, 0.6, -0.3, 0.7, -0.4, 0.8, 0.1, -0.2, 0.3],
  },
  {
    word: "banana",
    dimensions: [-0.2, 0.8, -0.2, 0.1, 0.7, -0.5, 0.5, -0.3, 0.6, 0.8, -0.2, -0.4, 0.5, -0.4, 0.6, -0.3, 0.7, 0.2, -0.1, 0.4],
  },
];

// -- Token Palette (pastel colors for token chips) ----------------------

export const TOKEN_PALETTE = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-red-100 text-red-800 border-red-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-lime-100 text-lime-800 border-lime-200",
  "bg-amber-100 text-amber-800 border-amber-200",
] as const;
