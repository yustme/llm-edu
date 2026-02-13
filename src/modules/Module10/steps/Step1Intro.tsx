import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { SimilarityPairCard } from "@/components/similarity/SimilarityPairCard";
import { WORD_PAIRS } from "@/data/mock-similarity";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

/** Number of word pairs to display in the intro grid */
const DISPLAY_PAIR_COUNT = 6;

const APPROACHES = [
  {
    label: "Exact Match",
    description: "\"dog\" matches \"dog\" only - no flexibility",
    color: "bg-red-100 border-red-300 text-red-700",
  },
  {
    label: "Keyword Overlap",
    description: "Counts shared words - misses synonyms",
    color: "bg-yellow-100 border-yellow-300 text-yellow-700",
  },
  {
    label: "Semantic Similarity",
    description: "Understands meaning - \"dog\" is close to \"puppy\"",
    color: "bg-green-100 border-green-300 text-green-700",
  },
] as const;

export function Step1Intro() {
  const displayPairs = WORD_PAIRS.slice(0, DISPLAY_PAIR_COUNT);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Similarity Matters"
          highlights={["Semantic", "Cosine", "Embeddings"]}
        >
          <p>
            When building AI systems, we need to measure how{" "}
            <strong>similar</strong> two pieces of text are. There are three
            common approaches:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Exact match</strong> - only identical strings match
            </li>
            <li>
              <strong>Keyword overlap</strong> - counts shared words (TF-IDF,
              BM25)
            </li>
            <li>
              <strong>Semantic similarity</strong> - compares meaning using
              vector embeddings
            </li>
          </ul>
          <p>
            <strong>Cosine similarity</strong> is the most widely used metric
            for comparing text embeddings. It measures the angle between two
            vectors, ignoring their magnitude.
          </p>
          <p>
            This is critical for <strong>RAG</strong> (retrieval step),{" "}
            <strong>semantic search</strong>, deduplication, and
            recommendation systems.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Three approaches comparison */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Text Similarity Approaches
            </p>
            <div className="flex gap-2">
              {APPROACHES.map((approach, index) => (
                <motion.div
                  key={approach.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`flex-1 rounded-lg border-2 p-3 text-center ${approach.color}`}
                >
                  <p className="text-xs font-bold">{approach.label}</p>
                  <p className="mt-1 text-[10px] opacity-80">
                    {approach.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Word pair similarity cards */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Word Pair Similarities (Embedding-Based)
            </p>
            <div className="space-y-2">
              {displayPairs.map((pair, index) => (
                <SimilarityPairCard
                  key={pair.id}
                  wordA={pair.wordA}
                  wordB={pair.wordB}
                  similarity={pair.similarity}
                  delay={0.5 + index * STAGGER_DELAY}
                />
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
