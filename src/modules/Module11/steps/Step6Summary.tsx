import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { DECISION_MATRIX, BEST_PRACTICES } from "@/data/mock-chunking";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Decision Matrix", "Best Practices", "Iterate"]}
        >
          <p>
            There is no single best chunking strategy. The right approach
            depends on your <strong>document type</strong>, embedding model,
            and retrieval requirements.
          </p>
          <p>Guidelines for choosing:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Start with recursive</strong> - it adapts to document
              structure and works well as a baseline
            </li>
            <li>
              <strong>Use 10-15% overlap</strong> - prevents information
              loss at chunk boundaries
            </li>
            <li>
              <strong>Target 200-500 characters</strong> - this range works
              for most use cases, but always test on your data
            </li>
            <li>
              <strong>Measure retrieval quality</strong> - tune chunk size
              based on precision and recall metrics, not intuition
            </li>
            <li>
              <strong>Consider metadata</strong> - include source, section
              title, and page number alongside chunk text
            </li>
          </ul>
          <p>
            The decision matrix on the right maps common document types to
            recommended strategies and settings.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6" allowFullscreen>
          {/* Decision matrix table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Decision Matrix
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Document Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Strategy
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Size
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Overlap
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DECISION_MATRIX.map((row, index) => (
                    <motion.tr
                      key={row.documentType}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-b-0 hover:bg-muted/30"
                    >
                      <td className="px-3 py-2 font-medium text-foreground">
                        {row.documentType}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {row.recommendedStrategy}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">
                        {row.chunkSize}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">
                        {row.overlap}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best practices checklist */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Best Practices Checklist
            </p>
            <div className="space-y-2">
              {BEST_PRACTICES.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
