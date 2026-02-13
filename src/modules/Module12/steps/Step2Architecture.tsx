import { motion } from "framer-motion";
import {
  MessageSquare,
  Binary,
  Search,
  FileText,
  Brain,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { RAG_PIPELINE_STAGES } from "../data";

const ANIMATION_DELAY_BASE = 0.3;
const ANIMATION_DELAY_STEP = 0.45;
const ANIMATION_DURATION = 0.5;

/** Map pipeline stage index to its icon */
const STAGE_ICONS: LucideIcon[] = [
  MessageSquare,
  Binary,
  Search,
  FileText,
  Brain,
  CheckCircle,
];

/** Color classes for each pipeline stage */
const STAGE_COLORS = [
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-violet-100 text-violet-600 border-violet-200",
  "bg-amber-100 text-amber-600 border-amber-200",
  "bg-orange-100 text-orange-600 border-orange-200",
  "bg-purple-100 text-purple-600 border-purple-200",
  "bg-green-100 text-green-600 border-green-200",
] as const;

/** Animated RAG pipeline flow diagram */
function PipelineDiagram() {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {RAG_PIPELINE_STAGES.map((stage, index) => {
        const Icon = STAGE_ICONS[index];
        const color = STAGE_COLORS[index];

        return (
          <div key={stage.label} className="flex flex-col items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: ANIMATION_DELAY_BASE + index * ANIMATION_DELAY_STEP,
                duration: ANIMATION_DURATION,
                ease: "easeOut",
              }}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 ${color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {stage.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stage.description}
                </p>
              </div>
            </motion.div>

            {/* Arrow between stages */}
            {index < RAG_PIPELINE_STAGES.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{
                  delay:
                    ANIMATION_DELAY_BASE +
                    index * ANIMATION_DELAY_STEP +
                    ANIMATION_DELAY_STEP * 0.5,
                  duration: 0.3,
                }}
                className="origin-top"
              >
                <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Step2Architecture() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="The RAG Pipeline"
          highlights={["Embed", "Retrieve", "Generate"]}
        >
          <p>
            RAG follows a simple but powerful pipeline that connects user queries
            to relevant documents before the LLM generates a response.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <span className="font-medium">Query</span> - The user asks a
              natural language question.
            </li>
            <li>
              <span className="font-medium">Embed</span> - The query is
              converted into a vector (numerical representation) by an embedding
              model.
            </li>
            <li>
              <span className="font-medium">Retrieve</span> - A vector database
              finds the most similar document chunks by comparing embeddings.
            </li>
            <li>
              <span className="font-medium">Generate</span> - The LLM receives
              both the original query and the retrieved chunks as context, then
              produces a grounded answer.
            </li>
          </ol>
          <p>
            This approach keeps the LLM's core strength (language understanding
            and generation) while adding access to up-to-date, domain-specific
            knowledge.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-2 text-center text-sm font-medium text-muted-foreground"
          >
            RAG Pipeline Flow:
          </motion.p>
          <PipelineDiagram />
        </InteractiveArea>
      </div>
    </div>
  );
}
