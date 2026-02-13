import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import type { KGNode, KGEdge, KGNodeType } from "@/data/mock-knowledge-graph";
import { NODE_TYPE_COLORS } from "@/data/mock-knowledge-graph";

interface GraphExplorerProps {
  nodes: KGNode[];
  edges: KGEdge[];
  className?: string;
}

const NODE_RADIUS = 20;
const STAGGER_DELAY = 0.06;
const ANIMATION_DURATION = 0.4;

/** Compute the midpoint of an edge for its label placement */
function edgeMidpoint(
  source: KGNode,
  target: KGNode,
): { x: number; y: number } {
  return {
    x: (source.x + target.x) / 2,
    y: (source.y + target.y) / 2,
  };
}

/**
 * Interactive SVG knowledge graph explorer.
 * Click a node to select it and highlight its direct connections.
 * Use the search input to filter/highlight nodes by label.
 */
export function GraphExplorer({ nodes, edges, className }: GraphExplorerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Fullscreen stepper: cycle through nodes by index
  const selectedNodeIndex = selectedNodeId
    ? nodes.findIndex((n) => n.id === selectedNodeId)
    : -1;
  const setNodeByIndex = useCallback(
    (i: number) => {
      setSelectedNodeId(nodes[i].id);
      setSearchQuery("");
    },
    [nodes],
  );
  useFullscreenStepper(
    selectedNodeIndex === -1 ? 0 : selectedNodeIndex,
    nodes.length,
    setNodeByIndex,
  );

  /** Set of node IDs that match the current search query */
  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      nodes
        .filter(
          (n) =>
            n.label.toLowerCase().includes(q) ||
            n.type.toLowerCase().includes(q),
        )
        .map((n) => n.id),
    );
  }, [nodes, searchQuery]);

  /** Set of node IDs directly connected to the selected node */
  const neighborIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const ids = new Set<string>();
    for (const edge of edges) {
      if (edge.source === selectedNodeId) ids.add(edge.target);
      if (edge.target === selectedNodeId) ids.add(edge.source);
    }
    return ids;
  }, [selectedNodeId, edges]);

  /** Whether a given node should be visually highlighted */
  const isNodeHighlighted = useCallback(
    (nodeId: string): boolean => {
      if (searchQuery.trim()) return searchMatchIds.has(nodeId);
      if (!selectedNodeId) return true;
      return nodeId === selectedNodeId || neighborIds.has(nodeId);
    },
    [selectedNodeId, neighborIds, searchQuery, searchMatchIds],
  );

  /** Whether a given edge should be visually highlighted */
  const isEdgeHighlighted = useCallback(
    (edge: KGEdge): boolean => {
      if (searchQuery.trim()) {
        return searchMatchIds.has(edge.source) && searchMatchIds.has(edge.target);
      }
      if (!selectedNodeId) return true;
      return (
        (edge.source === selectedNodeId && neighborIds.has(edge.target)) ||
        (edge.target === selectedNodeId && neighborIds.has(edge.source))
      );
    },
    [selectedNodeId, neighborIds, searchQuery, searchMatchIds],
  );

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
      setSearchQuery("");
    },
    [],
  );

  const hoveredNode = hoveredNodeId
    ? nodes.find((n) => n.id === hoveredNodeId) ?? null
    : null;

  /** Build lookup map for nodes by id */
  const nodeMap = useMemo(() => {
    const map = new Map<string, KGNode>();
    for (const node of nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [nodes]);

  const hasActiveFilter = !!selectedNodeId || !!searchQuery.trim();

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedNodeId(null);
          }}
          placeholder="Search nodes by name or type..."
          className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {(Object.entries(NODE_TYPE_COLORS) as [KGNodeType, (typeof NODE_TYPE_COLORS)[KGNodeType]][]).map(
          ([type, colors]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: colors.fill }}
              />
              <span className="capitalize text-muted-foreground">
                {colors.label}
              </span>
            </div>
          ),
        )}
      </div>

      {/* SVG graph */}
      <div className="relative overflow-hidden rounded-lg border bg-background">
        <svg viewBox="0 0 600 400" className="h-auto w-full">
          {/* Edges */}
          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const highlighted = isEdgeHighlighted(edge);
            const mid = edgeMidpoint(source, target);

            return (
              <g key={`${edge.source}-${edge.target}-${edge.label}`}>
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: hasActiveFilter ? (highlighted ? 1 : 0.12) : 0.5,
                  }}
                  transition={{ duration: 0.5 }}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={highlighted ? "#94a3b8" : "#cbd5e1"}
                  strokeWidth={highlighted && hasActiveFilter ? 2 : 1}
                />
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hasActiveFilter ? (highlighted ? 0.9 : 0.1) : 0.6,
                  }}
                  transition={{ duration: 0.3 }}
                  x={mid.x}
                  y={mid.y - 4}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {edge.label}
                </motion.text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, index) => {
            const colors = NODE_TYPE_COLORS[node.type];
            const highlighted = isNodeHighlighted(node.id);
            const isSelected = node.id === selectedNodeId;

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: hasActiveFilter ? (highlighted ? 1 : 0.2) : 1,
                }}
                transition={{
                  delay: index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                className="cursor-pointer"
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Selection ring */}
                {isSelected && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS + 4}
                    fill="none"
                    stroke={colors.fill}
                    strokeWidth={2}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={1.5}
                  opacity={hasActiveFilter && !highlighted ? 0.3 : 1}
                />

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + NODE_RADIUS + 12}
                  textAnchor="middle"
                  className="fill-foreground text-[11px] font-medium"
                  opacity={hasActiveFilter && !highlighted ? 0.3 : 1}
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip on hover */}
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-4 bottom-4 rounded-lg border bg-popover px-3 py-2 shadow-md"
          >
            <p className="text-xs font-semibold">{hoveredNode.label}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {hoveredNode.type}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hoveredNode.description}
            </p>
          </motion.div>
        )}
      </div>

      {/* Selection info */}
      {selectedNodeId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-muted-foreground"
        >
          Showing connections for{" "}
          <strong>
            {nodeMap.get(selectedNodeId)?.label ?? selectedNodeId}
          </strong>
          . Click again to deselect.
        </motion.p>
      )}
    </div>
  );
}
