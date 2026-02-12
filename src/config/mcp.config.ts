import type { LucideIcon } from "lucide-react";
import { Database, Globe, FileText } from "lucide-react";

/** MCP server type identifiers */
export const MCP_SERVER_TYPE = {
  database: "database",
  api: "api",
  file: "file",
} as const;

export type MCPServerType = (typeof MCP_SERVER_TYPE)[keyof typeof MCP_SERVER_TYPE];

/** Color configuration for each MCP server type */
export const MCP_SERVER_COLORS: Record<
  MCPServerType,
  {
    bg: string;
    text: string;
    border: string;
    accent: string;
    bgLight: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  database: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    accent: "#2563eb",
    bgLight: "bg-blue-50",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  api: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    accent: "#16a34a",
    bgLight: "bg-green-50",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
  },
  file: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
    accent: "#d97706",
    bgLight: "bg-amber-50",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
  },
};

/** MCP server definition used in the config */
export interface MCPServerDefinition {
  id: string;
  name: string;
  version: string;
  type: MCPServerType;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
  dataSource: string;
}

/** The 3 MCP servers shown in Module 3 */
export const MCP_SERVERS: MCPServerDefinition[] = [
  {
    id: "db-server",
    name: "Database Server",
    version: "1.0",
    type: "database",
    description:
      "Provides SQL execution and schema inspection capabilities. Connects to relational databases and enables structured data queries.",
    icon: Database,
    capabilities: ["execute_sql", "list_tables", "get_schema"],
    dataSource: "PostgreSQL Database",
  },
  {
    id: "api-server",
    name: "API Server",
    version: "1.0",
    type: "api",
    description:
      "Provides REST endpoint calls and authentication management. Connects to external APIs and web services.",
    icon: Globe,
    capabilities: ["call_endpoint", "manage_auth", "list_endpoints"],
    dataSource: "REST API Gateway",
  },
  {
    id: "file-server",
    name: "File Server",
    version: "1.0",
    type: "file",
    description:
      "Provides file read/write and directory listing capabilities. Manages access to local and remote file systems.",
    icon: FileText,
    capabilities: ["read_file", "write_file", "list_directory"],
    dataSource: "File System",
  },
];

/** MCP protocol version */
export const MCP_PROTOCOL_VERSION = "2024-11-05";

/** Client info used in protocol demos */
export const MCP_CLIENT_INFO = {
  name: "Claude Desktop",
  version: "1.0",
} as const;

/** MCP Architecture React Flow layout positions */
export const MCP_LAYOUT = {
  hostApp: { x: 0, y: 0 },
  client: { x: 40, y: 60 },
  dbServer: { x: 500, y: 0 },
  apiServer: { x: 500, y: 150 },
  fileServer: { x: 500, y: 300 },
  dbSource: { x: 750, y: 0 },
  apiSource: { x: 750, y: 150 },
  fileSource: { x: 750, y: 300 },
} as const;

/** Node dimensions for MCP React Flow nodes */
export const MCP_NODE_DIMENSIONS = {
  hostWidth: 280,
  hostHeight: 180,
  serverWidth: 200,
  serverHeight: 80,
  sourceWidth: 140,
  sourceHeight: 50,
} as const;

/** MCP capability type definitions */
export const MCP_CAPABILITY_TYPES = {
  resources: {
    label: "Resources",
    description:
      "Read-only data that servers expose to clients. Resources provide context without executing actions.",
    color: "blue",
    examples: [
      "File contents (text, code, documents)",
      "Database schemas and metadata",
      "API documentation and response samples",
      "Configuration data",
    ],
    codeExample: `// Server exposes resources
server.resources.list() -> [
  { uri: "file:///data/schema.sql", name: "Database Schema" },
  { uri: "api://docs/endpoints", name: "API Documentation" }
]

// Client reads a resource
server.resources.read("file:///data/schema.sql")
-> { contents: "CREATE TABLE orders (...)" }`,
  },
  tools: {
    label: "Tools",
    description:
      "Executable actions that servers provide. Tools allow LLMs to perform real-world operations through the server.",
    color: "green",
    examples: [
      "execute_sql - Run SQL queries on the database",
      "call_api - Make HTTP requests to external services",
      "write_file - Create or update files on disk",
      "run_analysis - Execute data analysis pipelines",
    ],
    codeExample: `// Server lists available tools
server.tools.list() -> [
  { name: "execute_sql", description: "Execute SQL query",
    inputSchema: { query: "string" } },
  { name: "list_tables", description: "List all tables" }
]

// Client calls a tool
server.tools.call("execute_sql", { query: "SELECT ..." })
-> { content: [{ type: "text", text: "| col1 | col2 |" }] }`,
  },
  prompts: {
    label: "Prompts",
    description:
      "Reusable prompt templates that servers provide. Prompts give the LLM pre-built instructions for common tasks.",
    color: "purple",
    examples: [
      "summarize_data - Generate executive summary from query results",
      "generate_report - Create formatted report from raw data",
      "explain_schema - Describe database schema in natural language",
      "debug_query - Help diagnose SQL query issues",
    ],
    codeExample: `// Server lists available prompts
server.prompts.list() -> [
  { name: "summarize_data", description: "Summarize dataset",
    arguments: [{ name: "data", required: true }] },
  { name: "generate_report", description: "Create report" }
]

// Client uses a prompt
server.prompts.get("summarize_data", { data: "..." })
-> { messages: [{ role: "user", content: "Summarize: ..." }] }`,
  },
} as const;

/** N*M problem data for Step 1 */
export const NM_PROBLEM = {
  beforeApps: ["Claude", "ChatGPT", "Gemini", "Copilot", "Custom App"],
  beforeTools: ["Database", "API", "Files", "Search"],
  afterApps: ["Claude", "ChatGPT", "Gemini", "Copilot", "Custom App"],
  afterTools: ["Database", "API", "Files", "Search"],
} as const;
