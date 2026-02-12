import { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AgentNode, type AgentNodeType } from "./AgentNode";
import { MessageEdge, type MessageEdgeType } from "./MessageEdge";
import { AGENTS, USER_COLOR, WORKFLOW_LAYOUT } from "@/config/multi-agent.config";
import { ACTOR, getActorDisplayName } from "@/data/mock-multi-agent";
import type { SimulationStep } from "@/types/agent.types";
import type { AgentStatus } from "@/types/agent.types";

interface AgentWorkflowProps {
  /** All simulation steps */
  messages: SimulationStep[];
  /** Index of the currently active message (-1 for none / static view) */
  activeMessageIndex: number;
  className?: string;
}

/** Node types registry for React Flow */
const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
};

/** Edge types registry for React Flow */
const edgeTypes: EdgeTypes = {
  messageEdge: MessageEdge,
};

/** Map actor IDs to their accent colors */
function getActorColor(actorId: string): string {
  if (actorId === ACTOR.user) return USER_COLOR.accent;
  const agent = AGENTS[actorId];
  return agent?.color.accent ?? "#94a3b8";
}

/**
 * Determine each agent's status based on which messages are visible
 * and which message is currently active.
 */
function computeAgentStatuses(
  messages: SimulationStep[],
  activeIndex: number,
): Record<string, AgentStatus> {
  const statuses: Record<string, AgentStatus> = {
    user: "idle",
    "data-analyst": "idle",
    "data-engineer": "idle",
    "reporting-agent": "idle",
  };

  if (activeIndex < 0) return statuses;

  // All agents that have appeared in visible steps up to activeIndex get "done"
  const visibleMessages = messages.slice(0, activeIndex + 1);
  const appearedActors = new Set<string>();

  for (const msg of visibleMessages) {
    appearedActors.add(msg.actor);
  }

  // Mark agents that have appeared as done
  for (const actor of appearedActors) {
    if (actor in statuses) {
      statuses[actor] = "done";
    }
  }

  // The current active message's actor is "working"
  const currentMsg = messages[activeIndex];
  if (currentMsg && currentMsg.actor in statuses) {
    statuses[currentMsg.actor] = "working";
  }

  return statuses;
}

/**
 * Find the active edge based on the current message.
 * Returns the edge ID that should be highlighted, or null.
 */
function getActiveEdgeInfo(
  messages: SimulationStep[],
  activeIndex: number,
): { edgeId: string | null; label: string | null; color: string } {
  if (activeIndex < 0)
    return { edgeId: null, label: null, color: "#94a3b8" };

  const msg = messages[activeIndex];
  if (!msg) return { edgeId: null, label: null, color: "#94a3b8" };

  const from = (msg.metadata?.from as string) ?? msg.actor;
  const to = (msg.metadata?.to as string) ?? null;
  const color = getActorColor(from);

  if (to) {
    const edgeId = `edge-${from}-${to}`;
    const label =
      msg.type === "agent-message"
        ? msg.content.slice(0, 40) + (msg.content.length > 40 ? "..." : "")
        : getActorDisplayName(from);
    return { edgeId, label, color };
  }

  return { edgeId: null, label: null, color };
}

/**
 * Complete React Flow diagram showing agents and their communication edges.
 * Nodes change status based on which agent is currently active.
 */
export function AgentWorkflow({
  messages,
  activeMessageIndex,
  className,
}: AgentWorkflowProps) {
  const agentStatuses = useMemo(
    () => computeAgentStatuses(messages, activeMessageIndex),
    [messages, activeMessageIndex],
  );

  const activeEdge = useMemo(
    () => getActiveEdgeInfo(messages, activeMessageIndex),
    [messages, activeMessageIndex],
  );

  const nodes: AgentNodeType[] = useMemo(
    () => [
      {
        id: "user",
        type: "agentNode",
        position: WORKFLOW_LAYOUT.user,
        data: {
          agentId: "user",
          label: "User",
          role: "Requester",
          color: USER_COLOR.accent,
          bgColor: USER_COLOR.bg,
          textColor: USER_COLOR.text,
          borderColor: USER_COLOR.border,
          status: agentStatuses.user,
        },
      },
      {
        id: "data-analyst",
        type: "agentNode",
        position: WORKFLOW_LAYOUT["data-analyst"],
        data: {
          agentId: "data-analyst",
          label: AGENTS["data-analyst"].name,
          role: AGENTS["data-analyst"].role,
          color: AGENTS["data-analyst"].color.accent,
          bgColor: AGENTS["data-analyst"].color.bg,
          textColor: AGENTS["data-analyst"].color.text,
          borderColor: AGENTS["data-analyst"].color.border,
          status: agentStatuses["data-analyst"],
        },
      },
      {
        id: "data-engineer",
        type: "agentNode",
        position: WORKFLOW_LAYOUT["data-engineer"],
        data: {
          agentId: "data-engineer",
          label: AGENTS["data-engineer"].name,
          role: AGENTS["data-engineer"].role,
          color: AGENTS["data-engineer"].color.accent,
          bgColor: AGENTS["data-engineer"].color.bg,
          textColor: AGENTS["data-engineer"].color.text,
          borderColor: AGENTS["data-engineer"].color.border,
          status: agentStatuses["data-engineer"],
        },
      },
      {
        id: "reporting-agent",
        type: "agentNode",
        position: WORKFLOW_LAYOUT["reporting-agent"],
        data: {
          agentId: "reporting-agent",
          label: AGENTS["reporting-agent"].name,
          role: AGENTS["reporting-agent"].role,
          color: AGENTS["reporting-agent"].color.accent,
          bgColor: AGENTS["reporting-agent"].color.bg,
          textColor: AGENTS["reporting-agent"].color.text,
          borderColor: AGENTS["reporting-agent"].color.border,
          status: agentStatuses["reporting-agent"],
        },
      },
    ],
    [agentStatuses],
  );

  const edges: MessageEdgeType[] = useMemo(
    () => [
      // User -> Data Analyst
      {
        id: `edge-${ACTOR.user}-${ACTOR.dataAnalyst}`,
        source: "user",
        target: "data-analyst",
        type: "messageEdge",
        data: {
          color: getActorColor(ACTOR.user),
          isActive: activeEdge.edgeId === `edge-${ACTOR.user}-${ACTOR.dataAnalyst}`,
          label:
            activeEdge.edgeId === `edge-${ACTOR.user}-${ACTOR.dataAnalyst}`
              ? activeEdge.label ?? undefined
              : undefined,
        },
      },
      // Data Analyst -> Data Engineer
      {
        id: `edge-${ACTOR.dataAnalyst}-${ACTOR.dataEngineer}`,
        source: "data-analyst",
        target: "data-engineer",
        type: "messageEdge",
        data: {
          color: getActorColor(ACTOR.dataAnalyst),
          isActive:
            activeEdge.edgeId === `edge-${ACTOR.dataAnalyst}-${ACTOR.dataEngineer}`,
          label:
            activeEdge.edgeId === `edge-${ACTOR.dataAnalyst}-${ACTOR.dataEngineer}`
              ? activeEdge.label ?? undefined
              : undefined,
        },
      },
      // Data Engineer -> Data Analyst
      {
        id: `edge-${ACTOR.dataEngineer}-${ACTOR.dataAnalyst}`,
        source: "data-engineer",
        target: "data-analyst",
        type: "messageEdge",
        data: {
          color: getActorColor(ACTOR.dataEngineer),
          isActive:
            activeEdge.edgeId === `edge-${ACTOR.dataEngineer}-${ACTOR.dataAnalyst}`,
          label:
            activeEdge.edgeId === `edge-${ACTOR.dataEngineer}-${ACTOR.dataAnalyst}`
              ? activeEdge.label ?? undefined
              : undefined,
        },
      },
      // Data Analyst -> Reporting Agent
      {
        id: `edge-${ACTOR.dataAnalyst}-${ACTOR.reportingAgent}`,
        source: "data-analyst",
        target: "reporting-agent",
        type: "messageEdge",
        data: {
          color: getActorColor(ACTOR.dataAnalyst),
          isActive:
            activeEdge.edgeId === `edge-${ACTOR.dataAnalyst}-${ACTOR.reportingAgent}`,
          label:
            activeEdge.edgeId === `edge-${ACTOR.dataAnalyst}-${ACTOR.reportingAgent}`
              ? activeEdge.label ?? undefined
              : undefined,
        },
      },
      // Reporting Agent -> User
      {
        id: `edge-${ACTOR.reportingAgent}-${ACTOR.user}`,
        source: "reporting-agent",
        target: "user",
        type: "messageEdge",
        data: {
          color: getActorColor(ACTOR.reportingAgent),
          isActive:
            activeEdge.edgeId === `edge-${ACTOR.reportingAgent}-${ACTOR.user}`,
          label:
            activeEdge.edgeId === `edge-${ACTOR.reportingAgent}-${ACTOR.user}`
              ? activeEdge.label ?? undefined
              : undefined,
        },
      },
    ],
    [activeEdge],
  );

  const onInit = useCallback(() => {
    // React Flow initialized
  }, []);

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
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
  );
}
