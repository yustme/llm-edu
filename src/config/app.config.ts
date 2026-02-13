import type { LucideIcon } from "lucide-react";
import { Binary, Layers, Brain, Braces, Bot, Wrench, Plug, GitBranch, Users, Compass, Scissors, BookOpen, Share2, Waypoints, Database, SearchCheck, ArrowRightLeft, Anchor, Shield, ClipboardCheck, UserCheck, RefreshCw, Zap, ScanEye, Palette } from "lucide-react";

export interface ModuleConfig {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  stepCount: number;
  path: string;
}

export const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "AI Agents Interactive Education";

export interface ModuleGroup {
  label: string;
  moduleIds: number[];
}

export const MODULE_GROUPS: ModuleGroup[] = [
  { label: "LLM Fundamentals", moduleIds: [1, 2, 3, 4] },
  { label: "Agents & Architecture", moduleIds: [5, 6, 7, 8, 9] },
  { label: "RAG & Retrieval", moduleIds: [10, 11, 12, 13, 14] },
  { label: "Data Applications", moduleIds: [15, 16, 17, 18] },
  { label: "Safety & Operations", moduleIds: [19, 20, 21, 22, 23, 24] },
  { label: "Multimodal & Generation", moduleIds: [25, 26] },
];

export const MODULES: ModuleConfig[] = [
  // -- LLM Fundamentals -------------------------------------------------------
  {
    id: 1,
    name: "Tokenization",
    description:
      "Understand how text is converted to tokens and vectors that language models can process.",
    icon: Binary,
    stepCount: 6,
    path: "/module/1",
  },
  {
    id: 2,
    name: "Context Window",
    description:
      "Understand context window limits, overflow strategies, and how to optimize token usage for production LLM applications.",
    icon: Layers,
    stepCount: 6,
    path: "/module/2",
  },
  {
    id: 3,
    name: "Reasoning",
    description:
      "Explore how chain-of-thought prompting, tree-of-thought, self-consistency, and reasoning models improve LLM accuracy on complex tasks.",
    icon: Brain,
    stepCount: 6,
    path: "/module/3",
  },
  {
    id: 4,
    name: "Structured Output",
    description:
      "Learn how to get reliable, schema-validated JSON from LLMs using JSON mode, function calling, and validation pipelines.",
    icon: Braces,
    stepCount: 6,
    path: "/module/4",
  },
  // -- Agents & Architecture ---------------------------------------------------
  {
    id: 5,
    name: "Agent vs LLM",
    description:
      "Understand the difference between a plain LLM and an AI agent with tools, reasoning, and memory.",
    icon: Bot,
    stepCount: 6,
    path: "/module/5",
  },
  {
    id: 6,
    name: "Tool Use",
    description:
      "Learn how LLMs use function calling to interact with external tools, APIs, and services.",
    icon: Wrench,
    stepCount: 6,
    path: "/module/6",
  },
  {
    id: 7,
    name: "MCP Server",
    description:
      "Explore the Model Context Protocol (MCP) and how agents connect to external tools and data.",
    icon: Plug,
    stepCount: 6,
    path: "/module/7",
  },
  {
    id: 8,
    name: "Agentic Workflows",
    description:
      "Explore orchestration patterns: sequential pipelines, parallel fan-out, routers, and evaluator-optimizer loops.",
    icon: GitBranch,
    stepCount: 6,
    path: "/module/8",
  },
  {
    id: 9,
    name: "Multi-Agent Communication",
    description:
      "See how multiple specialized agents collaborate to solve complex data tasks together.",
    icon: Users,
    stepCount: 6,
    path: "/module/9",
  },
  // -- RAG & Retrieval ---------------------------------------------------------
  {
    id: 10,
    name: "Cosine Similarity",
    description:
      "Learn how cosine similarity measures the angle between vectors to find semantically similar text.",
    icon: Compass,
    stepCount: 6,
    path: "/module/10",
  },
  {
    id: 11,
    name: "Chunking Strategies",
    description:
      "Explore how documents are split into chunks for RAG pipelines, comparing fixed, sentence, paragraph, and recursive strategies.",
    icon: Scissors,
    stepCount: 6,
    path: "/module/11",
  },
  {
    id: 12,
    name: "RAG",
    description:
      "Discover how Retrieval-Augmented Generation grounds LLM answers in real documents and knowledge bases.",
    icon: BookOpen,
    stepCount: 6,
    path: "/module/12",
  },
  {
    id: 13,
    name: "GraphRAG",
    description:
      "Explore how knowledge graphs enhance RAG with entity relationships, community detection, and multi-hop reasoning.",
    icon: Share2,
    stepCount: 6,
    path: "/module/13",
  },
  {
    id: 14,
    name: "Knowledge Graphs",
    description:
      "Learn how knowledge graphs represent entities and relationships, enabling structured reasoning, fact verification, and grounded LLM responses.",
    icon: Waypoints,
    stepCount: 6,
    path: "/module/14",
  },
  // -- Data Applications -------------------------------------------------------
  {
    id: 15,
    name: "Semantic Layer",
    description:
      "Learn why semantic layers matter for consistent data answers across different agent runs.",
    icon: Database,
    stepCount: 6,
    path: "/module/15",
  },
  {
    id: 16,
    name: "Text-to-SQL",
    description:
      "Learn how AI agents translate natural language questions into SQL queries against real databases.",
    icon: Database,
    stepCount: 6,
    path: "/module/16",
  },
  {
    id: 17,
    name: "Data Quality",
    description:
      "Discover how AI agents detect and fix data quality issues: missing values, duplicates, and outliers.",
    icon: SearchCheck,
    stepCount: 6,
    path: "/module/17",
  },
  {
    id: 18,
    name: "ETL/ELT",
    description:
      "See how AI agents automate data pipelines with intelligent schema mapping and transformation.",
    icon: ArrowRightLeft,
    stepCount: 6,
    path: "/module/18",
  },
  // -- Safety & Operations -----------------------------------------------------
  {
    id: 19,
    name: "Grounding",
    description:
      "Learn how to anchor LLM outputs in factual, verifiable information using source attribution, citation generation, and hallucination detection.",
    icon: Anchor,
    stepCount: 6,
    path: "/module/19",
  },
  {
    id: 20,
    name: "Guardrails",
    description:
      "Learn how to protect AI agents with input validation, output filtering, and safety guardrails.",
    icon: Shield,
    stepCount: 6,
    path: "/module/20",
  },
  {
    id: 21,
    name: "Evaluation",
    description:
      "Learn how to evaluate AI agent quality with metrics, test suites, and LLM-as-Judge patterns.",
    icon: ClipboardCheck,
    stepCount: 6,
    path: "/module/21",
  },
  {
    id: 22,
    name: "Human-in-the-Loop",
    description:
      "Learn how to design approval gates, confidence-based routing, and feedback loops that keep humans in control of critical agent decisions.",
    icon: UserCheck,
    stepCount: 6,
    path: "/module/22",
  },
  {
    id: 23,
    name: "Self-Healing Loops",
    description:
      "Discover how AI agents detect errors, analyze root causes, and automatically fix and retry failed operations.",
    icon: RefreshCw,
    stepCount: 6,
    path: "/module/23",
  },
  {
    id: 24,
    name: "Cost & Latency",
    description:
      "Optimize AI agent performance by understanding and reducing costs and latency.",
    icon: Zap,
    stepCount: 6,
    path: "/module/24",
  },
  // -- Multimodal & Generation -------------------------------------------------
  {
    id: 25,
    name: "Multimodal",
    description:
      "Explore how AI models process text, images, audio, and video together for richer understanding and data extraction.",
    icon: ScanEye,
    stepCount: 6,
    path: "/module/25",
  },
  {
    id: 26,
    name: "Image Generation",
    description:
      "Understand how diffusion models generate images from text prompts, with prompt engineering, advanced techniques, and ethical considerations.",
    icon: Palette,
    stepCount: 6,
    path: "/module/26",
  },
];
