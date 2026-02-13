import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { EmbeddingHeatmap } from "@/components/tokenization/EmbeddingHeatmap";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const EMBEDDING_FACTS = [
  { label: "GPT-4 dimensions", value: "~12,288" },
  { label: "Claude dimensions", value: "~8,192" },
  { label: "Typical small model", value: "~768" },
  { label: "Lookup table size", value: "vocab x dims" },
] as const;

export function Step3TokensToVectors() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Embedding Lookup"
          highlights={["Vectors", "Semantic", "Dense"]}
        >
          <p>
            After tokenization, each token ID is converted into a{" "}
            <strong>dense vector</strong> (embedding) via a simple table
            lookup. The embedding matrix has one row per vocabulary entry.
          </p>
          <p>Key properties of embeddings:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Dense</strong> - every dimension has a non-zero value,
              unlike sparse one-hot vectors
            </li>
            <li>
              <strong>Learned</strong> - the values are trained during model
              pre-training, not hand-crafted
            </li>
            <li>
              <strong>Semantic</strong> - similar words get similar vectors
              (e.g. &quot;king&quot; and &quot;queen&quot; are close)
            </li>
            <li>
              <strong>High-dimensional</strong> - typically 768 to 12,288
              dimensions per token
            </li>
          </ul>
          <p>
            The heatmap on the right shows a small slice of the embedding
            vectors for four words. Notice how <strong>king/queen</strong> and{" "}
            <strong>apple/banana</strong> have similar patterns.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Token ID to Vector illustration */}
          <div className="flex items-center justify-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
              className="rounded-lg border-2 bg-green-100 border-green-300 text-green-700 px-3 py-2 text-center"
            >
              <p className="text-[10px] uppercase tracking-wide">Token ID</p>
              <p className="font-mono font-bold text-sm">15496</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <ArrowDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: ANIMATION_DURATION }}
              className="rounded-lg border-2 bg-purple-100 border-purple-300 text-purple-700 px-3 py-2 text-center"
            >
              <p className="text-[10px] uppercase tracking-wide">
                Embedding Table
              </p>
              <p className="font-mono text-xs">100k x 8192</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <ArrowDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: ANIMATION_DURATION }}
              className="rounded-lg border-2 bg-amber-100 border-amber-300 text-amber-700 px-3 py-2 text-center"
            >
              <p className="text-[10px] uppercase tracking-wide">Vector</p>
              <p className="font-mono text-xs">[0.12, -0.34, ...]</p>
            </motion.div>
          </div>

          {/* Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.0 + STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
          >
            <EmbeddingHeatmap />
          </motion.div>

          {/* Facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: ANIMATION_DURATION }}
            className="grid grid-cols-4 gap-2"
          >
            {EMBEDDING_FACTS.map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.5 + index * 0.1,
                  duration: 0.3,
                }}
                className="rounded-lg border bg-muted/30 p-2 text-center"
              >
                <p className="text-sm font-bold text-foreground">
                  {fact.value}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {fact.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
