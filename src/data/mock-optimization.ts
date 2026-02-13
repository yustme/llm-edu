import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";

// ---------------------------------------------------------------------------
// Model options for the cost calculator
// ---------------------------------------------------------------------------

export interface ModelOption {
  name: string;
  inputCostPer1k: number;
  outputCostPer1k: number;
  label: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { name: "gpt-4o", inputCostPer1k: 0.005, outputCostPer1k: 0.015, label: "GPT-4o" },
  { name: "gpt-4o-mini", inputCostPer1k: 0.00015, outputCostPer1k: 0.0006, label: "GPT-4o Mini" },
  { name: "claude-sonnet", inputCostPer1k: 0.003, outputCostPer1k: 0.015, label: "Claude Sonnet" },
  { name: "claude-haiku", inputCostPer1k: 0.001, outputCostPer1k: 0.005, label: "Claude Haiku" },
];

export const COST_DEFAULTS = {
  inputTokens: 2000,
  outputTokens: 500,
  toolCalls: 3,
  toolCallCostEach: 0.001,
} as const;

// ---------------------------------------------------------------------------
// Latency breakdown phases
// ---------------------------------------------------------------------------

export interface LatencyPhase {
  name: string;
  sequentialMs: number;
  parallelMs: number;
  color: string;
}

export const LATENCY_PHASES: LatencyPhase[] = [
  { name: "Input Processing", sequentialMs: 50, parallelMs: 50, color: "blue" },
  { name: "LLM Inference", sequentialMs: 800, parallelMs: 800, color: "purple" },
  { name: "Tool Call 1", sequentialMs: 300, parallelMs: 300, color: "green" },
  { name: "Tool Call 2", sequentialMs: 300, parallelMs: 0, color: "green" },
  { name: "Tool Call 3", sequentialMs: 300, parallelMs: 0, color: "green" },
  { name: "Response Generation", sequentialMs: 400, parallelMs: 400, color: "amber" },
];

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
// Naive (unoptimized) agent simulation steps
// ---------------------------------------------------------------------------

export const NAIVE_STEPS: SimulationStep[] = [
  {
    id: "naive-1",
    type: "user-input",
    actor: "user",
    content: "What's our Q4 revenue by region?",
    delayMs: DELAY.userInput,
  },
  {
    id: "naive-2",
    type: "reasoning",
    actor: "agent",
    content:
      "Using GPT-4o for everything. No caching, no model routing. I'll run SQL queries one at a time to gather the data.",
    delayMs: DELAY.reasoning,
    metadata: {
      model: "GPT-4o",
      strategy: "No optimization",
    },
  },
  {
    id: "naive-3",
    type: "tool-call",
    actor: "agent",
    content: "execute_sql",
    delayMs: DELAY.toolCall,
    metadata: {
      toolName: "execute_sql",
      input: {
        query: "SELECT region, SUM(revenue) FROM sales WHERE quarter='Q4' GROUP BY region",
      },
      annotation: "Sequential call 1 of 2",
    },
  },
  {
    id: "naive-4",
    type: "tool-result",
    actor: "tool",
    content: "Partial data: North America $4.2M, Europe $2.8M",
    delayMs: DELAY.toolResult,
    metadata: {
      toolName: "execute_sql",
      output: {
        rows: [
          { region: "North America", revenue: 4200000 },
          { region: "Europe", revenue: 2800000 },
        ],
      },
    },
  },
  {
    id: "naive-5",
    type: "tool-call",
    actor: "agent",
    content: "execute_sql",
    delayMs: DELAY.toolCall,
    metadata: {
      toolName: "execute_sql",
      input: {
        query: "SELECT region, SUM(revenue) FROM sales WHERE quarter='Q4' AND region IN ('APAC','LATAM') GROUP BY region",
      },
      annotation: "Sequential call 2 of 2",
    },
  },
  {
    id: "naive-6",
    type: "tool-result",
    actor: "tool",
    content: "Remaining data: APAC $1.9M, LATAM $0.8M",
    delayMs: DELAY.toolResult,
    metadata: {
      toolName: "execute_sql",
      output: {
        rows: [
          { region: "APAC", revenue: 1900000 },
          { region: "LATAM", revenue: 800000 },
        ],
      },
    },
  },
  {
    id: "naive-7",
    type: "final-response",
    actor: "assistant",
    content:
      "Q4 Revenue by Region:\n- North America: $4.2M\n- Europe: $2.8M\n- APAC: $1.9M\n- LATAM: $0.8M\n\nTotal: $9.7M",
    delayMs: DELAY.finalResponse,
    metadata: {
      cost: "$0.12",
      latency: "4.2s",
      model: "GPT-4o",
      toolCalls: 2,
      annotation: "High cost due to expensive model, high latency due to sequential calls",
    },
  },
];

// ---------------------------------------------------------------------------
// Optimized agent simulation steps
// ---------------------------------------------------------------------------

export const OPTIMIZED_STEPS: SimulationStep[] = [
  {
    id: "opt-1",
    type: "user-input",
    actor: "user",
    content: "What's our Q4 revenue by region?",
    delayMs: DELAY.userInput,
  },
  {
    id: "opt-2",
    type: "reasoning",
    actor: "agent",
    content:
      "Cache miss for this query. Using Haiku for intent classification, then Sonnet for generation. Executing a single optimized SQL query to get all regions at once.",
    delayMs: DELAY.reasoning,
    metadata: {
      model: "Claude Haiku + Sonnet",
      strategy: "Model routing + parallel tools + optimized prompt",
    },
  },
  {
    id: "opt-3",
    type: "tool-call",
    actor: "agent",
    content: "execute_sql",
    delayMs: DELAY.toolCall,
    metadata: {
      toolName: "execute_sql",
      input: {
        query: "SELECT region, SUM(revenue) FROM sales WHERE quarter='Q4' GROUP BY region ORDER BY revenue DESC",
      },
      annotation: "Single optimized query for all regions",
    },
  },
  {
    id: "opt-4",
    type: "tool-result",
    actor: "tool",
    content: "All data returned in a single query",
    delayMs: DELAY.toolResult,
    metadata: {
      toolName: "execute_sql",
      output: {
        rows: [
          { region: "North America", revenue: 4200000 },
          { region: "Europe", revenue: 2800000 },
          { region: "APAC", revenue: 1900000 },
          { region: "LATAM", revenue: 800000 },
        ],
      },
    },
  },
  {
    id: "opt-5",
    type: "final-response",
    actor: "assistant",
    content:
      "Q4 Revenue by Region:\n- North America: $4.2M\n- Europe: $2.8M\n- APAC: $1.9M\n- LATAM: $0.8M\n\nTotal: $9.7M",
    delayMs: DELAY.finalResponse,
    metadata: {
      cost: "$0.03",
      latency: "1.8s",
      model: "Haiku (routing) + Sonnet (generation)",
      toolCalls: 1,
      annotation: "75% cost reduction, 57% latency reduction with same quality",
    },
  },
];
