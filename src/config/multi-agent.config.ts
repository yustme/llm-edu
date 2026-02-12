import type { LucideIcon } from "lucide-react";
import { Brain, Database, BarChart3 } from "lucide-react";

/** Agent definition for the multi-agent module */
export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  description: string;
  tools: { name: string; description: string }[];
  color: {
    bg: string;
    text: string;
    border: string;
    accent: string;
    bgLight: string;
  };
  icon: LucideIcon;
}

/** Definitions for the 3 agents in Module 2 */
export const AGENTS: Record<string, AgentDefinition> = {
  "data-analyst": {
    id: "data-analyst",
    name: "Data Analyst",
    role: "Analysis & Interpretation",
    description:
      "Understands business questions, creates analysis plans, and interprets results. Translates user requests into structured data requirements and synthesizes findings into actionable insights.",
    tools: [
      {
        name: "analyze_query",
        description: "Breaks down business questions into data requirements",
      },
      {
        name: "interpret_results",
        description: "Analyzes data patterns and generates insights",
      },
    ],
    color: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
      accent: "#9333ea",
      bgLight: "bg-purple-50",
    },
    icon: Brain,
  },
  "data-engineer": {
    id: "data-engineer",
    name: "Data Engineer",
    role: "Data & SQL",
    description:
      "Writes SQL queries, manages data pipelines, and optimizes query performance. Transforms data requirements into efficient database operations and returns structured results.",
    tools: [
      {
        name: "execute_sql",
        description: "Runs SQL queries against the database",
      },
      {
        name: "optimize_query",
        description: "Analyzes and optimizes SQL query performance",
      },
    ],
    color: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-300",
      accent: "#16a34a",
      bgLight: "bg-green-50",
    },
    icon: Database,
  },
  "reporting-agent": {
    id: "reporting-agent",
    name: "Reporting Agent",
    role: "Visualization & Reports",
    description:
      "Creates visualizations, formats reports, and generates executive summaries. Transforms raw data and analysis into polished, presentation-ready deliverables.",
    tools: [
      {
        name: "create_chart",
        description: "Generates charts and data visualizations",
      },
      {
        name: "format_report",
        description: "Formats data into structured reports",
      },
    ],
    color: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-300",
      accent: "#d97706",
      bgLight: "bg-amber-50",
    },
    icon: BarChart3,
  },
} as const;

/** User node color config */
export const USER_COLOR = {
  bg: "bg-blue-100",
  text: "text-blue-700",
  border: "border-blue-300",
  accent: "#2563eb",
  bgLight: "bg-blue-50",
} as const;

/** The demo task shown in the simulation */
export const MULTI_AGENT = {
  demoTask: "Show monthly sales trend by category for 2025",
} as const;

/** React Flow layout positions for agent nodes */
export const WORKFLOW_LAYOUT = {
  user: { x: 300, y: 0 },
  "data-analyst": { x: 50, y: 180 },
  "data-engineer": { x: 300, y: 180 },
  "reporting-agent": { x: 550, y: 180 },
} as const;

/** Node dimensions for React Flow */
export const NODE_DIMENSIONS = {
  width: 160,
  height: 80,
} as const;
