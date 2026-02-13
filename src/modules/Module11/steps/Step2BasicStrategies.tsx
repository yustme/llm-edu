import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChunkComparisonView } from "@/components/chunking/ChunkComparisonView";
import { CHUNKING_STRATEGIES } from "@/data/mock-chunking";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

/** Only show the three basic strategies on this step */
const BASIC_STRATEGIES = CHUNKING_STRATEGIES.filter((s) =>
  ["fixed", "sentence", "paragraph"].includes(s.id)
);

export function Step2BasicStrategies() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Basic Chunking Strategies"
          highlights={["Fixed Size", "Sentence", "Paragraph"]}
        >
          <p>
            The simplest chunking approaches split text based on
            structural boundaries. Each has different tradeoffs between
            <strong> predictability</strong> and{" "}
            <strong>semantic coherence</strong>.
          </p>

          {BASIC_STRATEGIES.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * STAGGER_DELAY + 0.2,
                duration: ANIMATION_DURATION,
              }}
            >
              <p className="mt-2">
                <strong>{strategy.name}</strong> - {strategy.description}
              </p>
              <div className="mt-1 flex gap-4 text-xs">
                <div>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Pros:
                  </span>{" "}
                  {strategy.pros.join(", ")}
                </div>
              </div>
              <div className="text-xs">
                <span className="font-medium text-red-600 dark:text-red-400">
                  Cons:
                </span>{" "}
                {strategy.cons.join(", ")}
              </div>
            </motion.div>
          ))}

          <p className="mt-2">
            The comparison on the right shows the same text split with each
            strategy. Notice how fixed-size splitting cuts through sentences,
            while sentence and paragraph splitting preserves meaning boundaries.
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
            <ChunkComparisonView />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
