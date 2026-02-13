import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { SemanticSearchDemo } from "@/components/similarity/SemanticSearchDemo";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const THRESHOLD_GUIDELINES = [
  {
    range: "> 0.85",
    label: "Very High",
    description: "Near-duplicates, paraphrases. Use for deduplication.",
    color: "bg-green-100 text-green-700",
  },
  {
    range: "0.70 - 0.85",
    label: "High",
    description: "Strongly related content. Good default for RAG retrieval.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    range: "0.50 - 0.70",
    label: "Medium",
    description: "Somewhat related. Broader results, some noise. Good for exploration.",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    range: "< 0.50",
    label: "Low",
    description: "Weakly related or unrelated. Usually filtered out.",
    color: "bg-red-100 text-red-700",
  },
] as const;

export function Step5Thresholds() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Similarity Thresholds"
          highlights={["Precision", "Recall", "Tradeoff"]}
        >
          <p>
            Choosing the right <strong>similarity threshold</strong> is a
            classic precision/recall tradeoff:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>High threshold</strong> (e.g., 0.8) = fewer results but
              more relevant (high precision, lower recall)
            </li>
            <li>
              <strong>Low threshold</strong> (e.g., 0.3) = more results but
              includes noise (high recall, lower precision)
            </li>
          </ul>
          <p>
            Use the <strong>threshold slider</strong> on the right to
            experiment. Notice how precision and recall change as you move it.
          </p>
          <p>Common guidelines:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>RAG retrieval:</strong> 0.7 - 0.85
            </li>
            <li>
              <strong>Deduplication:</strong> 0.85+
            </li>
            <li>
              <strong>Exploratory search:</strong> 0.5 - 0.7
            </li>
          </ul>
          <p>
            The optimal threshold depends on your use case, embedding model,
            and data distribution. Always evaluate with real queries.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Threshold guidelines */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Threshold Guidelines
            </p>
            <div className="grid grid-cols-2 gap-2">
              {THRESHOLD_GUIDELINES.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`rounded-lg border p-2.5 ${item.color}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold">
                      {item.range}
                    </span>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  <p className="mt-1 text-[10px] opacity-80">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search demo with threshold slider and metrics */}
          <SemanticSearchDemo showThreshold showMetrics />
        </InteractiveArea>
      </div>
    </div>
  );
}
