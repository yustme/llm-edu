import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { EvalResult } from "@/data/mock-evaluation";

const STAGGER_DELAY = 0.08;

interface EvaluationResultsTableProps {
  results: EvalResult[];
  visibleCount: number;
  className?: string;
}

/**
 * Animated table where evaluation result rows appear one by one.
 * Shows a summary row with averages when all rows are visible.
 */
export function EvaluationResultsTable({
  results,
  visibleCount,
  className,
}: EvaluationResultsTableProps) {
  const visibleResults = results.slice(0, visibleCount);
  const allVisible = visibleCount >= results.length;

  /** Compute summary statistics from visible results */
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
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              Test Name
            </th>
            <th className="px-3 py-2 text-center font-medium text-muted-foreground">
              Score
            </th>
            <th className="px-3 py-2 text-center font-medium text-muted-foreground">
              Result
            </th>
            <th className="px-3 py-2 text-center font-medium text-muted-foreground">
              Latency
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {visibleResults.map((result, index) => (
              <motion.tr
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * STAGGER_DELAY,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="border-b last:border-b-0"
              >
                <td className="px-3 py-2 font-medium">{result.testName}</td>
                <td className="px-3 py-2 text-center tabular-nums">
                  {result.score}
                </td>
                <td className="px-3 py-2 text-center">
                  <Badge
                    variant="secondary"
                    className={
                      result.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {result.passed ? "Pass" : "Fail"}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                  {result.latencyMs}ms
                </td>
                <td className="px-3 py-2 text-muted-foreground text-xs">
                  {result.details}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>

        {/* Summary row */}
        {allVisible && (
          <tfoot>
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="border-t-2 bg-muted/30 font-medium"
            >
              <td className="px-3 py-2">Summary</td>
              <td className="px-3 py-2 text-center tabular-nums">
                {avgScore.toFixed(1)}
              </td>
              <td className="px-3 py-2 text-center">
                <Badge
                  variant="secondary"
                  className={
                    passRate >= 80
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {passRate.toFixed(0)}% pass
                </Badge>
              </td>
              <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                {avgLatency.toFixed(0)}ms
              </td>
              <td className="px-3 py-2 text-muted-foreground text-xs">
                {passCount}/{visibleResults.length} tests passed
              </td>
            </motion.tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
