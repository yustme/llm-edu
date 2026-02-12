import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";
import { MCP_PROTOCOL_VERSION, MCP_CLIENT_INFO } from "@/config/mcp.config";

/** Timing constants for MCP simulation step delays (in milliseconds) */
const DELAY = {
  userInput: 300,
  reasoning: SIMULATION.defaultStepDelayMs,
  agentMessage: SIMULATION.defaultStepDelayMs,
  toolCall: SIMULATION.toolCallResultDelayMs,
  toolResult: 500,
  finalResponse: 400,
} as const;

/** Actor identifiers for MCP simulation */
export const MCP_ACTOR = {
  client: "mcp-client",
  server: "mcp-server",
  user: "user",
  agent: "agent",
  database: "database",
} as const;

// ---------------------------------------------------------------------------
// JSON-RPC Protocol Flow (for Step 3)
// ---------------------------------------------------------------------------

/** JSON-RPC protocol messages as structured data */
export interface ProtocolMessage {
  id: string;
  direction: "request" | "response";
  label: string;
  description: string;
  json: string;
}

export const PROTOCOL_MESSAGES: ProtocolMessage[] = [
  {
    id: "proto-1",
    direction: "request",
    label: "Initialize",
    description: "Client sends initialization request with protocol version and client info.",
    json: JSON.stringify(
      {
        jsonrpc: "2.0",
        method: "initialize",
        params: {
          protocolVersion: MCP_PROTOCOL_VERSION,
          clientInfo: {
            name: MCP_CLIENT_INFO.name,
            version: MCP_CLIENT_INFO.version,
          },
        },
        id: 1,
      },
      null,
      2,
    ),
  },
  {
    id: "proto-2",
    direction: "response",
    label: "Initialize Response",
    description: "Server responds with its info and capabilities.",
    json: JSON.stringify(
      {
        jsonrpc: "2.0",
        result: {
          protocolVersion: MCP_PROTOCOL_VERSION,
          serverInfo: {
            name: "Database MCP Server",
            version: "1.0",
          },
          capabilities: {
            tools: {},
          },
        },
        id: 1,
      },
      null,
      2,
    ),
  },
  {
    id: "proto-3",
    direction: "request",
    label: "List Tools",
    description: "Client requests available tools from the server.",
    json: JSON.stringify(
      {
        jsonrpc: "2.0",
        method: "tools/list",
        id: 2,
      },
      null,
      2,
    ),
  },
  {
    id: "proto-4",
    direction: "response",
    label: "Tools List",
    description: "Server returns all available tools with their schemas.",
    json: JSON.stringify(
      {
        jsonrpc: "2.0",
        result: {
          tools: [
            {
              name: "execute_sql",
              description: "Execute SQL query",
              inputSchema: {
                type: "object",
                properties: {
                  query: { type: "string" },
                },
              },
            },
            {
              name: "list_tables",
              description: "List all database tables",
            },
          ],
        },
        id: 2,
      },
      null,
      2,
    ),
  },
  {
    id: "proto-5",
    direction: "request",
    label: "Call Tool",
    description: "Client invokes the execute_sql tool with a SQL query.",
    json: JSON.stringify(
      {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "execute_sql",
          arguments: {
            query:
              "SELECT SUM(order_amount) as total FROM orders WHERE status = 'completed'",
          },
        },
        id: 3,
      },
      null,
      2,
    ),
  },
  {
    id: "proto-6",
    direction: "response",
    label: "Tool Result",
    description: "Server returns the query result.",
    json: JSON.stringify(
      {
        jsonrpc: "2.0",
        result: {
          content: [
            {
              type: "text",
              text: "| total |\n|-------|\n| 173380 |",
            },
          ],
        },
        id: 3,
      },
      null,
      2,
    ),
  },
];

// ---------------------------------------------------------------------------
// DB Query Flow Simulation Steps (for Step 4)
// ---------------------------------------------------------------------------

export const DB_QUERY_STEPS: SimulationStep[] = [
  {
    id: "dbq-1",
    type: "user-input",
    actor: MCP_ACTOR.user,
    content: "What's the total revenue?",
    delayMs: DELAY.userInput,
  },
  {
    id: "dbq-2",
    type: "reasoning",
    actor: MCP_ACTOR.agent,
    content:
      "I need to query the database to get the total revenue. I have a Database MCP Server available with an execute_sql tool. Let me construct a SQL query for completed orders.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "dbq-3",
    type: "agent-message",
    actor: MCP_ACTOR.agent,
    content: "tools/call",
    metadata: {
      from: MCP_ACTOR.agent,
      to: MCP_ACTOR.server,
      method: "tools/call",
      toolName: "execute_sql",
      toolInput: JSON.stringify(
        {
          jsonrpc: "2.0",
          method: "tools/call",
          params: {
            name: "execute_sql",
            arguments: {
              query:
                "SELECT SUM(order_amount) as total FROM orders WHERE status = 'completed'",
            },
          },
          id: 3,
        },
        null,
        2,
      ),
    },
    delayMs: DELAY.agentMessage,
  },
  {
    id: "dbq-4",
    type: "tool-call",
    actor: MCP_ACTOR.server,
    content: "Executing SQL on database...",
    metadata: {
      toolName: "execute_sql",
      sql: "SELECT SUM(order_amount) as total FROM orders WHERE status = 'completed'",
    },
    delayMs: DELAY.toolCall,
  },
  {
    id: "dbq-5",
    type: "tool-result",
    actor: MCP_ACTOR.server,
    content: "Query result",
    metadata: {
      from: MCP_ACTOR.server,
      to: MCP_ACTOR.agent,
      toolName: "execute_sql",
      toolOutput: JSON.stringify(
        {
          jsonrpc: "2.0",
          result: {
            content: [
              {
                type: "text",
                text: "| total |\n|-------|\n| 173380 |",
              },
            ],
          },
          id: 3,
        },
        null,
        2,
      ),
    },
    delayMs: DELAY.toolResult,
  },
  {
    id: "dbq-6",
    type: "reasoning",
    actor: MCP_ACTOR.agent,
    content:
      "The MCP server returned the query result. The total revenue from completed orders is 173,380 CZK. Let me present this to the user in a clear format.",
    delayMs: DELAY.reasoning,
  },
  {
    id: "dbq-7",
    type: "final-response",
    actor: MCP_ACTOR.agent,
    content:
      "Total revenue is 173,380 CZK from completed orders. This is calculated as the sum of all order amounts where the order status is 'completed'.",
    metadata: {
      from: MCP_ACTOR.agent,
      to: MCP_ACTOR.user,
    },
    delayMs: DELAY.finalResponse,
  },
];

/** Actor display names for MCP simulation */
export function getMCPActorDisplayName(actor: string): string {
  switch (actor) {
    case MCP_ACTOR.client:
      return "MCP Client";
    case MCP_ACTOR.server:
      return "MCP Server";
    case MCP_ACTOR.user:
      return "User";
    case MCP_ACTOR.agent:
      return "Agent";
    case MCP_ACTOR.database:
      return "Database";
    default:
      return actor;
  }
}

// ---------------------------------------------------------------------------
// Mock Database Tables (for Step 4 DatabasePanel)
// ---------------------------------------------------------------------------

export interface MockTable {
  name: string;
  rowCount: number;
  columns: string[];
}

export const MOCK_TABLES: MockTable[] = [
  {
    name: "orders",
    rowCount: 15,
    columns: ["order_id", "customer_id", "product_id", "order_amount", "discount", "status", "order_date"],
  },
  {
    name: "products",
    rowCount: 8,
    columns: ["product_id", "name", "category", "price"],
  },
  {
    name: "customers",
    rowCount: 7,
    columns: ["customer_id", "name", "email", "segment"],
  },
];

export interface MockQueryResult {
  sql: string;
  headers: string[];
  rows: (string | number)[][];
}

export const MOCK_QUERY_RESULT: MockQueryResult = {
  sql: "SELECT SUM(order_amount) as total FROM orders WHERE status = 'completed'",
  headers: ["total"],
  rows: [[173380]],
};
