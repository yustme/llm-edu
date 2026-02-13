import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LatencyPhase } from "@/data/mock-optimization";

interface LatencyWaterfallProps {
  phases: LatencyPhase[];
  mode: "sequential" | "parallel";
  className?: string;
}

const ANIMATION_STAGGER = 0.12;
const ANIMATION_DURATION = 0.5;

/** Color map from phase color name to Tailwind classes */
const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-200", text: "text-blue-700", border: "border-blue-300" },
  purple: { bg: "bg-purple-200", text: "text-purple-700", border: "border-purple-300" },
  green: { bg: "bg-green-200", text: "text-green-700", border: "border-green-300" },
  amber: { bg: "bg-amber-200", text: "text-amber-700", border: "border-amber-300" },
};

/**
 * Horizontal bar chart showing latency phases.
 * Each phase is rendered as a labeled bar whose width is proportional to its duration.
 * Supports toggling between sequential and parallel modes.
 */
export function LatencyWaterfall({
  phases,
  mode,
  className,
}: LatencyWaterfallProps) {
  const maxMs = phases.reduce(
    (sum, phase) => sum + phase.sequentialMs,
    0,
  );

  const totalMs = phases.reduce(
    (sum, phase) =>
      sum + (mode === "sequential" ? phase.sequentialMs : phase.parallelMs),
    0,
  );

  return (
    <div className={cn("space-y-3", className)}>
      {phases.map((phase, index) => {
        const durationMs =
          mode === "sequential" ? phase.sequentialMs : phase.parallelMs;
        const widthPercent =
          maxMs > 0 ? Math.max((durationMs / maxMs) * 100, 0) : 0;
        const colors = COLOR_MAP[phase.color] ?? COLOR_MAP.blue;
        const isSkipped = durationMs === 0;

        return (
          <motion.div
            key={`${phase.name}-${mode}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * ANIMATION_STAGGER,
              duration: ANIMATION_DURATION,
              ease: "easeOut",
            }}
            className="flex items-center gap-3"
          >
            {/* Phase label */}
            <span className="w-36 shrink-0 text-right text-xs font-medium text-muted-foreground">
              {phase.name}
            </span>

            {/* Bar container */}
            <div className="flex-1 relative h-7">
              {isSkipped ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{
                    delay: index * ANIMATION_STAGGER + 0.2,
                    duration: 0.3,
                  }}
                  className="flex h-full items-center"
                >
                  <span className="text-xs italic text-muted-foreground">
                    parallelized
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{
                    delay: index * ANIMATION_STAGGER + 0.1,
                    duration: ANIMATION_DURATION,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "flex h-full items-center rounded-md border px-2",
                    colors.bg,
                    colors.border,
                  )}
                >
                  <span className={cn("text-xs font-semibold whitespace-nowrap", colors.text)}>
                    {durationMs}ms
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Total latency */}
      <motion.div
        key={`total-${mode}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: phases.length * ANIMATION_STAGGER + 0.2,
          duration: 0.4,
        }}
        className="flex items-center gap-3 border-t pt-3"
      >
        <span className="w-36 shrink-0 text-right text-sm font-bold text-foreground">
          Total
        </span>
        <div className="flex-1">
          <span className="text-sm font-bold text-primary tabular-nums">
            {totalMs.toLocaleString()}ms
          </span>
          {mode === "parallel" && (
            <span className="ml-2 text-xs text-green-600 font-medium">
              ({Math.round(((maxMs - totalMs) / maxMs) * 100)}% faster)
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
