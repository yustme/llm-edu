import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type NodeTypes,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Monitor, Database, Globe, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCPServerNode, type MCPServerNodeType } from "./MCPServerNode";
import {
  MCP_SERVERS,
  MCP_LAYOUT,
  MCP_SERVER_COLORS,
} from "@/config/mcp.config";

/** Architecture layer descriptions used in the detail panel */
const ARCHITECTURE_LAYERS = {
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

interface MCPArchitectureProps {
  className?: string;
}

/** Custom node types for the architecture diagram */
const nodeTypes: NodeTypes = {
  mcpServerNode: MCPServerNode,
};

/** Detail panel information for a clicked node */
interface NodeDetail {
  title: string;
  description: string;
  extra?: string;
}

/**
 * Interactive React Flow diagram showing the MCP architecture:
 * Host Application (with Client inside) -> Protocol -> 3 Server nodes -> Data sources
 * Clicking a node shows more detail in a panel below.
 */
export function MCPArchitecture({ className }: MCPArchitectureProps) {
  const [selectedDetail, setSelectedDetail] = useState<NodeDetail | null>(null);

  const nodes = useMemo<(Node | MCPServerNodeType)[]>(
    () => [
      // Host Application container
      {
        id: "host-app",
        type: "default",
        position: MCP_LAYOUT.hostApp,
        data: {
          label: (
            <div className="flex flex-col items-center gap-1">
              <Monitor className="h-5 w-5 text-slate-600" />
              <span className="text-xs font-semibold">Claude Desktop</span>
              <span className="text-[10px] text-muted-foreground">
                Host Application
              </span>
            </div>
          ),
        },
        style: {
          width: 280,
          height: 90,
          background: "#f8fafc",
          border: "2px solid #94a3b8",
          borderRadius: "12px",
        },
      },
      // MCP Client inside the host
      {
        id: "mcp-client",
        type: "default",
        position: MCP_LAYOUT.client,
        data: {
          label: (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-semibold text-indigo-700">
                MCP Client
              </span>
              <span className="text-[9px] text-muted-foreground">
                Protocol Handler
              </span>
            </div>
          ),
        },
        parentId: "host-app",
        extent: "parent" as const,
        style: {
          width: 200,
          height: 40,
          background: "#eef2ff",
          border: "1px solid #a5b4fc",
          borderRadius: "8px",
        },
      },
      // Database MCP Server
      {
        id: MCP_SERVERS[0].id,
        type: "mcpServerNode",
        position: MCP_LAYOUT.dbServer,
        data: {
          serverId: MCP_SERVERS[0].id,
          label: MCP_SERVERS[0].name,
          version: MCP_SERVERS[0].version,
          serverType: MCP_SERVERS[0].type,
          capabilities: MCP_SERVERS[0].capabilities,
        },
      } as MCPServerNodeType,
      // API MCP Server
      {
        id: MCP_SERVERS[1].id,
        type: "mcpServerNode",
        position: MCP_LAYOUT.apiServer,
        data: {
          serverId: MCP_SERVERS[1].id,
          label: MCP_SERVERS[1].name,
          version: MCP_SERVERS[1].version,
          serverType: MCP_SERVERS[1].type,
          capabilities: MCP_SERVERS[1].capabilities,
        },
      } as MCPServerNodeType,
      // File MCP Server
      {
        id: MCP_SERVERS[2].id,
        type: "mcpServerNode",
        position: MCP_LAYOUT.fileServer,
        data: {
          serverId: MCP_SERVERS[2].id,
          label: MCP_SERVERS[2].name,
          version: MCP_SERVERS[2].version,
          serverType: MCP_SERVERS[2].type,
          capabilities: MCP_SERVERS[2].capabilities,
        },
      } as MCPServerNodeType,
      // Data source nodes
      {
        id: "source-db",
        type: "default",
        position: MCP_LAYOUT.dbSource,
        data: {
          label: (
            <div className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[10px] font-medium">PostgreSQL</span>
            </div>
          ),
        },
        style: {
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          width: 140,
          height: 36,
        },
      },
      {
        id: "source-api",
        type: "default",
        position: MCP_LAYOUT.apiSource,
        data: {
          label: (
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-green-600" />
              <span className="text-[10px] font-medium">REST API</span>
            </div>
          ),
        },
        style: {
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "8px",
          width: 140,
          height: 36,
        },
      },
      {
        id: "source-fs",
        type: "default",
        position: MCP_LAYOUT.fileSource,
        data: {
          label: (
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[10px] font-medium">File System</span>
            </div>
          ),
        },
        style: {
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "8px",
          width: 140,
          height: 36,
        },
      },
    ],
    [],
  );

  const edges = useMemo<Edge[]>(
    () => [
      // Client -> Database Server
      {
        id: "edge-client-db",
        source: "mcp-client",
        target: MCP_SERVERS[0].id,
        label: "JSON-RPC",
        labelStyle: { fontSize: 9, fill: "#64748b" },
        style: { stroke: MCP_SERVER_COLORS.database.accent, strokeWidth: 2 },
        animated: true,
      },
      // Client -> API Server
      {
        id: "edge-client-api",
        source: "mcp-client",
        target: MCP_SERVERS[1].id,
        label: "JSON-RPC",
        labelStyle: { fontSize: 9, fill: "#64748b" },
        style: { stroke: MCP_SERVER_COLORS.api.accent, strokeWidth: 2 },
        animated: true,
      },
      // Client -> File Server
      {
        id: "edge-client-file",
        source: "mcp-client",
        target: MCP_SERVERS[2].id,
        label: "JSON-RPC",
        labelStyle: { fontSize: 9, fill: "#64748b" },
        style: { stroke: MCP_SERVER_COLORS.file.accent, strokeWidth: 2 },
        animated: true,
      },
      // Server -> Data Source edges
      {
        id: "edge-db-source",
        source: MCP_SERVERS[0].id,
        target: "source-db",
        style: { stroke: "#93c5fd", strokeDasharray: "4 2" },
      },
      {
        id: "edge-api-source",
        source: MCP_SERVERS[1].id,
        target: "source-api",
        style: { stroke: "#86efac", strokeDasharray: "4 2" },
      },
      {
        id: "edge-file-source",
        source: MCP_SERVERS[2].id,
        target: "source-fs",
        style: { stroke: "#fcd34d", strokeDasharray: "4 2" },
      },
    ],
    [],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      switch (node.id) {
        case "host-app":
          setSelectedDetail({
            title: ARCHITECTURE_LAYERS.host.title,
            description: ARCHITECTURE_LAYERS.host.description,
            extra: `Examples: ${ARCHITECTURE_LAYERS.host.example}`,
          });
          break;
        case "mcp-client":
          setSelectedDetail({
            title: ARCHITECTURE_LAYERS.client.title,
            description: ARCHITECTURE_LAYERS.client.description,
            extra: `Role: ${ARCHITECTURE_LAYERS.client.example}`,
          });
          break;
        case MCP_SERVERS[0].id:
        case MCP_SERVERS[1].id:
        case MCP_SERVERS[2].id: {
          const server = MCP_SERVERS.find((s) => s.id === node.id);
          if (server) {
            setSelectedDetail({
              title: server.name,
              description: server.description,
              extra: `Capabilities: ${server.capabilities.join(", ")}`,
            });
          }
          break;
        }
        case "source-db":
        case "source-api":
        case "source-fs":
          setSelectedDetail({
            title: "Data Source",
            description:
              "The underlying system that the MCP server connects to. The server abstracts the data source behind a standard protocol interface.",
          });
          break;
        default:
          setSelectedDetail(null);
      }
    },
    [],
  );

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="h-[340px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Detail panel */}
      {selectedDetail && (
        <div className="mt-3 rounded-lg border bg-muted/50 p-3 transition-all">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">{selectedDetail.title}</h4>
            <button
              onClick={() => setSelectedDetail(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {selectedDetail.description}
          </p>
          {selectedDetail.extra && (
            <p className="mt-1 text-xs font-medium text-primary">
              {selectedDetail.extra}
            </p>
          )}
        </div>
      )}

      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        Click any node to see details
      </p>
    </div>
  );
}
