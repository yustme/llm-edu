import { motion } from "framer-motion";
import { Layers, Brain, SlidersHorizontal } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { RecursiveSplitDiagram } from "@/components/chunking/RecursiveSplitDiagram";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const ADVANCED_METHODS = [
  {
    icon: Layers,
    name: "Recursive Splitting",
    description:
      "Try the largest separator first (paragraphs), then fall back to smaller separators (sentences, then words) for chunks that exceed the target size.",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    icon: Brain,
    name: "Semantic Chunking",
    description:
      "Group text by topic rather than structure. Uses embeddings to detect where the topic shifts, then splits at those boundaries.",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    icon: SlidersHorizontal,
    name: "Sliding Window (Overlap)",
    description:
      "Each chunk overlaps with the previous one by a configurable amount. This preserves context at boundaries and prevents information loss.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
] as const;

export function Step3AdvancedStrategies() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Advanced Strategies"
          highlights={["Recursive", "Semantic", "Overlap"]}
        >
          <p>
            Basic strategies work well for uniform text, but real-world
            documents have varying structure. Advanced strategies{" "}
            <strong>adapt to document complexity</strong>.
          </p>

          <div className="space-y-3 pt-1">
            {ADVANCED_METHODS.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY + 0.2,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-md ${method.color}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {method.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-2">
            <strong>Recursive splitting</strong> is the most common advanced
            strategy. The diagram on the right shows how a document is
            progressively broken down level by level.
          </p>
          <p>
            <strong>Overlap</strong> can be combined with any strategy. A 10-15%
            overlap ensures that sentences spanning chunk boundaries are
            not lost.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4" allowFullscreen>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: ANIMATION_DURATION }}
          >
            <RecursiveSplitDiagram />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
