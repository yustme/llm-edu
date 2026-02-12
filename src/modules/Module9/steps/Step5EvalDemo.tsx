import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { EvaluationResultsTable } from "@/components/evaluation/EvaluationResultsTable";
import { Button } from "@/components/ui/button";
import { EVAL_RESULTS } from "@/data/mock-evaluation";

const ROW_INTERVAL_MS = 600;

export function Step5EvalDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allVisible = visibleCount >= EVAL_RESULTS.length;

  /** Start the evaluation run animation */
  const startRun = useCallback(() => {
    setVisibleCount(0);
    setIsRunning(true);
  }, []);

  /** Reset the evaluation */
  const resetRun = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setVisibleCount(0);
    setIsRunning(false);
  }, []);

  /** Interval to reveal rows one by one */
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next >= EVAL_RESULTS.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          return EVAL_RESULTS.length;
        }
        return next;
      });
    }, ROW_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  /** Compute summary stats from visible results */
  const visibleResults = EVAL_RESULTS.slice(0, visibleCount);
  const avgScore =
    visibleResults.length > 0
      ? visibleResults.reduce((sum, r) => sum + r.score, 0) / visibleResults.length
      : 0;
  const avgLatency =
    visibleResults.length > 0
      ? visibleResults.reduce((sum, r) => sum + r.latencyMs, 0) / visibleResults.length
      : 0;
  const passCount = visibleResults.filter((r) => r.passed).length;
  const passRate =
    visibleResults.length > 0 ? (passCount / visibleResults.length) * 100 : 0;

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Batch Evaluation Run"
          highlights={["Automated", "Batch Testing", "Metrics"]}
        >
          <p>
            In practice, evaluations run as <strong>batch jobs</strong> that
            execute dozens or hundreds of test cases against your agent. Each
            test produces a score and pass/fail result.
          </p>
          <p>
            Results are aggregated into summary metrics that tell you at a
            glance whether the agent meets your quality bar:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Pass rate</strong> - Percentage of tests that meet the
              minimum score threshold
            </li>
            <li>
              <strong>Average score</strong> - Overall quality indicator across
              all tests
            </li>
            <li>
              <strong>Average latency</strong> - Performance indicator for
              response time
            </li>
          </ul>
          <p>
            Click <strong>Run Evaluation</strong> to simulate a batch run and
            watch results appear in real-time as each test completes.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          {/* Controls */}
          <div className="mb-4 flex items-center gap-2 border-b pb-3">
            <Button
              size="sm"
              onClick={startRun}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-3.5 w-3.5" />
              Run Evaluation
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetRun}
              className="gap-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">
              {visibleCount}/{EVAL_RESULTS.length} tests complete
            </span>
          </div>

          {/* Results table */}
          {visibleCount > 0 ? (
            <EvaluationResultsTable
              results={EVAL_RESULTS}
              visibleCount={visibleCount}
            />
          ) : (
            <div className="flex h-48 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Click &quot;Run Evaluation&quot; to start the batch test run
              </p>
            </div>
          )}

          {/* Summary stats cards */}
          {allVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-4 grid grid-cols-3 gap-3"
            >
              <div className="rounded-lg border bg-green-50 p-3 text-center">
                <p className="text-xs text-muted-foreground">Pass Rate</p>
                <p className="text-xl font-bold text-green-700">
                  {passRate.toFixed(0)}%
                </p>
              </div>
              <div className="rounded-lg border bg-blue-50 p-3 text-center">
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <p className="text-xl font-bold text-blue-700">
                  {avgScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-lg border bg-amber-50 p-3 text-center">
                <p className="text-xs text-muted-foreground">Avg Latency</p>
                <p className="text-xl font-bold text-amber-700">
                  {avgLatency.toFixed(0)}ms
                </p>
              </div>
            </motion.div>
          )}
        </InteractiveArea>
      </div>
    </div>
  );
}
