import { motion } from "framer-motion";
import { FileText, Scissors, Box, Database } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const PIPELINE_STEPS = [
  {
    icon: FileText,
    label: "Large Document",
    description: "PDF, article, or knowledge base entry too large for a single embedding",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    icon: Scissors,
    label: "Chunking",
    description: "Split into smaller, meaningful pieces using a chosen strategy",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  {
    icon: Box,
    label: "Embeddings",
    description: "Each chunk is converted to a vector by the embedding model",
    color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    icon: Database,
    label: "Vector DB",
    description: "Vectors are stored and indexed for fast similarity search",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
] as const;

const QUALITY_IMPACTS = [
  {
    factor: "Retrieval Precision",
    description: "Better chunks mean more relevant search results",
  },
  {
    factor: "Answer Accuracy",
    description: "Correct context leads to correct LLM responses",
  },
  {
    factor: "Token Efficiency",
    description: "Right-sized chunks avoid wasting context window tokens",
  },
  {
    factor: "Cost Optimization",
    description: "Fewer irrelevant chunks means fewer embedding and LLM API calls",
  },
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Chunking Matters"
          highlights={["RAG Pipeline", "Embeddings", "Retrieval Quality"]}
        >
          <p>
            Documents in a knowledge base are typically too large to embed as a
            single vector. Embedding models have <strong>token limits</strong>,
            and stuffing an entire document into one vector dilutes the
            semantic signal.
          </p>
          <p>
            <strong>Chunking</strong> is the process of splitting documents into
            smaller pieces before creating embeddings. The quality of your
            chunks directly impacts the quality of your entire RAG pipeline.
          </p>
          <p>
            Poor chunking leads to irrelevant retrievals and hallucinated
            answers. Good chunking preserves context and makes every retrieved
            piece meaningful.
          </p>
          <p>How chunking affects RAG quality:</p>
          <ul className="list-disc space-y-1 pl-5">
            {QUALITY_IMPACTS.map((item) => (
              <li key={item.factor}>
                <strong>{item.factor}</strong> - {item.description}
              </li>
            ))}
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Document Processing Pipeline
          </p>

          {/* Pipeline diagram */}
          <div className="flex flex-col items-center gap-3">
            {PIPELINE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY + 0.2,
                    duration: ANIMATION_DURATION,
                  }}
                  className="w-full"
                >
                  <div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${step.color}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground/50">
                      {index + 1}
                    </span>
                  </div>
                  {/* Arrow connector */}
                  {index < PIPELINE_STEPS.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: index * STAGGER_DELAY + 0.4,
                        duration: 0.2,
                      }}
                      className="flex justify-center py-1"
                    >
                      <div className="h-4 w-px bg-border" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
