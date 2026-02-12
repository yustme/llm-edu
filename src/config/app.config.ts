import type { LucideIcon } from "lucide-react";
import { Bot, Users, Plug, Database, BookOpen } from "lucide-react";

export interface ModuleConfig {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  stepCount: number;
  path: string;
}

export const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "AI Agents Interactive Education";

export const MODULES: ModuleConfig[] = [
  {
    id: 1,
    name: "Agent vs LLM",
    description:
      "Understand the difference between a plain LLM and an AI agent with tools, reasoning, and memory.",
    icon: Bot,
    stepCount: 6,
    path: "/module/1",
  },
  {
    id: 2,
    name: "Multi-Agent Communication",
    description:
      "See how multiple specialized agents collaborate to solve complex data tasks together.",
    icon: Users,
    stepCount: 6,
    path: "/module/2",
  },
  {
    id: 3,
    name: "MCP Server",
    description:
      "Explore the Model Context Protocol (MCP) and how agents connect to external tools and data.",
    icon: Plug,
    stepCount: 6,
    path: "/module/3",
  },
  {
    id: 4,
    name: "Semantic Layer",
    description:
      "Learn why semantic layers matter for consistent data answers across different agent runs.",
    icon: Database,
    stepCount: 6,
    path: "/module/4",
  },
  {
    id: 5,
    name: "RAG",
    description:
      "Discover how Retrieval-Augmented Generation grounds LLM answers in real documents and knowledge bases.",
    icon: BookOpen,
    stepCount: 6,
    path: "/module/5",
  },
];
