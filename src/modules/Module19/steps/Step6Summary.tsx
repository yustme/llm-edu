import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import {
  GROUNDING_BEST_PRACTICES,
  STRATEGY_GUIDE,
} from "@/data/mock-grounding";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={[
            "Ground Everything",
            "Cite Sources",
            "Verify Claims",
          ]}
        >
          <p>
            Grounding transforms LLM outputs from plausible guesses into
            verifiable, trustworthy answers. It is not a single technique but
            a combination of retrieval, citation, and verification strategies.
          </p>
          <p>Core principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Never trust parametric memory alone</strong> -- always
              retrieve and verify against authoritative sources
            </li>
            <li>
              <strong>Cite everything</strong> -- if a claim cannot be
              attributed to a source, it should not be in the response
            </li>
            <li>
              <strong>Verify after generation</strong> -- a post-generation
              fact-check step catches hallucinations that slip through
            </li>
            <li>
              <strong>Match technique to use case</strong> -- RAG for static
              knowledge, tool-use for live data, self-consistency for reasoning
            </li>
            <li>
              <strong>Monitor in production</strong> -- track hallucination
              rates, citation accuracy, and user trust metrics over time
            </li>
          </ul>
          <p>
            Combined with <strong>RAG</strong> (Module 5),{" "}
            <strong>Evaluation</strong> (Module 9), and{" "}
            <strong>Guardrails</strong> (Module 8), grounding is a critical
            pillar of production-grade AI systems.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Best practices checklist */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Grounding Best Practices Checklist
            </p>
            <div className="space-y-2">
              {GROUNDING_BEST_PRACTICES.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Strategy selection guide */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Grounding Strategy Selection Guide
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      Use Case
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      Recommended Approach
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {STRATEGY_GUIDE.map((row, index) => (
                    <motion.tr
                      key={row.useCase}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay:
                          GROUNDING_BEST_PRACTICES.length * STAGGER_DELAY +
                          index * 0.08,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-2 font-medium text-foreground">
                        {row.useCase}
                      </td>
                      <td className="px-3 py-2 font-medium text-primary">
                        {row.approach}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {row.reasoning}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
