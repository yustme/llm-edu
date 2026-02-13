import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minimize2, Filter, Database, Scissors, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CONTEXT_OPTIMIZATIONS } from "@/data/mock-context-window";
import type { ContextOptimization } from "@/data/mock-context-window";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

const TECHNIQUE_ICONS: Record<string, React.ElementType> = {
  "prompt-compression": Minimize2,
  "few-shot-selection": Filter,
  "context-caching": Database,
  "chunked-retrieval": Archive,
  "tool-result-trimming": Scissors,
};

export function Step5Optimization() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Optimization Techniques"
          highlights={[
            "Compression",
            "Few-Shot",
            "Caching",
            "Chunking",
          ]}
        >
          <p>
            Token usage directly impacts <strong>cost</strong> and{" "}
            <strong>latency</strong>. Optimizing how you use the context window
            can dramatically reduce both.
          </p>
          <p>
            The key principle: send only what the model needs, nothing more.
            Every token that does not contribute to the answer is wasted budget.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Compress prompts</strong> -- replace verbose instructions
              with concise formats
            </li>
            <li>
              <strong>Select examples dynamically</strong> -- use similarity
              search to pick only relevant few-shot examples
            </li>
            <li>
              <strong>Cache static context</strong> -- avoid re-sending the
              same system prompt on every request
            </li>
            <li>
              <strong>Chunk documents</strong> -- retrieve small, relevant
              passages instead of entire documents
            </li>
            <li>
              <strong>Trim tool results</strong> -- extract only the fields the
              model needs from API responses
            </li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Click a technique to see details
          </p>

          <div className="space-y-3">
            {CONTEXT_OPTIMIZATIONS.map(
              (technique: ContextOptimization, index: number) => {
                const Icon =
                  TECHNIQUE_ICONS[technique.id] ?? Minimize2;
                const isExpanded = expandedId === technique.id;

                return (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                  >
                    <button
                      onClick={() => toggleExpand(technique.id)}
                      className={cn(
                        "w-full rounded-lg border bg-card p-3 text-left transition-colors",
                        isExpanded
                          ? "border-primary/40 bg-primary/5"
                          : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground">
                              {technique.name}
                            </p>
                            <span className="text-xs font-medium text-green-600">
                              {technique.savings}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                            {technique.description}
                          </p>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mx-3 mt-2 rounded-md bg-muted/50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                              Example
                            </p>
                            <pre className="whitespace-pre-wrap text-xs text-foreground leading-relaxed font-mono">
                              {technique.example}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              },
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
