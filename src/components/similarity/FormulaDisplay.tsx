import { motion } from "framer-motion";
import type { Vector2D } from "@/data/mock-similarity";

const STAGGER_DELAY = 0.3;
const ANIMATION_DURATION = 0.5;

/** Number of decimal places for formula values */
const DECIMAL_PLACES = 4;

interface FormulaDisplayProps {
  vectorA: Vector2D;
  vectorB: Vector2D;
  className?: string;
}

/** Computes the dot product of two 2D vectors */
function dotProduct(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

/** Computes the magnitude (length) of a 2D vector */
function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/** Computes cosine similarity between two 2D vectors */
function cosineSimilarity(a: Vector2D, b: Vector2D): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

/**
 * Renders the cosine similarity formula with animated step-by-step
 * calculation using actual vector values.
 */
export function FormulaDisplay({
  vectorA,
  vectorB,
  className,
}: FormulaDisplayProps) {
  const dot = dotProduct(vectorA, vectorB);
  const magA = magnitude(vectorA);
  const magB = magnitude(vectorB);
  const cosine = cosineSimilarity(vectorA, vectorB);

  const steps = [
    {
      label: "Dot Product (A . B)",
      formula: `(${vectorA.x} x ${vectorB.x}) + (${vectorA.y} x ${vectorB.y})`,
      result: dot.toFixed(DECIMAL_PLACES),
    },
    {
      label: "Magnitude ||A||",
      formula: `sqrt(${vectorA.x}^2 + ${vectorA.y}^2)`,
      result: magA.toFixed(DECIMAL_PLACES),
    },
    {
      label: "Magnitude ||B||",
      formula: `sqrt(${vectorB.x}^2 + ${vectorB.y}^2)`,
      result: magB.toFixed(DECIMAL_PLACES),
    },
    {
      label: "Cosine Similarity",
      formula: `${dot.toFixed(2)} / (${magA.toFixed(2)} x ${magB.toFixed(2)})`,
      result: cosine.toFixed(DECIMAL_PLACES),
    },
  ];

  return (
    <div className={className}>
      {/* Main formula */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        className="mb-6 rounded-lg border bg-muted/30 p-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-lg font-mono">
          <span className="font-semibold text-foreground">cos(</span>
          <span className="italic text-primary">theta</span>
          <span className="font-semibold text-foreground">) =</span>
          <div className="flex flex-col items-center mx-2">
            <span className="border-b border-foreground px-2 pb-1">
              <span className="text-blue-600 font-bold">A</span>
              <span className="mx-1 text-foreground">.</span>
              <span className="text-orange-600 font-bold">B</span>
            </span>
            <span className="pt-1">
              <span className="text-foreground">||</span>
              <span className="text-blue-600 font-bold">A</span>
              <span className="text-foreground">||</span>
              <span className="mx-1 text-foreground">x</span>
              <span className="text-foreground">||</span>
              <span className="text-orange-600 font-bold">B</span>
              <span className="text-foreground">||</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Step-by-step calculation */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.4 + index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="flex items-center gap-3 rounded-md border bg-card p-3"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {step.label}
              </p>
              <p className="text-sm font-mono text-foreground/80 truncate">
                {step.formula}
              </p>
            </div>
            <div className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1">
              <span className="text-sm font-mono font-bold text-primary">
                = {step.result}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
