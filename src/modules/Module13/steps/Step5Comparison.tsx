import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { APPROACH_COMPARISON } from "@/data/mock-graph-rag";

const STAGGER_DELAY = 0.1;
const ROW_ANIMATION_DURATION = 0.3;

export function Step5Comparison() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="When to Use Each Approach"
          highlights={["Vector RAG", "Graph RAG", "Hybrid"]}
        >
          <p>
            Neither vector RAG nor graph RAG is universally better. The right
            choice depends on the types of queries your application needs to
            handle and the structure of your data.
          </p>
          <ul className="list-none space-y-3 pl-0">
            <li>
              <span className="font-semibold text-foreground">Vector RAG</span>{" "}
              excels at direct factual lookups where the answer lives in a
              single document chunk. It is simple to set up and fast to query.
            </li>
            <li>
              <span className="font-semibold text-foreground">Graph RAG</span>{" "}
              shines when queries require understanding relationships between
              entities or synthesizing information across the entire knowledge
              base.
            </li>
            <li>
              <span className="font-semibold text-foreground">Hybrid</span>{" "}
              combines both approaches with a query router that selects the
              best strategy per query. This gives the broadest coverage but
              adds complexity.
            </li>
          </ul>
          <p>
            The comparison table on the right breaks down the key differences
            across multiple dimensions.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Comparison table */}
      <div className="flex-1">
        <InteractiveArea>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Dimension
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                    Vector RAG
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-green-700">
                    Graph RAG
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-violet-700">
                    Hybrid
                  </th>
                </tr>
              </thead>
              <tbody>
                {APPROACH_COMPARISON.map((row, index) => (
                  <motion.tr
                    key={row.dimension}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.4 + index * STAGGER_DELAY,
                      duration: ROW_ANIMATION_DURATION,
                    }}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {row.dimension}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {row.vectorRag}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {row.graphRag}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {row.hybrid}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
