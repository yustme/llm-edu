import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { OrchestrationDiagram } from "@/components/orchestration/OrchestrationDiagram";
import { Button } from "@/components/ui/button";
import { EVALUATOR_PATTERN, EVALUATOR_ITERATIONS } from "@/data/mock-orchestration";

const QUALITY_THRESHOLD = 90;

export function Step5EvaluatorOptimizer() {
  const [currentIteration, setCurrentIteration] = useState(0);

  const isComplete =
    currentIteration > 0 &&
    EVALUATOR_ITERATIONS[currentIteration - 1].score >= QUALITY_THRESHOLD;

  const activeAgentId =
    currentIteration === 0
      ? undefined
      : currentIteration <= EVALUATOR_ITERATIONS.length && !isComplete
        ? "evaluator"
        : isComplete
          ? "evaluator"
          : undefined;

  const runIteration = useCallback(() => {
    if (currentIteration < EVALUATOR_ITERATIONS.length) {
      setCurrentIteration((prev) => prev + 1);
    }
  }, [currentIteration]);

  const resetLoop = useCallback(() => {
    setCurrentIteration(0);
  }, []);

  /** Get the color class based on score value */
  function scoreColor(score: number): string {
    if (score >= QUALITY_THRESHOLD) return "text-green-600";
    if (score >= 80) return "text-amber-600";
    return "text-red-600";
  }

  /** Get the progress bar width based on score */
  function scoreWidth(score: number): string {
    return `${score}%`;
  }

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Evaluator-Optimizer Loop"
          highlights={["Generate", "Evaluate", "Improve"]}
        >
          <p>
            The <strong>evaluator-optimizer</strong> pattern creates a feedback
            loop. A generator agent produces output, then an evaluator agent
            scores it against quality criteria.
          </p>
          <p>
            If the score is below the quality threshold, the generator receives
            the feedback and produces an improved version. This loop repeats
            until the quality threshold is met.
          </p>
          <p>
            This pattern is ideal for quality-sensitive outputs like code
            generation, content writing, or any task where iterative refinement
            improves results significantly.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center gap-6">
          {/* Diagram */}
          <OrchestrationDiagram
            agents={EVALUATOR_PATTERN.agents}
            layout="loop"
            activeAgentId={activeAgentId}
          />

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={runIteration}
              disabled={isComplete || currentIteration >= EVALUATOR_ITERATIONS.length}
            >
              {currentIteration === 0 ? "Start Loop" : "Run Iteration"}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetLoop}>
              Reset
            </Button>
            <span className="text-xs text-muted-foreground">
              Threshold: {QUALITY_THRESHOLD}%
            </span>
          </div>

          {/* Iteration results */}
          <div className="w-full max-w-sm space-y-3">
            <AnimatePresence mode="popLayout">
              {EVALUATOR_ITERATIONS.slice(0, currentIteration).map((iter) => (
                <motion.div
                  key={iter.iteration}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-lg border bg-card px-4 py-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Iteration {iter.iteration}
                    </span>
                    <span
                      className={`text-sm font-bold ${scoreColor(iter.score)}`}
                    >
                      {iter.score}%
                    </span>
                  </div>

                  {/* Score bar */}
                  <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={`h-full rounded-full ${
                        iter.score >= QUALITY_THRESHOLD
                          ? "bg-green-500"
                          : iter.score >= 80
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      initial={{ width: "0%" }}
                      animate={{ width: scoreWidth(iter.score) }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {iter.feedback}
                  </p>

                  {iter.score >= QUALITY_THRESHOLD && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 text-xs font-semibold text-green-600"
                    >
                      Quality threshold met -- loop complete
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty state */}
            {currentIteration === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-sm text-muted-foreground"
              >
                Click "Start Loop" to begin the generate-evaluate cycle
              </motion.p>
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
