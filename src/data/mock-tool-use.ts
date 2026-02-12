import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";

/** Timing constants for simulation step delays (in milliseconds) */
const DELAY = {
  userInput: 300,
  thinking: SIMULATION.thinkingDelayMs,
  reasoning: SIMULATION.defaultStepDelayMs,
  toolCall: SIMULATION.toolCallResultDelayMs,
  toolResult: 500,
  finalResponse: 400,
} as const;

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "calculator",
    description:
      "Evaluate a mathematical expression and return the numeric result. Supports basic arithmetic, parentheses, and common math operators.",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description:
            "The mathematical expression to evaluate (e.g. '2 + 3 * 4')",
        },
      },
      required: ["expression"],
    },
  },
  {
    name: "get_weather",
    description:
      "Get the current weather conditions for a given city. Returns temperature in Celsius, weather condition, and humidity percentage.",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The name of the city to get weather for",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "execute_sql",
    description:
      "Execute a read-only SQL query against the application database and return the result rows. Only SELECT statements are permitted.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The SQL SELECT query to execute",
        },
      },
      required: ["query"],
    },
  },
];

// ---------------------------------------------------------------------------
// SINGLE TOOL CALL: "What is 8372 * 491?"
// ---------------------------------------------------------------------------

export const SINGLE_TOOL_STEPS: SimulationStep[] = [
  {
    id: "single-1",
    type: "user-input",
    actor: "user",
    content: "What is 8372 * 491?",
    delayMs: DELAY.userInput,
  },
  {
    id: "single-2",
    type: "reasoning",
    actor: "agent",
    content:
      "This requires a precise calculation. I'll use the calculator tool.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "single-3",
    type: "tool-call",
    actor: "agent",
    content: "calculator",
    metadata: {
      toolName: "calculator",
      input: { expression: "8372 * 491" },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "single-4",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify({ result: 4110652 }),
    metadata: {
      toolName: "calculator",
      output: { result: 4110652 },
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "single-5",
    type: "final-response",
    actor: "assistant",
    content: "8372 * 491 = 4,110,652",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// MULTI TOOL CHAIN: "What's the weather in Prague and how much is 20C in F?"
// ---------------------------------------------------------------------------

export const MULTI_TOOL_STEPS: SimulationStep[] = [
  {
    id: "multi-1",
    type: "user-input",
    actor: "user",
    content:
      "What's the weather in Prague and how much is 20\u00B0C in Fahrenheit?",
    delayMs: DELAY.userInput,
  },
  {
    id: "multi-2",
    type: "reasoning",
    actor: "agent",
    content:
      "I need to first get the weather in Prague, then convert the temperature.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "multi-3",
    type: "tool-call",
    actor: "agent",
    content: "get_weather",
    metadata: {
      toolName: "get_weather",
      input: { city: "Prague" },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "multi-4",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify({
      temperature: 22,
      condition: "Partly cloudy",
      humidity: 65,
    }),
    metadata: {
      toolName: "get_weather",
      output: { temperature: 22, condition: "Partly cloudy", humidity: 65 },
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "multi-5",
    type: "reasoning",
    actor: "agent",
    content:
      "Got the weather. Now I need to convert 22\u00B0C to Fahrenheit.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "multi-6",
    type: "tool-call",
    actor: "agent",
    content: "calculator",
    metadata: {
      toolName: "calculator",
      input: { expression: "22 * 9/5 + 32" },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "multi-7",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify({ result: 71.6 }),
    metadata: {
      toolName: "calculator",
      output: { result: 71.6 },
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "multi-8",
    type: "final-response",
    actor: "assistant",
    content:
      "Prague: 22\u00B0C (71.6\u00B0F), Partly cloudy, 65% humidity.",
    delayMs: DELAY.finalResponse,
  },
];

// ---------------------------------------------------------------------------
// ERROR HANDLING: "Get the weather in Atlantis"
// ---------------------------------------------------------------------------

export const ERROR_HANDLING_STEPS: SimulationStep[] = [
  {
    id: "error-1",
    type: "user-input",
    actor: "user",
    content: "What's the weather in Atlantis?",
    delayMs: DELAY.userInput,
  },
  {
    id: "error-2",
    type: "reasoning",
    actor: "agent",
    content: "Let me look up the weather for Atlantis.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "error-3",
    type: "tool-call",
    actor: "agent",
    content: "get_weather",
    metadata: {
      toolName: "get_weather",
      input: { city: "Atlantis" },
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "error-4",
    type: "tool-result",
    actor: "tool",
    content: JSON.stringify({ error: "City not found: Atlantis" }),
    metadata: {
      toolName: "get_weather",
      output: { error: "City not found: Atlantis" },
      isError: true,
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "error-5",
    type: "reasoning",
    actor: "agent",
    content:
      "The tool returned an error. Atlantis is not a real city. I should inform the user.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "error-6",
    type: "final-response",
    actor: "assistant",
    content:
      "I wasn't able to find weather data for 'Atlantis' as it's not a recognized city. Could you please provide a real city name?",
    delayMs: DELAY.finalResponse,
  },
];
