export type AgentStatus = "idle" | "working" | "done" | "error";

export interface Tool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  tools: Tool[];
  color: string;
  icon: string;
  status: AgentStatus;
}

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  agentId?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export type SimulationStepType =
  | "user-input"
  | "llm-thinking"
  | "tool-call"
  | "tool-result"
  | "agent-message"
  | "reasoning"
  | "final-response";

export interface SimulationStep {
  id: string;
  type: SimulationStepType;
  actor: string;
  content: string;
  metadata?: Record<string, unknown>;
  delayMs: number;
}
