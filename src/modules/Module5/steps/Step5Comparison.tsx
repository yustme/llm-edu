import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import {
  getWithoutRagFinalResponse,
  getWithRagFinalResponse,
  RAG_DEMO_QUERY,
} from "@/data/mock-rag";
import { RAG_COMPARISON_TABLE } from "../data";

const STAGGER_DELAY = 0.1;
const ROW_ANIMATION_DURATION = 0.3;

export function Step5Comparison() {
  const withoutRagResponse = getWithoutRagFinalResponse();
  const withRagResponse = getWithRagFinalResponse();

  return (
    <div className="flex flex-col gap-6">
      {/* Side-by-side responses */}
      <ComparisonView
        leftLabel="Without RAG"
        rightLabel="With RAG"
        leftContent={
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Query: "{RAG_DEMO_QUERY}"
            </p>
            <div className="rounded-lg bg-red-50 p-4 text-sm leading-relaxed text-red-900 border border-red-200">
              {withoutRagResponse}
            </div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <X className="h-4 w-4" />
              <span>Hallucinated details, no sources, inaccurate</span>
            </div>
          </div>
        }
        rightContent={
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Query: "{RAG_DEMO_QUERY}"
            </p>
            <div className="rounded-lg bg-green-50 p-4 text-sm leading-relaxed text-green-900 border border-green-200 whitespace-pre-line">
              {withRagResponse}
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Accurate, cited sources, verifiable</span>
            </div>
          </div>
        }
      />

      {/* Comparison table */}
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
                Without RAG
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-green-700">
                With RAG
              </th>
            </tr>
          </thead>
          <tbody>
            {RAG_COMPARISON_TABLE.map((row, index) => (
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
                  {row.withoutRag}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row.withRag}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
