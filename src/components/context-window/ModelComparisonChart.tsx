import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MODEL_SPECS } from "@/data/mock-context-window";
import type { ModelSpec } from "@/data/mock-context-window";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.6;

// Color map for Tailwind background classes
const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-500", text: "text-emerald-700" },
  green: { bg: "bg-green-500", text: "text-green-700" },
  violet: { bg: "bg-violet-500", text: "text-violet-700" },
  purple: { bg: "bg-purple-500", text: "text-purple-700" },
  blue: { bg: "bg-blue-500", text: "text-blue-700" },
  orange: { bg: "bg-orange-500", text: "text-orange-700" },
  sky: { bg: "bg-sky-500", text: "text-sky-700" },
};

function formatTokenCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  return `${(count / 1_000).toFixed(0)}K`;
}

/**
 * Horizontal bar chart comparing model context window sizes.
 * Uses divs with width percentages and framer-motion for animation.
 */
export function ModelComparisonChart() {
  // Find the maximum context window to calculate relative widths
  const maxContext = Math.max(...MODEL_SPECS.map((m) => m.contextWindow));

  return (
    <div className="space-y-3">
      {MODEL_SPECS.map((model: ModelSpec, index: number) => {
        const widthPercent = (model.contextWindow / maxContext) * 100;
        const colors = COLOR_MAP[model.color] ?? {
          bg: "bg-primary",
          text: "text-primary",
        };

        return (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="space-y-1"
          >
            {/* Label row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {model.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({model.provider})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn("text-xs font-semibold tabular-nums", colors.text)}
                >
                  {formatTokenCount(model.contextWindow)} tokens
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ${model.inputCostPer1k}/1K in
                </span>
              </div>
            </div>

            {/* Bar */}
            <div className="h-5 w-full overflow-hidden rounded-md bg-muted">
              <motion.div
                className={cn("h-full rounded-md", colors.bg)}
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{
                  delay: index * STAGGER_DELAY + 0.2,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
