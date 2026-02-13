import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { BPE_MERGE_STAGES } from "@/data/mock-tokenization";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";

const ANIMATION_DURATION = 0.4;
const STAGGER_DELAY = 0.06;
const AUTO_PLAY_INTERVAL_MS = 2000;

const TOKEN_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-700",
  "bg-green-100 border-green-300 text-green-700",
  "bg-purple-100 border-purple-300 text-purple-700",
  "bg-orange-100 border-orange-300 text-orange-700",
  "bg-pink-100 border-pink-300 text-pink-700",
  "bg-cyan-100 border-cyan-300 text-cyan-700",
  "bg-amber-100 border-amber-300 text-amber-700",
  "bg-red-100 border-red-300 text-red-700",
  "bg-indigo-100 border-indigo-300 text-indigo-700",
  "bg-teal-100 border-teal-300 text-teal-700",
  "bg-lime-100 border-lime-300 text-lime-700",
] as const;

const TOTAL_STAGES = BPE_MERGE_STAGES.length;

/**
 * Animated visualization of BPE merging on the word "unhappiness".
 * Shows iterative character merging with auto-play and manual step controls.
 */
export function BpeMergeAnimation() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stage = BPE_MERGE_STAGES[currentStage];
  const isLastStage = currentStage >= TOTAL_STAGES - 1;

  const goNext = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev >= TOTAL_STAGES - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  const reset = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isLastStage) {
      // Restart from beginning
      setCurrentStage(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [isLastStage]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      goNext();
    }, AUTO_PLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPlaying, goNext]);

  // Fullscreen arrow-key control
  const setStepperPosition = useCallback(
    (i: number) => setCurrentStage(i),
    [],
  );
  useFullscreenStepper(currentStage, TOTAL_STAGES, setStepperPosition);

  return (
    <div className="space-y-5">
      {/* Source word */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Input Word
        </p>
        <p className="text-2xl font-bold font-mono tracking-wider text-foreground">
          unhappiness
        </p>
      </div>

      {/* Stage indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {BPE_MERGE_STAGES.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index <= currentStage
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Current token state */}
      <div className="rounded-lg border bg-muted/20 p-4">
        <p className="mb-2 text-xs text-muted-foreground uppercase tracking-wide">
          Stage {currentStage + 1} of {TOTAL_STAGES}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[40px]">
          <AnimatePresence mode="popLayout">
            {stage.tokens.map((token, index) => {
              const colorIndex = index % TOKEN_COLORS.length;
              return (
                <motion.span
                  key={`${currentStage}-${index}-${token}`}
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                    layout: { duration: 0.3 },
                  }}
                  className={`inline-flex items-center rounded-md border-2 px-2.5 py-1 text-sm font-mono font-semibold ${TOKEN_COLORS[colorIndex]}`}
                >
                  {token}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Merge rule */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
        >
          <p className="text-xs text-muted-foreground mb-0.5">
            {stage.label}
          </p>
          {stage.mergeRule && (
            <p className="text-sm font-mono font-medium text-primary">
              {stage.mergeRule}
            </p>
          )}
          {!stage.mergeRule && (
            <p className="text-sm font-mono text-muted-foreground">
              Split every character individually
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          title="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 rounded-md border bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              {isLastStage ? "Replay" : "Play"}
            </>
          )}
        </button>
        <button
          onClick={goNext}
          disabled={isLastStage}
          className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          title="Next step"
        >
          <SkipForward className="h-3.5 w-3.5" />
          Step
        </button>
      </div>
    </div>
  );
}
