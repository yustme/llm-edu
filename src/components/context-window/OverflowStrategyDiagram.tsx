import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, SlidersHorizontal, FileText, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { OVERFLOW_STRATEGIES } from "@/data/mock-context-window";
import type { OverflowStrategy } from "@/data/mock-context-window";

const ANIMATION_DURATION = 0.4;

const STRATEGY_ICONS: Record<string, React.ElementType> = {
  truncation: Scissors,
  "sliding-window": SlidersHorizontal,
  summarization: FileText,
};

// Simulated message blocks for the overflow visualization
const MESSAGE_BLOCKS = [
  { id: 1, label: "System Prompt", type: "system" as const },
  { id: 2, label: "User Msg 1", type: "user" as const },
  { id: 3, label: "Assist. 1", type: "assistant" as const },
  { id: 4, label: "User Msg 2", type: "user" as const },
  { id: 5, label: "Assist. 2", type: "assistant" as const },
  { id: 6, label: "User Msg 3", type: "user" as const },
  { id: 7, label: "Assist. 3", type: "assistant" as const },
  { id: 8, label: "User Msg 4 (new)", type: "user" as const },
];

const TYPE_COLORS = {
  system: "bg-violet-100 border-violet-300 text-violet-800",
  user: "bg-blue-100 border-blue-300 text-blue-800",
  assistant: "bg-emerald-100 border-emerald-300 text-emerald-800",
  summary: "bg-amber-100 border-amber-300 text-amber-800",
  removed: "bg-red-50 border-red-200 text-red-400 line-through opacity-50",
};

/**
 * Returns the visual state of each block given the active strategy.
 * Each block gets a status: "keep", "remove", or "summary".
 */
function getBlockStates(
  strategyId: string,
): Array<{ id: number; label: string; status: "keep" | "remove" | "summary" }> {
  switch (strategyId) {
    case "truncation":
      // Remove the oldest messages (blocks 2-5), keep system + recent
      return MESSAGE_BLOCKS.map((block) => {
        if (block.id >= 2 && block.id <= 5) {
          return { id: block.id, label: block.label, status: "remove" as const };
        }
        return { id: block.id, label: block.label, status: "keep" as const };
      });

    case "sliding-window":
      // Keep system prompt + last N messages (window of 4)
      return MESSAGE_BLOCKS.map((block) => {
        if (block.type === "system") {
          return { id: block.id, label: block.label, status: "keep" as const };
        }
        if (block.id >= 2 && block.id <= 4) {
          return { id: block.id, label: block.label, status: "remove" as const };
        }
        return { id: block.id, label: block.label, status: "keep" as const };
      });

    case "summarization":
      // Summarize blocks 2-5 into a single summary block, keep system + recent
      return [
        { id: 1, label: "System Prompt", status: "keep" as const },
        { id: 99, label: "Summary of Msgs 1-4", status: "summary" as const },
        { id: 6, label: "User Msg 3", status: "keep" as const },
        { id: 7, label: "Assist. 3", status: "keep" as const },
        { id: 8, label: "User Msg 4 (new)", status: "keep" as const },
      ];

    default:
      return MESSAGE_BLOCKS.map((block) => ({
        id: block.id,
        label: block.label,
        status: "keep" as const,
      }));
  }
}

/**
 * Animated visualization of three overflow strategies.
 * Users switch between strategies using tab buttons.
 */
export function OverflowStrategyDiagram() {
  const [activeStrategy, setActiveStrategy] = useState<string>("truncation");

  // Fullscreen arrow-key navigation: cycle through overflow strategies
  const strategyIndex = OVERFLOW_STRATEGIES.findIndex((s) => s.id === activeStrategy);
  const setStrategyByIndex = useCallback(
    (i: number) => setActiveStrategy(OVERFLOW_STRATEGIES[i].id),
    [],
  );
  useFullscreenStepper(strategyIndex, OVERFLOW_STRATEGIES.length, setStrategyByIndex);

  const currentStrategy = OVERFLOW_STRATEGIES.find(
    (s) => s.id === activeStrategy,
  ) as OverflowStrategy;

  const blockStates = getBlockStates(activeStrategy);

  return (
    <div className="space-y-4">
      {/* Strategy selector tabs */}
      <div className="flex gap-2">
        {OVERFLOW_STRATEGIES.map((strategy) => {
          const Icon = STRATEGY_ICONS[strategy.id] ?? FileText;
          const isActive = strategy.id === activeStrategy;

          return (
            <button
              key={strategy.id}
              onClick={() => setActiveStrategy(strategy.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {strategy.name}
            </button>
          );
        })}
      </div>

      {/* Strategy description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeStrategy}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-muted-foreground leading-relaxed"
        >
          {currentStrategy.description}
        </motion.p>
      </AnimatePresence>

      {/* Visual block diagram */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Context Window
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStrategy}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {blockStates.map((block, index) => {
              let colorClass: string;
              if (block.status === "remove") {
                colorClass = TYPE_COLORS.removed;
              } else if (block.status === "summary") {
                colorClass = TYPE_COLORS.summary;
              } else {
                // Determine color from original block type
                const original = MESSAGE_BLOCKS.find((m) => m.id === block.id);
                const blockType = original?.type ?? "user";
                colorClass = TYPE_COLORS[blockType];
              }

              return (
                <motion.div
                  key={`${activeStrategy}-${block.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.08,
                    duration: ANIMATION_DURATION,
                  }}
                  className={cn(
                    "rounded-md border px-3 py-2 text-xs font-medium",
                    colorClass,
                  )}
                >
                  {block.label}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-violet-300" />
            System
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-300" />
            User
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-300" />
            Assistant
          </span>
          {activeStrategy === "summarization" && (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-300" />
              Summary
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-200" />
            Removed
          </span>
        </div>
      </div>

      {/* Pros and cons */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-600">
            Pros
          </p>
          <div className="space-y-1.5">
            {currentStrategy.pros.map((pro) => (
              <motion.div
                key={pro}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-1.5 text-xs text-foreground"
              >
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                {pro}
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-600">
            Cons
          </p>
          <div className="space-y-1.5">
            {currentStrategy.cons.map((con) => (
              <motion.div
                key={con}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-1.5 text-xs text-foreground"
              >
                <X className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                {con}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
