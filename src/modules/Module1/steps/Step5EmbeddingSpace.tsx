import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { EmbeddingScatter } from "@/components/tokenization/EmbeddingScatter";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const ANALOGY_EXAMPLES = [
  { equation: "king - man + woman", result: "queen" },
  { equation: "Paris - France + Germany", result: "Berlin" },
  { equation: "bigger - big + small", result: "smaller" },
] as const;

export function Step5EmbeddingSpace() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Embedding Space"
          highlights={["Clusters", "Similarity", "Analogies"]}
        >
          <p>
            When we project high-dimensional embeddings onto a 2D plane (using
            techniques like t-SNE or PCA), we can see that{" "}
            <strong>semantically similar words cluster together</strong>.
          </p>
          <p>This happens because the model learns during training that:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Words appearing in similar contexts get similar vectors
            </li>
            <li>
              <strong>Food words</strong> cluster near other food words
            </li>
            <li>
              <strong>Royalty terms</strong> form their own cluster
            </li>
            <li>
              Distances between vectors encode semantic relationships
            </li>
          </ul>
          <p>
            This leads to the famous <strong>word analogies</strong>:
          </p>
          <div className="space-y-1 rounded-lg bg-muted/50 p-3 font-mono text-sm">
            {ANALOGY_EXAMPLES.map((example) => (
              <p key={example.equation}>
                {example.equation} ={" "}
                <strong className="text-primary">{example.result}</strong>
              </p>
            ))}
          </div>
          <p className="text-sm">
            Hover over the clusters on the right to highlight each category.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4" allowFullscreen>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
          >
            <EmbeddingScatter />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.8 + STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Real embedding spaces have <strong>thousands of dimensions</strong>.
              This 2D projection preserves local neighborhoods: words that are
              close in high-dimensional space remain close in 2D.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
