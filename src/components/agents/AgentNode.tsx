import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import { User, Brain, Database, BarChart3, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/types/agent.types";

/** Data shape for the custom AgentNode */
export interface AgentNodeData {
  agentId: string;
  label: string;
  role: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  status: AgentStatus;
  [key: string]: unknown;
}

export type AgentNodeType = Node<AgentNodeData, "agentNode">;

const STATUS_BADGE_STYLES: Record<AgentStatus, { bg: string; text: string; label: string }> = {
  idle: { bg: "bg-gray-100", text: "text-gray-500", label: "Idle" },
  working: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Working" },
  done: { bg: "bg-green-100", text: "text-green-700", label: "Done" },
  error: { bg: "bg-red-100", text: "text-red-700", label: "Error" },
};

const ICON_MAP: Record<string, typeof Brain> = {
  "data-analyst": Brain,
  "data-engineer": Database,
  "reporting-agent": BarChart3,
  user: User,
};

const NODE_ICON_SIZE = "h-6 w-6";
const CIRCLE_SIZE = "h-14 w-14";

/**
 * Custom React Flow node representing an agent.
 * Shows a colored circle with icon, name, and status badge.
 * Memoized for React Flow performance.
 */
function AgentNodeComponent({ data }: NodeProps<AgentNodeType>) {
  const { agentId, label, role, bgColor, textColor, borderColor, status } = data;
  const statusInfo = STATUS_BADGE_STYLES[status];
  const Icon = ICON_MAP[agentId] ?? User;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top handle for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-border !w-2 !h-2"
      />

      {/* Agent circle */}
      <div
        className={cn(
          CIRCLE_SIZE,
          "flex items-center justify-center rounded-full border-2 transition-all duration-300",
          bgColor,
          textColor,
          borderColor,
          status === "working" && "animate-pulse ring-2 ring-yellow-400 ring-offset-2",
        )}
      >
        {status === "done" ? (
          <Check className={NODE_ICON_SIZE} />
        ) : (
          <Icon className={NODE_ICON_SIZE} />
        )}
      </div>

      {/* Name and role */}
      <div className="text-center">
        <div className="text-sm font-semibold leading-tight">{label}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>

      {/* Status badge */}
      <div
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
          statusInfo.bg,
          statusInfo.text,
        )}
      >
        {statusInfo.label}
      </div>

      {/* Bottom handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-border !w-2 !h-2"
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
