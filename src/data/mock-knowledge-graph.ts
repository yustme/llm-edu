// ----------------------------------------------------------------
// Mock data for Module 22 - Knowledge Graphs
// ----------------------------------------------------------------

/** Node type determines color coding in the graph visualization */
export type KGNodeType = "person" | "place" | "concept" | "organization";

/** A node (entity) in the knowledge graph */
export interface KGNode {
  id: string;
  label: string;
  type: KGNodeType;
  description: string;
  x: number;
  y: number;
}

/** A directed edge (relationship) between two nodes */
export interface KGEdge {
  source: string;
  target: string;
  label: string;
}

/** A triple (subject-predicate-object) extracted from text */
export interface KGTriple {
  subject: string;
  predicate: string;
  object: string;
}

/** An entity span found during NER extraction */
export interface EntitySpan {
  text: string;
  type: KGNodeType;
  startIndex: number;
  endIndex: number;
}

/** A query example with traversal path and answer */
export interface QueryExample {
  question: string;
  type: "single-hop" | "multi-hop" | "path-finding";
  path: string[];
  edgeLabels: string[];
  answer: string;
}

// ----------------------------------------------------------------
// Main knowledge graph: scientists, places, concepts, organizations
// ----------------------------------------------------------------

export const KG_NODES: KGNode[] = [
  { id: "einstein", label: "Albert Einstein", type: "person", description: "Theoretical physicist (1879-1955)", x: 120, y: 80 },
  { id: "curie", label: "Marie Curie", type: "person", description: "Physicist and chemist (1867-1934)", x: 480, y: 80 },
  { id: "turing", label: "Alan Turing", type: "person", description: "Mathematician and computer scientist (1912-1954)", x: 300, y: 200 },
  { id: "ulm", label: "Ulm", type: "place", description: "City in Baden-Wuerttemberg, Germany", x: 40, y: 210 },
  { id: "warsaw", label: "Warsaw", type: "place", description: "Capital city of Poland", x: 560, y: 210 },
  { id: "london", label: "London", type: "place", description: "Capital city of the United Kingdom", x: 300, y: 340 },
  { id: "relativity", label: "Relativity", type: "concept", description: "Theory of space, time, and gravity", x: 140, y: 340 },
  { id: "radioactivity", label: "Radioactivity", type: "concept", description: "Spontaneous emission of radiation from atomic nuclei", x: 460, y: 340 },
  { id: "computing", label: "Computing", type: "concept", description: "Theory and practice of computation", x: 300, y: 60 },
  { id: "princeton", label: "Princeton", type: "organization", description: "Princeton University, New Jersey, USA", x: 50, y: 140 },
  { id: "sorbonne", label: "Sorbonne", type: "organization", description: "University of Paris, France", x: 550, y: 140 },
  { id: "cambridge", label: "Cambridge", type: "organization", description: "University of Cambridge, United Kingdom", x: 180, y: 200 },
  { id: "physics", label: "Physics", type: "concept", description: "Natural science studying matter and energy", x: 420, y: 200 },
  { id: "nobel_prize", label: "Nobel Prize", type: "concept", description: "International awards for outstanding contributions", x: 300, y: 130 },
  { id: "germany", label: "Germany", type: "place", description: "Country in Central Europe", x: 40, y: 290 },
];

export const KG_EDGES: KGEdge[] = [
  { source: "einstein", target: "ulm", label: "born_in" },
  { source: "einstein", target: "relativity", label: "developed" },
  { source: "einstein", target: "princeton", label: "worked_at" },
  { source: "einstein", target: "nobel_prize", label: "received" },
  { source: "einstein", target: "physics", label: "field_of" },
  { source: "curie", target: "warsaw", label: "born_in" },
  { source: "curie", target: "radioactivity", label: "discovered" },
  { source: "curie", target: "sorbonne", label: "worked_at" },
  { source: "curie", target: "nobel_prize", label: "received" },
  { source: "curie", target: "physics", label: "field_of" },
  { source: "turing", target: "london", label: "born_in" },
  { source: "turing", target: "computing", label: "founded" },
  { source: "turing", target: "cambridge", label: "studied_at" },
  { source: "relativity", target: "physics", label: "branch_of" },
  { source: "radioactivity", target: "physics", label: "branch_of" },
  { source: "computing", target: "cambridge", label: "researched_at" },
  { source: "ulm", target: "germany", label: "located_in" },
  { source: "cambridge", target: "london", label: "located_in" },
];

// ----------------------------------------------------------------
// NER extraction demo data
// ----------------------------------------------------------------

export const NER_EXAMPLE_TEXT =
  "Albert Einstein was born in Ulm, Germany in 1879. He developed the theory of Relativity while working at Princeton University. Marie Curie, born in Warsaw, discovered Radioactivity and worked at the Sorbonne. Both scientists received the Nobel Prize in Physics.";

export const NER_ENTITY_SPANS: EntitySpan[] = [
  { text: "Albert Einstein", type: "person", startIndex: 0, endIndex: 15 },
  { text: "Ulm", type: "place", startIndex: 29, endIndex: 32 },
  { text: "Germany", type: "place", startIndex: 34, endIndex: 41 },
  { text: "Relativity", type: "concept", startIndex: 82, endIndex: 92 },
  { text: "Princeton University", type: "organization", startIndex: 110, endIndex: 130 },
  { text: "Marie Curie", type: "person", startIndex: 132, endIndex: 143 },
  { text: "Warsaw", type: "place", startIndex: 153, endIndex: 159 },
  { text: "Radioactivity", type: "concept", startIndex: 172, endIndex: 185 },
  { text: "Sorbonne", type: "organization", startIndex: 204, endIndex: 212 },
  { text: "Nobel Prize", type: "concept", startIndex: 240, endIndex: 251 },
  { text: "Physics", type: "concept", startIndex: 255, endIndex: 262 },
];

export const NER_EXTRACTED_TRIPLES: KGTriple[] = [
  { subject: "Albert Einstein", predicate: "born_in", object: "Ulm" },
  { subject: "Ulm", predicate: "located_in", object: "Germany" },
  { subject: "Albert Einstein", predicate: "developed", object: "Relativity" },
  { subject: "Albert Einstein", predicate: "worked_at", object: "Princeton University" },
  { subject: "Marie Curie", predicate: "born_in", object: "Warsaw" },
  { subject: "Marie Curie", predicate: "discovered", object: "Radioactivity" },
  { subject: "Marie Curie", predicate: "worked_at", object: "Sorbonne" },
  { subject: "Albert Einstein", predicate: "received", object: "Nobel Prize" },
  { subject: "Marie Curie", predicate: "received", object: "Nobel Prize" },
];

// ----------------------------------------------------------------
// Query traversal examples
// ----------------------------------------------------------------

export const QUERY_EXAMPLES: QueryExample[] = [
  {
    question: "Where was Einstein born?",
    type: "single-hop",
    path: ["einstein", "ulm"],
    edgeLabels: ["born_in"],
    answer: "Albert Einstein was born in Ulm.",
  },
  {
    question: "What did the person born in Ulm develop?",
    type: "multi-hop",
    path: ["ulm", "einstein", "relativity"],
    edgeLabels: ["born_in", "developed"],
    answer: "The person born in Ulm (Albert Einstein) developed Relativity.",
  },
  {
    question: "How are Einstein and Curie connected?",
    type: "path-finding",
    path: ["einstein", "nobel_prize", "curie"],
    edgeLabels: ["received", "received"],
    answer: "Einstein and Curie are connected through the Nobel Prize -- both received it.",
  },
];

// ----------------------------------------------------------------
// Color mapping for node types
// ----------------------------------------------------------------

export const NODE_TYPE_COLORS: Record<KGNodeType, { fill: string; stroke: string; text: string; bg: string; label: string }> = {
  person: { fill: "#3b82f6", stroke: "#2563eb", text: "text-blue-500", bg: "bg-blue-100", label: "Person" },
  place: { fill: "#22c55e", stroke: "#16a34a", text: "text-green-500", bg: "bg-green-100", label: "Place" },
  concept: { fill: "#a855f7", stroke: "#9333ea", text: "text-purple-500", bg: "bg-purple-100", label: "Concept" },
  organization: { fill: "#f59e0b", stroke: "#d97706", text: "text-amber-500", bg: "bg-amber-100", label: "Organization" },
};

// ----------------------------------------------------------------
// LLM + KG comparison data
// ----------------------------------------------------------------

export const LLM_WITHOUT_KG = {
  question: "Where did the person who developed Relativity study?",
  response:
    "The person who developed Relativity was Albert Einstein. He studied at the ETH Zurich, also known as the Swiss Federal Institute of Technology.",
  issues: [
    "No structured verification of the claim",
    "Answer may be outdated or partially hallucinated",
    "No explicit reasoning chain visible",
    "Cannot trace the source of the information",
  ],
};

export const LLM_WITH_KG = {
  question: "Where did the person who developed Relativity study?",
  response:
    "Following the knowledge graph: Relativity <-- developed -- Einstein --> worked_at --> Princeton. Einstein is linked to Princeton in the graph, though no 'studied_at' relationship exists for Einstein in our knowledge base.",
  advantages: [
    "Structured path through verified facts",
    "Explicit when information is missing",
    "Every claim is traceable to graph edges",
    "Reduces hallucination with grounded data",
  ],
};

// ----------------------------------------------------------------
// Summary comparison data: KG vs Vector DB vs Hybrid
// ----------------------------------------------------------------

export interface ApproachComparison {
  approach: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
}

export const APPROACH_COMPARISONS: ApproachComparison[] = [
  {
    approach: "Knowledge Graph",
    strengths: [
      "Explicit relationships between entities",
      "Multi-hop reasoning with traversal",
      "Structured, verifiable facts",
      "Supports complex queries (SPARQL, Cypher)",
    ],
    weaknesses: [
      "Requires upfront schema design",
      "Expensive to build and maintain",
      "Struggles with unstructured text",
    ],
    bestFor: "Fact verification, entity relationships, reasoning chains",
  },
  {
    approach: "Vector Database",
    strengths: [
      "Easy to set up with embeddings",
      "Handles unstructured text well",
      "Semantic similarity search",
      "Scales to large document collections",
    ],
    weaknesses: [
      "No explicit relationships",
      "Cannot do multi-hop reasoning",
      "Relevance is probabilistic, not exact",
    ],
    bestFor: "Document retrieval, semantic search, RAG pipelines",
  },
  {
    approach: "Hybrid (KG + Vector)",
    strengths: [
      "Combines structured and unstructured data",
      "Uses KG for reasoning, vectors for retrieval",
      "Best accuracy for complex questions",
      "Flexible query strategies",
    ],
    weaknesses: [
      "Most complex to implement",
      "Higher infrastructure cost",
      "Requires expertise in both systems",
    ],
    bestFor: "Enterprise search, complex Q&A, knowledge-intensive tasks",
  },
];

export const KG_TOOLS = [
  { name: "Neo4j", description: "Leading graph database with Cypher query language" },
  { name: "Amazon Neptune", description: "Managed graph database service (AWS)" },
  { name: "LangChain GraphQA", description: "LLM integration for graph-based Q&A" },
  { name: "LlamaIndex KG Index", description: "Knowledge graph index for RAG" },
  { name: "spaCy + Rebel", description: "NER and relation extraction pipeline" },
  { name: "Microsoft GraphRAG", description: "Graph-based RAG with community detection" },
];
