import { motion } from "framer-motion";
import { FileCheck, Scissors, BarChart3, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { RAG_BEST_PRACTICES } from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

/** Icons for each best practice card */
const PRACTICE_ICONS: LucideIcon[] = [
  FileCheck,
  Scissors,
  BarChart3,
  RefreshCw,
];

/** Color classes for each best practice card */
const PRACTICE_COLORS = [
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-violet-100 text-violet-600 border-violet-200",
  "bg-amber-100 text-amber-600 border-amber-200",
  "bg-green-100 text-green-600 border-green-200",
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["RAG", "Grounding", "Knowledge Base"]}
        >
          <ul className="list-none space-y-4 pl-0">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <span className="font-semibold text-foreground">
                RAG grounds LLM answers in real documents.
              </span>{" "}
              Instead of relying on potentially outdated training data, the model
              generates responses based on retrieved, up-to-date content from
              your knowledge base.
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
            >
              <span className="font-semibold text-foreground">
                Retrieval quality determines answer quality.
              </span>{" "}
              The best LLM in the world cannot produce a good answer if the
              retrieval step returns irrelevant or incomplete documents.
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + STAGGER_DELAY * 2,
                duration: ANIMATION_DURATION,
              }}
            >
              <span className="font-semibold text-foreground">
                RAG is cheaper and faster than fine-tuning.
              </span>{" "}
              Updating knowledge is as simple as re-indexing documents. No
              expensive retraining or GPU hours required.
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + STAGGER_DELAY * 3,
                duration: ANIMATION_DURATION,
              }}
            >
              <span className="font-semibold text-foreground">
                Citations enable trust and verification.
              </span>{" "}
              Because RAG answers reference specific source documents, users can
              verify claims and build trust in the system's outputs.
            </motion.li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
            RAG Best Practices
          </p>
          <div className="grid grid-cols-2 gap-4">
            {RAG_BEST_PRACTICES.map((practice, index) => {
              const Icon = PRACTICE_ICONS[index];
              const color = PRACTICE_COLORS[index];

              return (
                <motion.div
                  key={practice.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                    ease: "easeOut",
                  }}
                  className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {practice.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {practice.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
