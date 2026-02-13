import { motion } from "framer-motion";
import {
  FileText,
  GitBranch,
  Network,
  Layers,
  Database,
  Route,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { GRAPH_RAG_ARCHITECTURE } from "@/data/mock-graph-rag";
import { KEY_TAKEAWAYS } from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;
const PIPELINE_DELAY_BASE = 0.3;
const PIPELINE_DELAY_STEP = 0.35;

/** Icons for architecture stages */
const ARCHITECTURE_ICONS: LucideIcon[] = [
  FileText,
  GitBranch,
  Network,
  Layers,
  Database,
  Route,
  CheckCircle,
];

/** Color classes for architecture stages */
const ARCHITECTURE_COLORS = [
  "bg-gray-100 text-gray-600 border-gray-200",
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-green-100 text-green-600 border-green-200",
  "bg-amber-100 text-amber-600 border-amber-200",
  "bg-violet-100 text-violet-600 border-violet-200",
  "bg-orange-100 text-orange-600 border-orange-200",
  "bg-emerald-100 text-emerald-600 border-emerald-200",
] as const;

/** Takeaway card icons */
const TAKEAWAY_ICONS: LucideIcon[] = [
  Network,
  Layers,
  Route,
  GitBranch,
];

const TAKEAWAY_COLORS = [
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-amber-100 text-amber-600 border-amber-200",
  "bg-green-100 text-green-600 border-green-200",
  "bg-violet-100 text-violet-600 border-violet-200",
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Key takeaways */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["GraphRAG", "Knowledge Graph", "Community Summaries"]}
        >
          <div className="space-y-4">
            {KEY_TAKEAWAYS.map((takeaway, index) => {
              const Icon = TAKEAWAY_ICONS[index];
              const color = TAKEAWAY_COLORS[index];

              return (
                <motion.div
                  key={takeaway.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex gap-3"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {takeaway.title}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {takeaway.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </InfoPanel>
      </div>

      {/* Right: Architecture diagram */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-4 text-center text-sm font-medium text-muted-foreground"
          >
            GraphRAG Architecture Pipeline
          </motion.p>

          <div className="flex flex-col items-center gap-3">
            {GRAPH_RAG_ARCHITECTURE.map((stage, index) => {
              const Icon = ARCHITECTURE_ICONS[index];
              const color = ARCHITECTURE_COLORS[index];

              return (
                <div
                  key={stage.id}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: PIPELINE_DELAY_BASE + index * PIPELINE_DELAY_STEP,
                      duration: ANIMATION_DURATION,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 ${color}`}
                    >
                      <Icon className="h-5 w-5" />
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
                  {index < GRAPH_RAG_ARCHITECTURE.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{
                        delay:
                          PIPELINE_DELAY_BASE +
                          index * PIPELINE_DELAY_STEP +
                          PIPELINE_DELAY_STEP * 0.5,
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
        </InteractiveArea>
      </div>
    </div>
  );
}
