import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { DISTANCE_METRICS } from "@/data/mock-similarity";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const BEST_PRACTICES = [
  {
    id: "normalize",
    label: "Normalize embeddings before comparison",
    description:
      "Pre-normalize vectors so cosine similarity becomes a simple dot product, significantly faster at scale.",
  },
  {
    id: "right-model",
    label: "Choose the right embedding model",
    description:
      "Use task-specific models (e.g., text-embedding-3-small for search, all-MiniLM-L6 for speed). Benchmark on your data.",
  },
  {
    id: "threshold-eval",
    label: "Evaluate thresholds on real queries",
    description:
      "Do not guess thresholds. Run evaluation with labeled query-document pairs to find the optimal cutoff.",
  },
  {
    id: "vector-db",
    label: "Use a vector database for scale",
    description:
      "For millions of vectors, use Pinecone, Weaviate, or pgvector with approximate nearest neighbor (ANN) indexing.",
  },
  {
    id: "hybrid-search",
    label: "Combine with keyword search (hybrid)",
    description:
      "Use BM25 + cosine similarity together for the best of both worlds. Many vector DBs support hybrid search natively.",
  },
] as const;

/** Table header labels for the metrics comparison */
const TABLE_HEADERS = ["Metric", "Range", "Best For", "Scale Invariant"] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Cosine", "Threshold", "Hybrid"]}
        >
          <p>
            <strong>Cosine similarity</strong> is the standard metric for
            comparing text embeddings. It measures the angle between vectors,
            ignoring magnitude.
          </p>
          <p>Key principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Range [-1, 1]</strong> where 1 = identical, 0 =
              unrelated, -1 = opposite
            </li>
            <li>
              <strong>Scale-invariant</strong> - document length does not
              affect the score
            </li>
            <li>
              <strong>Threshold matters</strong> - tune it for your precision /
              recall needs
            </li>
            <li>
              <strong>Hybrid search</strong> combines the best of keyword and
              semantic approaches
            </li>
          </ul>
          <p>
            Combined with <strong>RAG</strong> (Module 5) and{" "}
            <strong>Embeddings</strong>, cosine similarity powers most modern
            AI search and retrieval systems.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Distance metrics comparison table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Distance Metrics Comparison
            </p>
            <div className="overflow-hidden rounded-lg border">
              {/* Header */}
              <div className="grid grid-cols-4 gap-px bg-muted">
                {TABLE_HEADERS.map((header) => (
                  <div
                    key={header}
                    className="bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {DISTANCE_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="grid grid-cols-4 gap-px border-t"
                >
                  <div className="bg-card px-3 py-2.5 text-sm font-medium text-foreground">
                    {metric.name}
                  </div>
                  <div className="bg-card px-3 py-2.5 text-xs font-mono text-muted-foreground">
                    {metric.range}
                  </div>
                  <div className="bg-card px-3 py-2.5 text-xs text-muted-foreground">
                    {metric.bestFor}
                  </div>
                  <div className="bg-card px-3 py-2.5 text-xs">
                    {metric.scaleInvariant ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700 font-medium">
                        No
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Best practices */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Best Practices
            </p>
            <div className="space-y-2">
              {BEST_PRACTICES.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
