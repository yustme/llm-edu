import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { KGNode, KGEdge, QueryExample } from "@/data/mock-knowledge-graph";
import { NODE_TYPE_COLORS } from "@/data/mock-knowledge-graph";

interface QueryTraversalProps {
  nodes: KGNode[];
  edges: KGEdge[];
  query: QueryExample;
  className?: string;
}

const NODE_RADIUS = 22;
const STEP_DELAY_MS = 800;

/**
 * Animated graph query traversal.
 * Highlights nodes and edges sequentially along a query path,
 * then reveals the answer.
 */
export function QueryTraversal({
  nodes,
  edges,
  query,
  className,
}: QueryTraversalProps) {
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  /** Only show nodes that appear in the query path or are connected to path nodes */
  const relevantNodeIds = useMemo(() => {
    const ids = new Set(query.path);
    for (const edge of edges) {
      if (ids.has(edge.source) || ids.has(edge.target)) {
        ids.add(edge.source);
        ids.add(edge.target);
      }
    }
    return ids;
  }, [query.path, edges]);

  const filteredNodes = useMemo(
    () => nodes.filter((n) => relevantNodeIds.has(n.id)),
    [nodes, relevantNodeIds],
  );

  const filteredEdges = useMemo(
    () =>
      edges.filter(
        (e) => relevantNodeIds.has(e.source) && relevantNodeIds.has(e.target),
      ),
    [edges, relevantNodeIds],
  );

  const nodeMap = useMemo(() => {
    const map = new Map<string, KGNode>();
    for (const node of filteredNodes) {
      map.set(node.id, node);
    }
    return map;
  }, [filteredNodes]);

  /** Set of node IDs that have been visited so far */
  const visitedNodeIds = useMemo(() => {
    if (activeStep < 0) return new Set<string>();
    return new Set(query.path.slice(0, activeStep + 1));
  }, [query.path, activeStep]);

  /** Set of edge keys that have been traversed so far */
  const traversedEdgeKeys = useMemo(() => {
    const keys = new Set<string>();
    for (let i = 0; i < activeStep && i < query.path.length - 1; i++) {
      const a = query.path[i];
      const b = query.path[i + 1];
      keys.add(`${a}-${b}`);
      keys.add(`${b}-${a}`);
    }
    return keys;
  }, [query.path, activeStep]);

  const isEdgeTraversed = useCallback(
    (edge: KGEdge): boolean => {
      return (
        traversedEdgeKeys.has(`${edge.source}-${edge.target}`) ||
        traversedEdgeKeys.has(`${edge.target}-${edge.source}`)
      );
    },
    [traversedEdgeKeys],
  );

  /** Play the traversal animation */
  const play = useCallback(() => {
    setActiveStep(-1);
    setShowAnswer(false);
    setIsPlaying(true);
  }, []);

  const reset = useCallback(() => {
    setActiveStep(-1);
    setShowAnswer(false);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const totalSteps = query.path.length;

    const timer = setTimeout(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          setIsPlaying(false);
          setShowAnswer(true);
          return prev;
        }
        return next;
      });
    }, STEP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, query.path.length]);

  const hasStarted = activeStep >= 0 || showAnswer;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Query text and controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Query ({query.type.replace("-", " ")})
          </p>
          <p className="text-sm font-semibold text-foreground">
            {query.question}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={!hasStarted}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
          <Button size="sm" onClick={play} disabled={isPlaying}>
            <Play className="mr-1 h-3 w-3" />
            Run
          </Button>
        </div>
      </div>

      {/* SVG graph with traversal */}
      <div className="overflow-hidden rounded-lg border bg-background">
        <svg viewBox="0 0 600 400" className="h-auto w-full">
          {/* Edges */}
          {filteredEdges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const traversed = isEdgeTraversed(edge);

            return (
              <g key={`${edge.source}-${edge.target}-${edge.label}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={traversed ? "#3b82f6" : "#cbd5e1"}
                  strokeWidth={traversed ? 2.5 : 1}
                  opacity={traversed ? 1 : 0.4}
                />
                <text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2 - 5}
                  textAnchor="middle"
                  className={cn(
                    "text-[10px]",
                    traversed
                      ? "fill-blue-500 font-medium"
                      : "fill-muted-foreground",
                  )}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => {
            const colors = NODE_TYPE_COLORS[node.type];
            const isVisited = visitedNodeIds.has(node.id);
            const isCurrentStep =
              activeStep >= 0 && query.path[activeStep] === node.id;

            return (
              <g key={node.id}>
                {/* Pulse ring for current step */}
                {isCurrentStep && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS + 6}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 0.3, 0.8],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                    style={{
                      transformOrigin: `${node.x}px ${node.y}px`,
                    }}
                  />
                )}

                {/* Visited ring */}
                {isVisited && !isCurrentStep && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS + 3}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={isVisited ? colors.fill : `${colors.fill}66`}
                  stroke={colors.stroke}
                  strokeWidth={1.5}
                  opacity={isVisited ? 1 : 0.5}
                />

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + NODE_RADIUS + 14}
                  textAnchor="middle"
                  className="fill-foreground text-[11px] font-medium"
                  opacity={isVisited ? 1 : 0.5}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal path indicator */}
      <div className="flex items-center justify-center gap-1 text-xs">
        {query.path.map((nodeId, i) => {
          const visited = i <= activeStep;
          const nodeLabel =
            nodeMap.get(nodeId)?.label ?? nodeId;
          return (
            <span key={`${nodeId}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-muted-foreground">
                  --{query.edgeLabels[i - 1]}--&gt;
                </span>
              )}
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-medium transition-colors",
                  visited
                    ? "bg-blue-100 text-blue-700"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {nodeLabel}
              </span>
            </span>
          );
        })}
      </div>

      {/* Answer */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950"
          >
            <p className="text-xs font-medium text-green-700 dark:text-green-300">
              Answer
            </p>
            <p className="text-sm text-green-900 dark:text-green-100">
              {query.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
