import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { RECURSIVE_LEVELS } from "@/data/mock-chunking";

// -- Configuration constants --------------------------------------------------

const ANIMATION_DURATION = 0.5;
const LEVEL_DELAY = 0.8;
const AUTO_STEP_DELAY_MS = 1500;
const TOTAL_LEVELS = 4;

/** Visual data for the tree nodes at each level */
const TREE_DATA = [
  // Level 0: Full document
  [{ label: "Full Document", width: "w-full" }],
  // Level 1: Split into paragraphs/sections
  [
    { label: "Section 1: AI Overview", width: "w-[30%]" },
    { label: "Section 2: LLMs", width: "w-[35%]" },
    { label: "Section 3: RAG", width: "w-[35%]" },
  ],
  // Level 2: Oversized sections split into sentences
  [
    { label: "Section 1: AI Overview", width: "w-[30%]", unchanged: true },
    { label: "LLM Sentence 1", width: "w-[17%]" },
    { label: "LLM Sentence 2", width: "w-[18%]" },
    { label: "RAG Sentence 1", width: "w-[17%]" },
    { label: "RAG Sentence 2", width: "w-[18%]" },
  ],
  // Level 3: Final chunks (all within size)
  [
    { label: "Chunk 1", width: "w-auto" },
    { label: "Chunk 2", width: "w-auto" },
    { label: "Chunk 3", width: "w-auto" },
    { label: "Chunk 4", width: "w-auto" },
    { label: "Chunk 5", width: "w-auto" },
  ],
] as const;

const NODE_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200",
  "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200",
  "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/50 dark:border-amber-700 dark:text-amber-200",
  "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-200",
] as const;

// -- Component ----------------------------------------------------------------

export function RecursiveSplitDiagram() {
  const [visibleLevel, setVisibleLevel] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const setLevel = useCallback((i: number) => {
    setVisibleLevel(i);
    setIsAnimating(false);
  }, []);

  useFullscreenStepper(visibleLevel, TOTAL_LEVELS, setLevel);

  const handleAnimate = () => {
    setIsAnimating(true);
    setVisibleLevel(0);

    let level = 0;
    const interval = setInterval(() => {
      level++;
      if (level >= TOTAL_LEVELS) {
        clearInterval(interval);
        setIsAnimating(false);
      } else {
        setVisibleLevel(level);
      }
    }, AUTO_STEP_DELAY_MS);
  };

  const handleReset = () => {
    setVisibleLevel(0);
    setIsAnimating(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Recursive Splitting Process
      </p>

      {/* Tree visualization */}
      <div className="space-y-3">
        {TREE_DATA.map((levelNodes, levelIndex) => (
          <AnimatePresence key={levelIndex}>
            {levelIndex <= visibleLevel && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_DURATION,
                  delay:
                    levelIndex === visibleLevel ? 0 : levelIndex * LEVEL_DELAY,
                }}
                className="space-y-1"
              >
                {/* Level label */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {RECURSIVE_LEVELS[levelIndex].label}
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    -- {RECURSIVE_LEVELS[levelIndex].description}
                  </span>
                </div>

                {/* Nodes row */}
                <div className="flex items-stretch gap-1.5">
                  {levelNodes.map((node, nodeIndex) => (
                    <motion.div
                      key={`${levelIndex}-${nodeIndex}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: nodeIndex * 0.1,
                      }}
                      className={cn(
                        "flex-1 rounded-md border px-2.5 py-2 text-center text-xs font-medium",
                        NODE_COLORS[levelIndex % NODE_COLORS.length],
                        "unchanged" in node && node.unchanged
                          ? "opacity-60 border-dashed"
                          : ""
                      )}
                    >
                      {node.label}
                      {"unchanged" in node && node.unchanged && (
                        <span className="ml-1 text-xs opacity-70">
                          (fits)
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Arrow between levels */}
                {levelIndex < TOTAL_LEVELS - 1 &&
                  levelIndex < visibleLevel && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex justify-center py-0.5"
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
                    </motion.div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Level description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleLevel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-muted/50 px-4 py-2.5 text-center text-sm"
        >
          <span className="font-semibold text-foreground">
            Level {visibleLevel + 1}:
          </span>{" "}
          <span className="text-muted-foreground">
            {RECURSIVE_LEVELS[visibleLevel].description}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isAnimating && visibleLevel === 0 && (
          <Button size="sm" onClick={handleAnimate}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Animate Splitting
          </Button>
        )}
        {(isAnimating || visibleLevel > 0) && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isAnimating}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
