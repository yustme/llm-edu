/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction",
  "Architecture",
  "JSON-RPC Protocol",
  "Database Query Demo",
  "Capabilities",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "The N*M integration problem and MCP standard",
  "Host, Client, and Server architecture layers",
  "JSON-RPC 2.0 message exchange protocol",
  "Full database query flow via MCP",
  "Resources, Tools, and Prompts",
  "Key takeaways and architecture recap",
] as const;

/** N*M problem explanation text */
export const NM_PROBLEM_TEXT = {
  title: "The Integration Problem",
  before:
    "Without a standard protocol, every AI application needs a custom integration for every tool. With 5 apps and 4 tools, that means 20 separate integrations to build and maintain.",
  after:
    "MCP provides a universal standard. Each app implements one MCP client, each tool implements one MCP server. 5 apps + 4 tools = 9 integrations total instead of 20.",
  analogy:
    "Think of USB-C: before USB-C, every device had a different cable and connector. USB-C standardized the connection so any device works with any charger. MCP does the same for AI tools - one standard protocol that connects any AI application to any data source or tool.",
} as const;

/** Architecture layer descriptions */
export const ARCHITECTURE_LAYERS = {
  host: {
    title: "Host Application",
    description:
      "The application the user interacts with (e.g., Claude Desktop, an IDE, or a custom app). The host manages one or more MCP client instances.",
    example: "Claude Desktop, VS Code, Custom Application",
  },
  client: {
    title: "MCP Client",
    description:
      "Lives inside the host application. Manages the protocol connection to an MCP server. Handles initialization, capability discovery, and message routing.",
    example: "Built into Claude Desktop, manages server connections",
  },
  server: {
    title: "MCP Server",
    description:
      "A lightweight program that exposes capabilities (resources, tools, prompts) through the MCP protocol. Each server connects to a specific data source or service.",
    example: "Database MCP Server, GitHub MCP Server, Slack MCP Server",
  },
} as const;

/** Key takeaways for the summary step */
export const KEY_TAKEAWAYS = [
  {
    title: "Standardization",
    description:
      "MCP provides a universal protocol for connecting AI applications to tools and data. Build one integration, use it everywhere.",
  },
  {
    title: "Security",
    description:
      "The server controls what capabilities are exposed. The host application never accesses the underlying data directly - all access goes through the server's controlled interface.",
  },
  {
    title: "Reusability",
    description:
      "One MCP server can serve many different AI clients. A database server works with Claude, ChatGPT, or any MCP-compatible application without changes.",
  },
  {
    title: "Composability",
    description:
      "A single host can connect to multiple MCP servers simultaneously, combining capabilities from databases, APIs, files, and more in a single interaction.",
  },
] as const;
