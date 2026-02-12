import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { QueryPanel } from "@/components/semantic/QueryPanel";
import { ResultPanel } from "@/components/semantic/ResultPanel";
import { Button } from "@/components/ui/button";
import { DEMO_QUERY, INCONSISTENT_RUNS, RUN_LABELS } from "@/data/queries";
import { INCONSISTENCY_EXPLANATION } from "../data";

const ANIMATION_DURATION = 0.4;

export function Step3WithoutSemantic() {
  const [visibleRuns, setVisibleRuns] = useState(0);

  const showNext = () => {
    if (visibleRuns < INCONSISTENT_RUNS.length) {
      setVisibleRuns((prev) => prev + 1);
    }
  };

  const resetRuns = () => {
    setVisibleRuns(0);
  };

  const allVisible = visibleRuns >= INCONSISTENT_RUNS.length;

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="3 Runs, 3 Different Answers"
          highlights={["Inconsistency", "Ambiguity", "No Shared Definition"]}
        >
          <p>
            Each agent interprets &ldquo;total revenue&rdquo; differently.
            Without a shared definition, every agent writes its own SQL with
            its own assumptions about filters, calculations, and what counts
            as revenue.
          </p>
          <p>
            Click &ldquo;Show Next Run&rdquo; to see how each agent approaches
            the same question differently.
          </p>

          {/* Controls */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={showNext}
              disabled={allVisible}
              className="gap-1.5"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              Show Next Run
            </Button>
            {visibleRuns > 0 && (
              <Button size="sm" variant="ghost" onClick={resetRuns}>
                Reset
              </Button>
            )}
          </div>

          {/* Per-run explanations */}
          <AnimatePresence mode="popLayout">
            {visibleRuns >= 1 && (
              <motion.div
                key="exp-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-md bg-red-50 border border-red-200 p-3 text-xs text-red-700"
              >
                <span className="font-semibold">Run 1:</span>{" "}
                {INCONSISTENCY_EXPLANATION.run1Problem}
              </motion.div>
            )}
            {visibleRuns >= 2 && (
              <motion.div
                key="exp-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700"
              >
                <span className="font-semibold">Run 2:</span>{" "}
                {INCONSISTENCY_EXPLANATION.run2Problem}
              </motion.div>
            )}
            {visibleRuns >= 3 && (
              <motion.div
                key="exp-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-md bg-orange-50 border border-orange-200 p-3 text-xs text-orange-700"
              >
                <span className="font-semibold">Run 3:</span>{" "}
                {INCONSISTENCY_EXPLANATION.run3Problem}
              </motion.div>
            )}
          </AnimatePresence>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          {/* The query */}
          <QueryPanel query={DEMO_QUERY} label="Question asked to each agent" />

          {/* Sequential runs */}
          <AnimatePresence mode="popLayout">
            {INCONSISTENT_RUNS.slice(0, visibleRuns).map((run, index) => (
              <motion.div
                key={run.queryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION }}
              >
                <ResultPanel
                  label={RUN_LABELS[index]}
                  result={run.formattedValue}
                  status="error"
                  sqlUsed={run.sql}
                  problem={run.problem}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Difference highlight when all visible */}
          {allVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center"
            >
              <p className="text-sm text-red-700">
                <span className="font-bold">Spread:</span>{" "}
                {INCONSISTENT_RUNS.map((r) => r.formattedValue).join(" vs ")}
              </p>
              <p className="mt-1 text-xs text-red-600">
                None of these answers are the &ldquo;correct&rdquo; total
                revenue - each agent made different assumptions.
              </p>
            </motion.div>
          )}

          {/* Empty state */}
          {visibleRuns === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                Click &ldquo;Show Next Run&rdquo; to start the demonstration
              </p>
            </div>
          )}
        </InteractiveArea>
      </div>
    </div>
  );
}
