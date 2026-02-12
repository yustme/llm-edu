import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { QueryPanel } from "@/components/semantic/QueryPanel";
import { ResultPanel } from "@/components/semantic/ResultPanel";
import { SemanticDefinition } from "@/components/semantic/SemanticDefinition";
import { Button } from "@/components/ui/button";
import { DEMO_QUERY, CONSISTENT_RUN, RUN_LABELS } from "@/data/queries";
import { METRIC_DEFINITIONS } from "@/data/semantic-definitions";
import { INCONSISTENCY_EXPLANATION } from "../data";

const ANIMATION_DURATION = 0.4;
const RUN_COUNT = 3;

export function Step4WithSemantic() {
  const [visibleRuns, setVisibleRuns] = useState(0);

  const showAllRuns = () => {
    setVisibleRuns(RUN_COUNT);
  };

  const showNextRun = () => {
    if (visibleRuns < RUN_COUNT) {
      setVisibleRuns((prev) => prev + 1);
    }
  };

  const resetRuns = () => {
    setVisibleRuns(0);
  };

  const allVisible = visibleRuns >= RUN_COUNT;
  const totalRevenueMetric = METRIC_DEFINITIONS[0];

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Adding a Semantic Layer"
          highlights={["Consistency", "Single Definition", "Guaranteed Results"]}
        >
          <p>
            A semantic layer defines each business metric precisely - what
            calculation to use, which filters to apply, and what the metric
            actually means.
          </p>
          <p>{INCONSISTENCY_EXPLANATION.solution}</p>

          {/* Metric definition card */}
          {totalRevenueMetric && (
            <SemanticDefinition
              name={totalRevenueMetric.metricName}
              description={totalRevenueMetric.description}
              calculation={totalRevenueMetric.calculation}
              filters={totalRevenueMetric.filters}
              type="metric"
            />
          )}

          {/* Controls */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={allVisible ? resetRuns : showNextRun}
              className="gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              {allVisible ? "Reset" : "Run Next Agent"}
            </Button>
            {!allVisible && visibleRuns === 0 && (
              <Button size="sm" variant="outline" onClick={showAllRuns}>
                Run All 3
              </Button>
            )}
          </div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          {/* The query */}
          <QueryPanel
            query={DEMO_QUERY}
            label="Same question, now with a semantic layer"
          />

          {/* Consistent runs - all showing the same result */}
          <AnimatePresence mode="popLayout">
            {Array.from({ length: visibleRuns }, (_, index) => (
              <motion.div
                key={`consistent-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION }}
              >
                <ResultPanel
                  label={RUN_LABELS[index]}
                  result={CONSISTENT_RUN.formattedValue}
                  status="success"
                  sqlUsed={CONSISTENT_RUN.sql}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Success highlight when all visible */}
          {allVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-lg border-2 border-green-300 bg-green-50 p-4 text-center"
            >
              <p className="text-sm text-green-700">
                <span className="font-bold">All 3 runs:</span>{" "}
                {CONSISTENT_RUN.formattedValue}
              </p>
              <p className="mt-1 text-xs text-green-600">
                Every agent uses the same semantic definition and produces the
                same correct result.
              </p>
            </motion.div>
          )}

          {/* Empty state */}
          {visibleRuns === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                Click &ldquo;Run Next Agent&rdquo; or &ldquo;Run All 3&rdquo; to
                see consistent results
              </p>
            </div>
          )}
        </InteractiveArea>
      </div>
    </div>
  );
}
