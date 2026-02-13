import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { GraphNode, GraphEdge } from "@/data/mock-graph-rag";
import { COMMUNITY_COLORS } from "@/data/mock-graph-rag";

const NODE_RADIUS = 22;
const LABEL_FONT_SIZE = 9;
const EDGE_LABEL_FONT_SIZE = 7;
const NODE_ANIMATION_DURATION = 0.4;
const EDGE_ANIMATION_DURATION = 0.3;
const NODE_STAGGER = 0.05;
const EDGE_STAGGER = 0.03;

/** Map node type to a distinct shape indicator letter */
const NODE_TYPE_ABBREV: Record<GraphNode["type"], string> = {
  person: "P",
  organization: "O",
  concept: "C",
  location: "L",
};

interface KnowledgeGraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Optional set of node IDs to highlight (dims non-highlighted nodes) */
  highlightedNodes?: Set<string>;
  className?: string;
}

/**
 * SVG-based knowledge graph visualization.
 * Renders pre-positioned nodes as circles with labels
 * and edges as lines with relationship labels.
 * Nodes are colored by community assignment.
 */
export function KnowledgeGraphView({
  nodes,
  edges,
  highlightedNodes,
  className,
}: KnowledgeGraphViewProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox="0 0 700 360"
      className={cn("w-full", className)}
      style={{ maxHeight: 360 }}
    >
      {/* Edges rendered first (behind nodes) */}
      {edges.map((edge, index) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;

        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        const isHighlighted =
          !highlightedNodes ||
          (highlightedNodes.has(edge.source) && highlightedNodes.has(edge.target));

        return (
          <motion.g
            key={`${edge.source}-${edge.target}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHighlighted ? 0.7 : 0.15 }}
            transition={{
              delay: nodes.length * NODE_STAGGER + index * EDGE_STAGGER,
              duration: EDGE_ANIMATION_DURATION,
            }}
          >
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            {/* Edge label background */}
            <rect
              x={midX - edge.label.length * 2.5 - 4}
              y={midY - 7}
              width={edge.label.length * 5 + 8}
              height={14}
              rx={3}
              fill="white"
              fillOpacity={0.9}
            />
            <text
              x={midX}
              y={midY + 3}
              textAnchor="middle"
              fill="#64748b"
              fontSize={EDGE_LABEL_FONT_SIZE}
              fontWeight={500}
            >
              {edge.label}
            </text>
          </motion.g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, index) => {
        const color = COMMUNITY_COLORS[node.community] ?? "#6b7280";
        const isHighlighted = !highlightedNodes || highlightedNodes.has(node.id);

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHighlighted ? 1 : 0.25,
              scale: 1,
            }}
            transition={{
              delay: index * NODE_STAGGER,
              duration: NODE_ANIMATION_DURATION,
              ease: "easeOut",
            }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill={color}
              fillOpacity={0.15}
              stroke={color}
              strokeWidth={2}
            />
            {/* Type indicator letter */}
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
              fontSize={11}
              fontWeight={700}
            >
              {NODE_TYPE_ABBREV[node.type]}
            </text>
            {/* Node label below */}
            <text
              x={node.x}
              y={node.y + NODE_RADIUS + 12}
              textAnchor="middle"
              fill="#334155"
              fontSize={LABEL_FONT_SIZE}
              fontWeight={600}
            >
              {node.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
