import type { JSX } from "react";
import { useState, useCallback, useRef } from "react";
import { motion, animate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { VECTOR_PRESETS } from "@/data/mock-similarity";
import type { Vector2D } from "@/data/mock-similarity";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** SVG viewBox dimensions */
const SVG_SIZE = 400;
/** Origin point at center of SVG */
const ORIGIN = SVG_SIZE / 2;
/** Maximum distance from origin for vector tips */
const MAX_RADIUS = 150;
/** Radius of the draggable handle circle */
const HANDLE_RADIUS = 12;
/** Grid line spacing in pixels */
const GRID_SPACING = 40;
/** Number of decimal places for displayed values */
const DISPLAY_DECIMALS = 4;

/** Vector colors */
const VECTOR_A_COLOR = "#3b82f6";
const VECTOR_B_COLOR = "#f97316";

/** Similarity color thresholds */
const HIGH_THRESHOLD = 0.5;
const LOW_THRESHOLD = 0;

/** Similarity indicator colors */
const SIMILARITY_COLORS = {
  high: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  low: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
} as const;

/** Arrow marker size */
const ARROW_SIZE = 8;

/** Arc radius for angle indicator */
const ARC_RADIUS = 35;

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

function dotProduct(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function cosineSimilarity(a: Vector2D, b: Vector2D): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

function angleBetween(a: Vector2D, b: Vector2D): number {
  const cos = cosineSimilarity(a, b);
  const clamped = Math.max(-1, Math.min(1, cos));
  return Math.acos(clamped) * (180 / Math.PI);
}

/** Constrain a point to lie within a circle of given radius from the origin */
function constrainToRadius(x: number, y: number, radius: number): Vector2D {
  const dist = Math.sqrt(x * x + y * y);
  if (dist <= radius) return { x, y };
  return { x: (x / dist) * radius, y: (y / dist) * radius };
}

/** Get the angle of a vector in radians (atan2) */
function vectorAngle(v: Vector2D): number {
  return Math.atan2(v.y, v.x);
}

/** Build an SVG arc path between two angles at a given radius */
function arcPath(
  angleStart: number,
  angleEnd: number,
  radius: number,
): string {
  // Ensure we draw the smaller arc
  let start = angleStart;
  let end = angleEnd;
  let diff = end - start;
  if (diff > Math.PI) end -= 2 * Math.PI;
  else if (diff < -Math.PI) end += 2 * Math.PI;
  diff = end - start;

  const startX = ORIGIN + radius * Math.cos(start);
  const startY = ORIGIN + radius * Math.sin(start);
  const endX = ORIGIN + radius * Math.cos(end);
  const endY = ORIGIN + radius * Math.sin(end);
  const largeArc = Math.abs(diff) > Math.PI ? 1 : 0;
  const sweep = diff > 0 ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${endX} ${endY}`;
}

function getSimilarityColor(similarity: number) {
  if (similarity >= HIGH_THRESHOLD) return SIMILARITY_COLORS.high;
  if (similarity >= LOW_THRESHOLD) return SIMILARITY_COLORS.medium;
  return SIMILARITY_COLORS.low;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CosineSimilarityDemoProps {
  className?: string;
}

/**
 * Interactive 2D vector visualization with draggable tips.
 * Shows real-time cosine similarity calculation between two vectors.
 */
export function CosineSimilarityDemo({ className }: CosineSimilarityDemoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [vectorA, setVectorA] = useState<Vector2D>({ x: 100, y: -60 });
  const [vectorB, setVectorB] = useState<Vector2D>({ x: 40, y: -120 });
  const [dragging, setDragging] = useState<"A" | "B" | null>(null);

  // Motion values for smooth preset transitions
  const motionAx = useMotionValue(vectorA.x);
  const motionAy = useMotionValue(vectorA.y);
  const motionBx = useMotionValue(vectorB.x);
  const motionBy = useMotionValue(vectorB.y);

  const cosine = cosineSimilarity(vectorA, vectorB);
  const angle = angleBetween(vectorA, vectorB);
  const dot = dotProduct(vectorA, vectorB);
  const magA = magnitude(vectorA);
  const magB = magnitude(vectorB);
  const colors = getSimilarityColor(cosine);

  /** Convert pointer event to SVG-relative vector coordinates */
  const pointerToVector = useCallback(
    (e: React.PointerEvent<SVGSVGElement>): Vector2D => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      const scaleX = SVG_SIZE / rect.width;
      const scaleY = SVG_SIZE / rect.height;
      const svgX = (e.clientX - rect.left) * scaleX;
      const svgY = (e.clientY - rect.top) * scaleY;
      return constrainToRadius(svgX - ORIGIN, svgY - ORIGIN, MAX_RADIUS);
    },
    [],
  );

  const handlePointerDown = useCallback(
    (target: "A" | "B") => (e: React.PointerEvent<SVGCircleElement>) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
      setDragging(target);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const v = pointerToVector(e);
      if (dragging === "A") setVectorA(v);
      else setVectorB(v);
    },
    [dragging, pointerToVector],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  /** Animate vectors to a preset position */
  const applyPreset = useCallback(
    (preset: (typeof VECTOR_PRESETS)[number]) => {
      const duration = 0.5;
      const transition = { duration, ease: [0.4, 0, 0.2, 1] as const };

      animate(motionAx, preset.vectorA.x, {
        ...transition,
        onUpdate: (v) => setVectorA((prev) => ({ ...prev, x: v })),
      });
      animate(motionAy, preset.vectorA.y, {
        ...transition,
        onUpdate: (v) => setVectorA((prev) => ({ ...prev, y: v })),
      });
      animate(motionBx, preset.vectorB.x, {
        ...transition,
        onUpdate: (v) => setVectorB((prev) => ({ ...prev, x: v })),
      });
      animate(motionBy, preset.vectorB.y, {
        ...transition,
        onUpdate: (v) => setVectorB((prev) => ({ ...prev, y: v })),
      });
    },
    [motionAx, motionAy, motionBx, motionBy],
  );

  // Grid lines for background
  const gridLines: JSX.Element[] = [];
  for (let i = GRID_SPACING; i < SVG_SIZE; i += GRID_SPACING) {
    gridLines.push(
      <line key={`h-${i}`} x1={0} y1={i} x2={SVG_SIZE} y2={i} stroke="currentColor" className="text-border" strokeWidth={0.5} />,
      <line key={`v-${i}`} x1={i} y1={0} x2={i} y2={SVG_SIZE} stroke="currentColor" className="text-border" strokeWidth={0.5} />,
    );
  }

  // SVG coordinates for vector tips (relative to SVG origin at top-left)
  const tipA = { x: ORIGIN + vectorA.x, y: ORIGIN + vectorA.y };
  const tipB = { x: ORIGIN + vectorB.x, y: ORIGIN + vectorB.y };

  // Angle arc
  const angleA = vectorAngle(vectorA);
  const angleB = vectorAngle(vectorB);
  const arcD = arcPath(angleA, angleB, ARC_RADIUS);

  return (
    <div className={cn("space-y-4", className)}>
      {/* SVG canvas */}
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full max-w-[400px] select-none rounded-lg border bg-background"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Grid */}
          <g>{gridLines}</g>

          {/* Axis lines */}
          <line x1={0} y1={ORIGIN} x2={SVG_SIZE} y2={ORIGIN} stroke="currentColor" className="text-muted-foreground/40" strokeWidth={1} />
          <line x1={ORIGIN} y1={0} x2={ORIGIN} y2={SVG_SIZE} stroke="currentColor" className="text-muted-foreground/40" strokeWidth={1} />

          {/* Arrow markers */}
          <defs>
            <marker
              id="arrowA"
              markerWidth={ARROW_SIZE}
              markerHeight={ARROW_SIZE}
              refX={ARROW_SIZE - 1}
              refY={ARROW_SIZE / 2}
              orient="auto"
            >
              <path
                d={`M 0 0 L ${ARROW_SIZE} ${ARROW_SIZE / 2} L 0 ${ARROW_SIZE} Z`}
                fill={VECTOR_A_COLOR}
              />
            </marker>
            <marker
              id="arrowB"
              markerWidth={ARROW_SIZE}
              markerHeight={ARROW_SIZE}
              refX={ARROW_SIZE - 1}
              refY={ARROW_SIZE / 2}
              orient="auto"
            >
              <path
                d={`M 0 0 L ${ARROW_SIZE} ${ARROW_SIZE / 2} L 0 ${ARROW_SIZE} Z`}
                fill={VECTOR_B_COLOR}
              />
            </marker>
          </defs>

          {/* Angle arc between vectors */}
          <path
            d={arcD}
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/60"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />

          {/* Angle label */}
          {angle > 5 && (
            <text
              x={ORIGIN + (ARC_RADIUS + 14) * Math.cos((angleA + angleB) / 2)}
              y={ORIGIN + (ARC_RADIUS + 14) * Math.sin((angleA + angleB) / 2)}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {angle.toFixed(1)}deg
            </text>
          )}

          {/* Vector A line */}
          <line
            x1={ORIGIN}
            y1={ORIGIN}
            x2={tipA.x}
            y2={tipA.y}
            stroke={VECTOR_A_COLOR}
            strokeWidth={2.5}
            markerEnd="url(#arrowA)"
          />

          {/* Vector B line */}
          <line
            x1={ORIGIN}
            y1={ORIGIN}
            x2={tipB.x}
            y2={tipB.y}
            stroke={VECTOR_B_COLOR}
            strokeWidth={2.5}
            markerEnd="url(#arrowB)"
          />

          {/* Vector A label */}
          <text
            x={tipA.x + 8}
            y={tipA.y - 8}
            className="text-xs font-bold"
            fill={VECTOR_A_COLOR}
          >
            A
          </text>

          {/* Vector B label */}
          <text
            x={tipB.x + 8}
            y={tipB.y - 8}
            className="text-xs font-bold"
            fill={VECTOR_B_COLOR}
          >
            B
          </text>

          {/* Drag handle A */}
          <circle
            cx={tipA.x}
            cy={tipA.y}
            r={HANDLE_RADIUS}
            fill={VECTOR_A_COLOR}
            fillOpacity={dragging === "A" ? 0.5 : 0.2}
            stroke={VECTOR_A_COLOR}
            strokeWidth={2}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown("A")}
          />

          {/* Drag handle B */}
          <circle
            cx={tipB.x}
            cy={tipB.y}
            r={HANDLE_RADIUS}
            fill={VECTOR_B_COLOR}
            fillOpacity={dragging === "B" ? 0.5 : 0.2}
            stroke={VECTOR_B_COLOR}
            strokeWidth={2}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown("B")}
          />
        </svg>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground mr-1">Presets:</span>
        {VECTOR_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className="rounded-md border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Calculations display */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Cosine similarity - highlighted */}
        <motion.div
          key={cosine.toFixed(DISPLAY_DECIMALS)}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.2 }}
          className={cn(
            "col-span-2 flex items-center justify-between rounded-lg border-2 p-3 font-mono",
            colors.bg,
            colors.border,
          )}
        >
          <span className={cn("font-semibold", colors.text)}>
            Cosine Similarity
          </span>
          <span className={cn("text-lg font-bold", colors.text)}>
            {cosine.toFixed(DISPLAY_DECIMALS)}
          </span>
        </motion.div>

        <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
          <span className="text-muted-foreground">Angle</span>
          <span className="font-mono font-medium">{angle.toFixed(1)} deg</span>
        </div>
        <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
          <span className="text-muted-foreground">Dot Product</span>
          <span className="font-mono font-medium">{dot.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
          <span className="text-muted-foreground">
            ||<span className="font-bold" style={{ color: VECTOR_A_COLOR }}>A</span>||
          </span>
          <span className="font-mono font-medium">{magA.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
          <span className="text-muted-foreground">
            ||<span className="font-bold" style={{ color: VECTOR_B_COLOR }}>B</span>||
          </span>
          <span className="font-mono font-medium">{magB.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
