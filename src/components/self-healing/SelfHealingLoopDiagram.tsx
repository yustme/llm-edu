import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Configuration for the loop diagram */
const DIAGRAM_SIZE = 380;
const NODE_WIDTH = 100;
const NODE_HEIGHT = 44;
const CIRCLE_RADIUS = 130;
const CENTER_X = DIAGRAM_SIZE / 2;
const CENTER_Y = DIAGRAM_SIZE / 2;

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;
const PATH_ANIMATION_DURATION = 0.6;

/** Node definitions for the self-healing cycle */
const LOOP_NODES = [
  { id: "generate", label: "Generate", angle: -90 },
  { id: "execute", label: "Execute", angle: -18 },
  { id: "error", label: "Error?", angle: 54 },
  { id: "analyze", label: "Analyze", angle: 126 },
  { id: "fix", label: "Fix", angle: 198 },
] as const;

/** Color mapping for each node */
const NODE_COLORS: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
  generate: { bg: "fill-blue-50", border: "stroke-blue-400", text: "fill-blue-700", activeBg: "fill-blue-200" },
  execute: { bg: "fill-green-50", border: "stroke-green-400", text: "fill-green-700", activeBg: "fill-green-200" },
  error: { bg: "fill-red-50", border: "stroke-red-400", text: "fill-red-700", activeBg: "fill-red-200" },
  analyze: { bg: "fill-amber-50", border: "stroke-amber-400", text: "fill-amber-700", activeBg: "fill-amber-200" },
  fix: { bg: "fill-purple-50", border: "stroke-purple-400", text: "fill-purple-700", activeBg: "fill-purple-200" },
};

interface SelfHealingLoopDiagramProps {
  /** Index of the currently active node (0-4), or undefined for none */
  activeStep?: number;
  /** Current attempt number to display */
  attempt?: number;
  /** Maximum attempts to display */
  maxAttempts?: number;
  className?: string;
}

/** Calculate node position from angle */
function getNodePosition(angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER_X + CIRCLE_RADIUS * Math.cos(angleRad),
    y: CENTER_Y + CIRCLE_RADIUS * Math.sin(angleRad),
  };
}

/** Build the circular path between nodes */
function buildArcPath(): string {
  const points = LOOP_NODES.map((node) => getNodePosition(node.angle));
  const segments = points.map((point, i) => {
    return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
  });
  // Close the loop back to the first point
  segments.push(`L ${points[0].x} ${points[0].y}`);
  return segments.join(" ");
}

/**
 * Circular SVG loop diagram showing the self-healing cycle:
 * Generate -> Execute -> Error? -> Analyze -> Fix -> (back to Generate)
 */
export function SelfHealingLoopDiagram({
  activeStep,
  attempt = 1,
  maxAttempts = 3,
  className,
}: SelfHealingLoopDiagramProps) {
  const arcPath = buildArcPath();

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Attempt counter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        className="flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium"
      >
        <span className="text-muted-foreground">Attempt</span>
        <span className="text-primary font-bold">
          {attempt}/{maxAttempts}
        </span>
      </motion.div>

      {/* SVG Diagram */}
      <svg
        viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
        className="w-full max-w-[380px]"
      >
        {/* Background circular path (dashed) */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray="6 4"
          className="text-border"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: PATH_ANIMATION_DURATION * 2, ease: "easeInOut" }}
        />

        {/* Animated progress path */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: activeStep !== undefined ? (activeStep + 1) / LOOP_NODES.length : 0 }}
          transition={{ duration: PATH_ANIMATION_DURATION, ease: "easeInOut" }}
        />

        {/* Arrow markers between nodes */}
        {LOOP_NODES.map((node, i) => {
          const from = getNodePosition(node.angle);
          const next = LOOP_NODES[(i + 1) % LOOP_NODES.length];
          const to = getNodePosition(next.angle);

          // Midpoint for the arrow
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          // Direction angle for the arrowhead
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const arrowAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

          return (
            <motion.polygon
              key={`arrow-${node.id}`}
              points="-5,-4 5,0 -5,4"
              className="fill-muted-foreground"
              transform={`translate(${midX}, ${midY}) rotate(${arrowAngle})`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{
                delay: STAGGER_DELAY * (i + LOOP_NODES.length),
                duration: ANIMATION_DURATION,
              }}
            />
          );
        })}

        {/* Nodes */}
        {LOOP_NODES.map((node, index) => {
          const pos = getNodePosition(node.angle);
          const colors = NODE_COLORS[node.id];
          const isActive = activeStep === index;

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
                type: "spring",
                stiffness: 200,
              }}
            >
              {/* Node background rect */}
              <rect
                x={pos.x - NODE_WIDTH / 2}
                y={pos.y - NODE_HEIGHT / 2}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={10}
                ry={10}
                className={cn(
                  isActive ? colors.activeBg : colors.bg,
                  colors.border,
                )}
                strokeWidth={isActive ? 3 : 2}
              />

              {/* Active pulse ring */}
              {isActive && (
                <motion.rect
                  x={pos.x - NODE_WIDTH / 2 - 4}
                  y={pos.y - NODE_HEIGHT / 2 - 4}
                  width={NODE_WIDTH + 8}
                  height={NODE_HEIGHT + 8}
                  rx={14}
                  ry={14}
                  fill="none"
                  className={colors.border}
                  strokeWidth={2}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                className={cn("text-xs font-semibold", colors.text)}
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        {LOOP_NODES.map((node, index) => (
          <motion.span
            key={node.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: ANIMATION_DURATION }}
            className={cn(
              "rounded px-2 py-0.5",
              activeStep === index && "bg-primary/10 text-primary font-medium",
            )}
          >
            {index + 1}. {node.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
