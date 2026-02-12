export interface MCPServer {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: MCPCapability[];
}

export interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export type MCPCapabilityType = "resources" | "tools" | "prompts";

export interface MCPCapability {
  type: MCPCapabilityType;
  name: string;
  description: string;
  examples?: string[];
}
