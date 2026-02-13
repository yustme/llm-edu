import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import { Database, Globe, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MCPServerType } from "@/config/mcp.config";
import { MCP_SERVER_COLORS } from "@/config/mcp.config";

/** Data shape for the custom MCPServerNode */
export interface MCPServerNodeData {
  serverId: string;
  label: string;
  version: string;
  serverType: MCPServerType;
  capabilities: string[];
  [key: string]: unknown;
}

export type MCPServerNodeType = Node<MCPServerNodeData, "mcpServerNode">;

const ICON_MAP: Record<MCPServerType, typeof Database> = {
  database: Database,
  api: Globe,
  file: FileText,
};

const NODE_ICON_SIZE = "h-5 w-5";

/**
 * Custom React Flow node for MCP servers.
 * Shows server icon, name, version, and capability badges.
 * Color-coded by server type (DB=blue, API=green, File=amber).
 */
function MCPServerNodeComponent({ data }: NodeProps<MCPServerNodeType>) {
  const { label, version, serverType, capabilities } = data;
  const colors = MCP_SERVER_COLORS[serverType];
  const Icon = ICON_MAP[serverType];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-lg border-2 bg-white px-4 py-3 shadow-sm transition-all duration-200",
        colors.border,
      )}
    >
      {/* Input handle for receiving connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-border !w-2 !h-2"
      />

      {/* Server icon and name */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md",
            colors.bg,
          )}
        >
          <Icon className={cn(NODE_ICON_SIZE, colors.text)} />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">{label}</div>
          <div className="text-xs text-muted-foreground">v{version}</div>
        </div>
      </div>

      {/* Capability badges */}
      <div className="flex flex-wrap gap-1">
        {capabilities.map((cap) => (
          <span
            key={cap}
            className={cn(
              "rounded px-1.5 py-0.5 text-[11px] font-medium",
              colors.badgeBg,
              colors.badgeText,
            )}
          >
            {cap}
          </span>
        ))}
      </div>

      {/* Output handle for data source connections */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-border !w-2 !h-2"
      />
    </div>
  );
}

export const MCPServerNode = memo(MCPServerNodeComponent);
