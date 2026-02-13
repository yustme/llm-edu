import { memo } from "react";
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
  type Edge,
} from "@xyflow/react";

/** Data shape for the custom MessageEdge */
export interface MessageEdgeData {
  color: string;
  label?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

export type MessageEdgeType = Edge<MessageEdgeData, "messageEdge">;

const ACTIVE_STROKE_WIDTH = 2.5;
const INACTIVE_STROKE_WIDTH = 1.5;
const LABEL_FONT_SIZE = 12;
const LABEL_MAX_WIDTH = 140;
const DASH_PATTERN = "6 4";

/**
 * Custom React Flow edge with animated dashed line.
 * When active, shows a small message preview label.
 * Color matches the sender agent.
 */
function MessageEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
}: EdgeProps<MessageEdgeType>) {
  const color = data?.color ?? "#94a3b8";
  const isActive = data?.isActive ?? false;
  const label = data?.label;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      {/* Base edge with animation */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: color,
          strokeWidth: isActive ? ACTIVE_STROKE_WIDTH : INACTIVE_STROKE_WIDTH,
          strokeDasharray: DASH_PATTERN,
          opacity: isActive ? 1 : 0.5,
          transition: "stroke-width 0.3s, opacity 0.3s",
        }}
      />

      {/* Animated dash movement */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={isActive ? ACTIVE_STROKE_WIDTH : INACTIVE_STROKE_WIDTH}
        strokeDasharray={DASH_PATTERN}
        opacity={isActive ? 1 : 0.3}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="20"
          to="0"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>

      {/* Message label (only when active and has label) */}
      {isActive && label && (
        <foreignObject
          x={labelX - LABEL_MAX_WIDTH / 2}
          y={labelY - 14}
          width={LABEL_MAX_WIDTH}
          height={28}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            style={{
              backgroundColor: color,
              fontSize: LABEL_FONT_SIZE,
              maxWidth: LABEL_MAX_WIDTH,
            }}
            className="truncate rounded-full px-2 py-1 text-center text-white shadow-md"
          >
            {label}
          </div>
        </foreignObject>
      )}
    </>
  );
}

export const MessageEdge = memo(MessageEdgeComponent);
