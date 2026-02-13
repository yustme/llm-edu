import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";

// ---------------------------------------------------------------------------
// Timing constants for simulation step delays (in milliseconds)
// ---------------------------------------------------------------------------

const DELAY = {
  userInput: 300,
  thinking: SIMULATION.thinkingDelayMs,
  reasoning: SIMULATION.defaultStepDelayMs,
  toolCall: SIMULATION.toolCallResultDelayMs,
  toolResult: 500,
  finalResponse: 400,
} as const;

// ---------------------------------------------------------------------------
// Graph node and edge types
// ---------------------------------------------------------------------------

export interface GraphNode {
  id: string;
  label: string;
  type: "person" | "organization" | "concept" | "location";
  community: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface CommunitySummary {
  id: number;
  label: string;
  color: string;
  summary: string;
}

// ---------------------------------------------------------------------------
// Community colors used for graph visualization
// ---------------------------------------------------------------------------

export const COMMUNITY_COLORS: Record<number, string> = {
  0: "#3b82f6", // blue
  1: "#10b981", // green
  2: "#f59e0b", // amber
  3: "#8b5cf6", // violet
} as const;

// ---------------------------------------------------------------------------
// Graph nodes (pre-positioned for SVG viewBox 0 0 700 350)
// ---------------------------------------------------------------------------

export const GRAPH_NODES: GraphNode[] = [
  // Community 0: Leadership & Strategy (blue)
  { id: "n1", label: "Sarah Chen", type: "person", community: 0, x: 120, y: 80 },
  { id: "n2", label: "Acme Corp", type: "organization", community: 0, x: 60, y: 170 },
  { id: "n3", label: "AI Strategy", type: "concept", community: 0, x: 190, y: 170 },
  { id: "n4", label: "Board of Directors", type: "organization", community: 0, x: 120, y: 260 },

  // Community 1: Engineering & Products (green)
  { id: "n5", label: "James Park", type: "person", community: 1, x: 350, y: 60 },
  { id: "n6", label: "ML Platform", type: "concept", community: 1, x: 420, y: 150 },
  { id: "n7", label: "DataFlow Engine", type: "concept", community: 1, x: 310, y: 160 },
  { id: "n8", label: "San Francisco", type: "location", community: 1, x: 350, y: 250 },

  // Community 2: Research & Innovation (amber)
  { id: "n9", label: "Dr. Maria Lopez", type: "person", community: 2, x: 560, y: 70 },
  { id: "n10", label: "NLP Research", type: "concept", community: 2, x: 630, y: 160 },
  { id: "n11", label: "MIT Lab", type: "organization", community: 2, x: 540, y: 170 },
  { id: "n12", label: "Graph Networks", type: "concept", community: 2, x: 590, y: 260 },

  // Community 3: Operations (violet)
  { id: "n13", label: "Tokyo Office", type: "location", community: 3, x: 200, y: 310 },
  { id: "n14", label: "APAC Division", type: "organization", community: 3, x: 370, y: 320 },
];

// ---------------------------------------------------------------------------
// Graph edges (relationships between nodes)
// ---------------------------------------------------------------------------

export const GRAPH_EDGES: GraphEdge[] = [
  // Community 0 internal
  { source: "n1", target: "n2", label: "CEO of" },
  { source: "n1", target: "n3", label: "leads" },
  { source: "n2", target: "n4", label: "governed by" },
  { source: "n3", target: "n4", label: "approved by" },

  // Community 1 internal
  { source: "n5", target: "n6", label: "architected" },
  { source: "n5", target: "n7", label: "built" },
  { source: "n6", target: "n7", label: "powers" },
  { source: "n5", target: "n8", label: "based in" },

  // Community 2 internal
  { source: "n9", target: "n10", label: "leads" },
  { source: "n9", target: "n11", label: "affiliated with" },
  { source: "n10", target: "n12", label: "includes" },
  { source: "n11", target: "n12", label: "researches" },

  // Community 3 internal
  { source: "n13", target: "n14", label: "headquarters of" },

  // Cross-community edges
  { source: "n1", target: "n5", label: "hired" },
  { source: "n3", target: "n6", label: "requires" },
  { source: "n6", target: "n10", label: "uses research from" },
  { source: "n2", target: "n14", label: "operates" },
  { source: "n9", target: "n3", label: "advises on" },
];

// ---------------------------------------------------------------------------
// Community summaries
// ---------------------------------------------------------------------------

export const COMMUNITY_SUMMARIES: CommunitySummary[] = [
  {
    id: 0,
    label: "Leadership & Strategy",
    color: COMMUNITY_COLORS[0],
    summary:
      "Sarah Chen leads Acme Corp as CEO, driving the AI Strategy initiative that is governed and approved by the Board of Directors. This community represents the executive decision-making layer of the organization.",
  },
  {
    id: 1,
    label: "Engineering & Products",
    color: COMMUNITY_COLORS[1],
    summary:
      "James Park, based in San Francisco, architected the ML Platform and built the DataFlow Engine. The ML Platform powers the DataFlow Engine, forming the core technical infrastructure.",
  },
  {
    id: 2,
    label: "Research & Innovation",
    color: COMMUNITY_COLORS[2],
    summary:
      "Dr. Maria Lopez leads NLP Research and is affiliated with MIT Lab. The research includes Graph Networks, which MIT Lab also actively researches. This community drives innovation.",
  },
  {
    id: 3,
    label: "Operations",
    color: COMMUNITY_COLORS[3],
    summary:
      "The Tokyo Office serves as the headquarters of the APAC Division, representing the organization's operational footprint in the Asia-Pacific region.",
  },
];

// ---------------------------------------------------------------------------
// Example text for knowledge graph construction pipeline
// ---------------------------------------------------------------------------

export const EXAMPLE_TEXT =
  "Sarah Chen, CEO of Acme Corp, announced a new AI Strategy initiative. She hired James Park to architect the ML Platform in San Francisco. Dr. Maria Lopez from MIT Lab advises the team on NLP Research and Graph Networks.";

export interface ExtractedEntity {
  text: string;
  type: GraphNode["type"];
  startIndex: number;
  endIndex: number;
}

export const EXTRACTED_ENTITIES: ExtractedEntity[] = [
  { text: "Sarah Chen", type: "person", startIndex: 0, endIndex: 10 },
  { text: "Acme Corp", type: "organization", startIndex: 19, endIndex: 28 },
  { text: "AI Strategy", type: "concept", startIndex: 45, endIndex: 56 },
  { text: "James Park", type: "person", startIndex: 81, endIndex: 91 },
  { text: "ML Platform", type: "concept", startIndex: 109, endIndex: 120 },
  { text: "San Francisco", type: "location", startIndex: 124, endIndex: 137 },
  { text: "Dr. Maria Lopez", type: "person", startIndex: 139, endIndex: 154 },
  { text: "MIT Lab", type: "organization", startIndex: 160, endIndex: 167 },
  { text: "NLP Research", type: "concept", startIndex: 189, endIndex: 201 },
  { text: "Graph Networks", type: "concept", startIndex: 206, endIndex: 220 },
];

export interface ExtractedRelationship {
  source: string;
  target: string;
  label: string;
}

export const EXTRACTED_RELATIONSHIPS: ExtractedRelationship[] = [
  { source: "Sarah Chen", target: "Acme Corp", label: "CEO of" },
  { source: "Sarah Chen", target: "AI Strategy", label: "announced" },
  { source: "Sarah Chen", target: "James Park", label: "hired" },
  { source: "James Park", target: "ML Platform", label: "architected" },
  { source: "James Park", target: "San Francisco", label: "based in" },
  { source: "Dr. Maria Lopez", target: "MIT Lab", label: "affiliated with" },
  { source: "Dr. Maria Lopez", target: "NLP Research", label: "advises on" },
  { source: "Dr. Maria Lopez", target: "Graph Networks", label: "advises on" },
];

// ---------------------------------------------------------------------------
// Entity type colors for the pipeline visualization
// ---------------------------------------------------------------------------

export const ENTITY_TYPE_COLORS: Record<GraphNode["type"], string> = {
  person: "bg-blue-200 text-blue-800",
  organization: "bg-green-200 text-green-800",
  concept: "bg-amber-200 text-amber-800",
  location: "bg-violet-200 text-violet-800",
} as const;

export const ENTITY_TYPE_BORDER_COLORS: Record<GraphNode["type"], string> = {
  person: "#3b82f6",
  organization: "#10b981",
  concept: "#f59e0b",
  location: "#8b5cf6",
} as const;

// ---------------------------------------------------------------------------
// Query flow demo: LOCAL SEARCH simulation
// ---------------------------------------------------------------------------

export const GRAPH_RAG_QUERY = "What is the connection between Sarah Chen and the ML Platform?" as const;

export const LOCAL_SEARCH_STEPS: SimulationStep[] = [
  {
    id: "local-1",
    type: "user-input",
    actor: "user",
    content: GRAPH_RAG_QUERY,
    delayMs: DELAY.userInput,
  },
  {
    id: "local-2",
    type: "reasoning",
    actor: "agent",
    content: "This is a specific entity query about connections. I will use LOCAL SEARCH to find the subgraph around 'Sarah Chen' and 'ML Platform'.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "local-3",
    type: "tool-call",
    actor: "agent",
    content: "graph_search",
    metadata: {
      toolName: "graph_search",
      input: {
        mode: "local",
        seed_entities: ["Sarah Chen", "ML Platform"],
        max_hops: 2,
      },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "local-4",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify(
      {
        subgraph: {
          nodes: ["Sarah Chen", "James Park", "ML Platform", "AI Strategy", "Acme Corp"],
          edges: [
            "Sarah Chen --hired--> James Park",
            "James Park --architected--> ML Platform",
            "Sarah Chen --leads--> AI Strategy",
            "AI Strategy --requires--> ML Platform",
            "Sarah Chen --CEO of--> Acme Corp",
          ],
        },
        paths: [
          "Sarah Chen -> hired -> James Park -> architected -> ML Platform",
          "Sarah Chen -> leads -> AI Strategy -> requires -> ML Platform",
        ],
      },
      null,
      2,
    ),
    metadata: {
      toolName: "graph_search",
      output: {
        nodes_found: 5,
        edges_found: 5,
        paths: 2,
      },
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "local-5",
    type: "reasoning",
    actor: "agent",
    content: "Found 2 connection paths between Sarah Chen and ML Platform. Let me also retrieve the community summary for additional context.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "local-6",
    type: "tool-call",
    actor: "agent",
    content: "get_community_summary",
    metadata: {
      toolName: "get_community_summary",
      input: {
        community_ids: [0, 1],
      },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "local-7",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify(
      {
        communities: [
          { id: 0, label: "Leadership & Strategy", summary: "Sarah Chen leads Acme Corp as CEO, driving the AI Strategy initiative." },
          { id: 1, label: "Engineering & Products", summary: "James Park architected the ML Platform and built the DataFlow Engine in San Francisco." },
        ],
      },
      null,
      2,
    ),
    metadata: {
      toolName: "get_community_summary",
      output: {
        communities_retrieved: 2,
      },
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "local-8",
    type: "final-response",
    actor: "assistant",
    content:
      "Sarah Chen is connected to the ML Platform through two paths:\n\n1. **Direct hiring**: Sarah Chen hired James Park, who then architected the ML Platform. This is the primary operational connection.\n\n2. **Strategic alignment**: Sarah Chen leads the AI Strategy initiative, which requires the ML Platform as a core technical component.\n\nAs CEO of Acme Corp, Sarah Chen both drives the strategic vision that necessitates the ML Platform and brought in the key engineer (James Park) to build it. The platform is central to the company's AI Strategy that she champions.",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// Query flow demo: GLOBAL SEARCH simulation
// ---------------------------------------------------------------------------

export const GLOBAL_SEARCH_QUERY = "What are the main themes across the entire organization?" as const;

export const GLOBAL_SEARCH_STEPS: SimulationStep[] = [
  {
    id: "global-1",
    type: "user-input",
    actor: "user",
    content: GLOBAL_SEARCH_QUERY,
    delayMs: DELAY.userInput,
  },
  {
    id: "global-2",
    type: "reasoning",
    actor: "agent",
    content: "This is a broad, thematic query about the whole organization. I will use GLOBAL SEARCH to retrieve all community summaries and synthesize a high-level answer.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "global-3",
    type: "tool-call",
    actor: "agent",
    content: "graph_search",
    metadata: {
      toolName: "graph_search",
      input: {
        mode: "global",
        include_all_communities: true,
      },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "global-4",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify(
      {
        community_summaries: [
          { id: 0, label: "Leadership & Strategy", summary: "Executive decision-making layer led by CEO Sarah Chen." },
          { id: 1, label: "Engineering & Products", summary: "Core technical infrastructure: ML Platform and DataFlow Engine." },
          { id: 2, label: "Research & Innovation", summary: "NLP Research and Graph Networks led by Dr. Maria Lopez at MIT Lab." },
          { id: 3, label: "Operations", summary: "APAC Division headquartered in Tokyo Office." },
        ],
        cross_community_connections: 5,
      },
      null,
      2,
    ),
    metadata: {
      toolName: "graph_search",
      output: {
        communities_retrieved: 4,
        cross_community_edges: 5,
      },
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "global-5",
    type: "reasoning",
    actor: "agent",
    content: "All 4 community summaries retrieved. I can now synthesize the main organizational themes from the community-level view.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "global-6",
    type: "final-response",
    actor: "assistant",
    content:
      "The organization operates around four main themes:\n\n1. **Strategic AI Leadership**: CEO Sarah Chen drives AI Strategy at Acme Corp, with Board approval. Leadership actively shapes the technical direction.\n\n2. **Technical Infrastructure**: The engineering team, led by James Park in San Francisco, built the ML Platform and DataFlow Engine that form the backbone of AI capabilities.\n\n3. **Research-Driven Innovation**: Dr. Maria Lopez and MIT Lab conduct NLP Research and Graph Networks research, feeding cutting-edge advances into the AI Strategy.\n\n4. **Global Operations**: The APAC Division in Tokyo extends the organization's operational reach internationally.\n\nThese themes are deeply interconnected: research informs strategy, strategy drives engineering priorities, and operations distribute the results globally.",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// Comparison table: Vector RAG vs Graph RAG vs Hybrid
// ---------------------------------------------------------------------------

export interface ApproachComparisonRow {
  dimension: string;
  vectorRag: string;
  graphRag: string;
  hybrid: string;
}

export const APPROACH_COMPARISON: ApproachComparisonRow[] = [
  {
    dimension: "Best For",
    vectorRag: "Factual lookups, specific questions",
    graphRag: "Multi-hop reasoning, relationship queries",
    hybrid: "Complex queries needing both context and connections",
  },
  {
    dimension: "Query Example",
    vectorRag: '"What is the refund policy?"',
    graphRag: '"How are departments connected?"',
    hybrid: '"Which teams collaborate on AI projects and what are their policies?"',
  },
  {
    dimension: "Data Structure",
    vectorRag: "Flat document chunks with embeddings",
    graphRag: "Entities and relationships in a knowledge graph",
    hybrid: "Both vector index and knowledge graph",
  },
  {
    dimension: "Search Method",
    vectorRag: "Cosine similarity on embedding vectors",
    graphRag: "Graph traversal, community detection",
    hybrid: "Vector search + graph traversal combined",
  },
  {
    dimension: "Global Understanding",
    vectorRag: "Limited - retrieves individual chunks",
    graphRag: "Strong - community summaries provide holistic view",
    hybrid: "Strong - leverages community summaries + chunk detail",
  },
  {
    dimension: "Setup Complexity",
    vectorRag: "Low - embed and index documents",
    graphRag: "High - entity extraction, relationship mapping, community detection",
    hybrid: "Highest - requires both pipelines",
  },
  {
    dimension: "Latency",
    vectorRag: "Fast - single vector search",
    graphRag: "Medium - graph traversal + summarization",
    hybrid: "Higher - both search paths + merging",
  },
];

// ---------------------------------------------------------------------------
// Architecture diagram data for summary step
// ---------------------------------------------------------------------------

export interface ArchitectureStage {
  id: string;
  label: string;
  description: string;
}

export const GRAPH_RAG_ARCHITECTURE: ArchitectureStage[] = [
  { id: "docs", label: "Documents", description: "Raw text documents are ingested" },
  { id: "extract", label: "Entity Extraction", description: "NLP extracts entities and relationships" },
  { id: "graph", label: "Knowledge Graph", description: "Entities become nodes, relationships become edges" },
  { id: "communities", label: "Community Detection", description: "Nodes clustered into semantic communities" },
  { id: "vectors", label: "Vector Index", description: "Chunks also embedded for similarity search" },
  { id: "router", label: "Query Router", description: "Routes to local search, global search, or hybrid" },
  { id: "answer", label: "Answer", description: "Synthesized from subgraph + community summaries" },
];
