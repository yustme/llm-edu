import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { LLM_WITHOUT_KG, LLM_WITH_KG } from "@/data/mock-knowledge-graph";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

const USE_CASES = [
  {
    title: "Fact Checking",
    description:
      "Verify LLM claims against graph edges. If the graph has no edge for a claim, flag it as unverified.",
  },
  {
    title: "Reasoning Chains",
    description:
      "Follow multi-hop paths through the graph to answer complex questions with traceable logic.",
  },
  {
    title: "Grounding / Hallucination Reduction",
    description:
      "Constrain LLM outputs to facts present in the knowledge graph, reducing fabricated information.",
  },
  {
    title: "Entity Disambiguation",
    description:
      "Use graph structure to resolve ambiguous references (e.g., 'Cambridge' the city vs. the university).",
  },
] as const;

export function Step5KGsAndLLMs() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="KGs + LLMs"
          highlights={[
            "Fact Checking",
            "Reasoning Chains",
            "Grounding",
            "GraphRAG",
          ]}
        >
          <p>
            Large Language Models are powerful but prone to{" "}
            <strong>hallucination</strong> -- generating plausible but incorrect
            facts. Knowledge graphs provide a structured source of truth that
            LLMs can query to ground their responses.
          </p>
          <p>How LLMs leverage knowledge graphs:</p>
          <ul className="list-disc space-y-1 pl-5">
            {USE_CASES.map((uc) => (
              <li key={uc.title}>
                <strong>{uc.title}</strong> -- {uc.description}
              </li>
            ))}
          </ul>
          <p>
            The emerging pattern <strong>GraphRAG</strong> (Graph Retrieval
            Augmented Generation) combines traditional vector-based RAG with
            knowledge graph traversal for the best of both worlds.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Question */}
          <div className="rounded-lg border bg-muted/50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Question
            </p>
            <p className="text-sm font-semibold text-foreground">
              {LLM_WITH_KG.question}
            </p>
          </div>

          {/* Comparison */}
          <ComparisonView
            leftLabel="Without Knowledge Graph"
            rightLabel="With Knowledge Graph"
            leftContent={
              <div className="space-y-3">
                <p className="text-sm text-foreground">
                  {LLM_WITHOUT_KG.response}
                </p>
                <div className="space-y-1.5">
                  {LLM_WITHOUT_KG.issues.map((issue, i) => (
                    <motion.div
                      key={issue}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="flex items-start gap-2 text-xs"
                    >
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                      <span className="text-muted-foreground">{issue}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            }
            rightContent={
              <div className="space-y-3">
                <p className="text-sm text-foreground">
                  {LLM_WITH_KG.response}
                </p>
                <div className="space-y-1.5">
                  {LLM_WITH_KG.advantages.map((advantage, i) => (
                    <motion.div
                      key={advantage}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="flex items-start gap-2 text-xs"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      <span className="text-muted-foreground">{advantage}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            }
          />

          {/* Use cases grid */}
          <div>
            <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
              Key LLM + KG Integration Patterns
            </p>
            <div className="grid grid-cols-2 gap-2">
              {USE_CASES.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + i * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="rounded-lg border bg-card px-3 py-2"
                >
                  <p className="text-xs font-semibold text-foreground">
                    {uc.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {uc.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
