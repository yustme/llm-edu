import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { INCONSISTENT_RUNS, CONSISTENT_RUN, RUN_LABELS } from "@/data/queries";
import { SEMANTIC_LAYER_FEATURES } from "@/data/semantic-definitions";

const STAGGER_DELAY = 0.1;
const ROW_ANIMATION_DURATION = 0.3;

export function Step5Comparison() {
  return (
    <div className="flex flex-col gap-6">
      {/* Side-by-side results */}
      <ComparisonView
        leftLabel="Without Semantic Layer"
        rightLabel="With Semantic Layer"
        leftContent={
          <div className="space-y-3">
            {INCONSISTENT_RUNS.map((run, index) => (
              <div
                key={run.queryId}
                className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-2.5 border border-red-200"
              >
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="text-xs text-red-600">
                    {RUN_LABELS[index]}:
                  </span>
                </div>
                <span className="text-sm font-bold text-red-700">
                  {run.formattedValue}
                </span>
              </div>
            ))}
            <p className="text-xs text-red-600 text-center pt-1">
              3 different answers - no consistency
            </p>
          </div>
        }
        rightContent={
          <div className="space-y-3">
            {RUN_LABELS.map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-2.5 border border-green-200"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-xs text-green-600">{label}:</span>
                </div>
                <span className="text-sm font-bold text-green-700">
                  {CONSISTENT_RUN.formattedValue}
                </span>
              </div>
            ))}
            <p className="text-xs text-green-600 text-center pt-1">
              Same answer every time - guaranteed consistency
            </p>
          </div>
        }
      />

      {/* Feature comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="overflow-hidden rounded-xl border bg-card"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Feature
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-red-700">
                Without Semantic Layer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-green-700">
                With Semantic Layer
              </th>
            </tr>
          </thead>
          <tbody>
            {SEMANTIC_LAYER_FEATURES.map((row, index) => (
              <motion.tr
                key={row.feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + index * STAGGER_DELAY,
                  duration: ROW_ANIMATION_DURATION,
                }}
                className="border-b last:border-b-0"
              >
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  {row.feature}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row.without}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row.with}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
