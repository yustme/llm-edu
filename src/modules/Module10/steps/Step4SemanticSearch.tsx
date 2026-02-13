import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { SemanticSearchDemo } from "@/components/similarity/SemanticSearchDemo";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const PIPELINE_STEPS = [
  { label: "Query", description: "User types a natural language question" },
  { label: "Embed", description: "Convert query to a vector embedding" },
  { label: "Compare", description: "Compute cosine similarity with all docs" },
  { label: "Rank", description: "Sort documents by similarity score" },
] as const;

const PIPELINE_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-700",
  "bg-purple-100 border-purple-300 text-purple-700",
  "bg-amber-100 border-amber-300 text-amber-700",
  "bg-green-100 border-green-300 text-green-700",
] as const;

export function Step4SemanticSearch() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Semantic Search"
          highlights={["Embed", "Compare", "Rank"]}
        >
          <p>
            <strong>Semantic search</strong> uses cosine similarity to find
            documents that are{" "}
            <strong>conceptually similar</strong> to a query, even if they do
            not share exact keywords.
          </p>
          <p>The pipeline works in four steps:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Embed the query</strong> into a vector using a model
              like OpenAI text-embedding-3-small
            </li>
            <li>
              <strong>Compare</strong> the query vector against all stored
              document vectors
            </li>
            <li>
              <strong>Rank</strong> documents by their cosine similarity score
            </li>
            <li>
              <strong>Return top-k</strong> most similar documents as context
            </li>
          </ul>
          <p>
            This is the core of the <strong>retrieval step in RAG</strong>{" "}
            (Module 5). The quality of your retrieval directly affects the
            quality of the generated answer.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Pipeline visualization */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Semantic Search Pipeline
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {PIPELINE_STEPS.map((step, index) => (
                <div key={step.label} className="flex items-center gap-1.5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className={`rounded-lg border-2 px-3 py-2 text-center ${PIPELINE_COLORS[index]}`}
                  >
                    <p className="text-xs font-bold">{step.label}</p>
                    <p className="text-[9px] opacity-80 max-w-20">
                      {step.description}
                    </p>
                  </motion.div>
                  {index < PIPELINE_STEPS.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.1 + index * STAGGER_DELAY,
                        duration: 0.3,
                      }}
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search demo */}
          <SemanticSearchDemo showThreshold={false} />
        </InteractiveArea>
      </div>
    </div>
  );
}
