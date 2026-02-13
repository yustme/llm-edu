import { motion } from "framer-motion";
import { Check, Wrench } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { APPROACH_COMPARISONS, KG_TOOLS } from "@/data/mock-knowledge-graph";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const WHEN_TO_USE = [
  "You need explicit relationships between entities",
  "Questions require multi-hop reasoning",
  "Traceability and explainability matter",
  "You have a well-defined domain with clear entity types",
  "Fact-checking and hallucination reduction are priorities",
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Summary & Comparison"
          highlights={[
            "Knowledge Graphs",
            "Vector DB",
            "Hybrid",
            "GraphRAG",
          ]}
        >
          <p>
            Knowledge graphs provide <strong>structured, traversable</strong>{" "}
            knowledge that complements the capabilities of LLMs and vector
            databases. Choosing the right approach depends on your use case.
          </p>
          <p>When to use knowledge graphs:</p>
          <ul className="list-disc space-y-1 pl-5">
            {WHEN_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            In practice, many production systems use a{" "}
            <strong>hybrid approach</strong> -- vector search for initial
            retrieval and knowledge graphs for structured reasoning and
            fact-checking. This pattern, known as <strong>GraphRAG</strong>,
            delivers the best accuracy for knowledge-intensive applications.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Comparison table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Approach Comparison
            </p>
            <div className="space-y-3">
              {APPROACH_COMPARISONS.map((approach, i) => (
                <motion.div
                  key={approach.approach}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="rounded-lg border bg-card"
                >
                  <div className="border-b px-4 py-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {approach.approach}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Best for: {approach.bestFor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-0">
                    <div className="border-r p-3">
                      <p className="mb-1.5 text-xs font-medium text-green-600">
                        Strengths
                      </p>
                      <ul className="space-y-1">
                        {approach.strengths.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-1.5 text-xs text-muted-foreground"
                          >
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3">
                      <p className="mb-1.5 text-xs font-medium text-amber-600">
                        Limitations
                      </p>
                      <ul className="space-y-1">
                        {approach.weaknesses.map((w) => (
                          <li
                            key={w}
                            className="flex items-start gap-1.5 text-xs text-muted-foreground"
                          >
                            <span className="mt-0.5 h-3 w-3 shrink-0 text-center text-amber-500">
                              -
                            </span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
              Tools & Frameworks
            </p>
            <div className="grid grid-cols-2 gap-2">
              {KG_TOOLS.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.6 + i * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-2 rounded-lg border bg-card px-3 py-2"
                >
                  <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {tool.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
