import { motion } from "framer-motion";
import { Check, X, CheckCircle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import {
  USE_CASE_RECOMMENDATIONS,
  REASONING_BEST_PRACTICES,
} from "@/data/mock-reasoning";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

export function Step6Summary() {
  const useReasoningCases = USE_CASE_RECOMMENDATIONS.filter(
    (r) => r.useReasoning,
  );
  const skipReasoningCases = USE_CASE_RECOMMENDATIONS.filter(
    (r) => !r.useReasoning,
  );

  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["When to Use", "Best Practices", "Tradeoffs"]}
        >
          <ul className="list-none space-y-4 pl-0">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <span className="font-semibold text-foreground">
                Reasoning improves accuracy on complex tasks.
              </span>{" "}
              Chain-of-thought prompting and reasoning models decompose hard
              problems into manageable steps, dramatically reducing errors on
              math, logic, and coding tasks.
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
                Not every task needs reasoning.
              </span>{" "}
              Simple factual Q&A, classification, and extraction tasks perform
              well without chain-of-thought. Adding reasoning tokens to easy
              tasks wastes money and increases latency.
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
                Multiple strategies exist for different needs.
              </span>{" "}
              Zero-shot CoT is the simplest starting point. Tree-of-thought
              explores solution spaces. Self-consistency increases confidence.
              ReAct enables tool-augmented reasoning.
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
                Reasoning tokens have a cost.
              </span>{" "}
              Reasoning models produce additional hidden or visible thinking
              tokens that increase both latency and expense. Always evaluate
              the cost-accuracy tradeoff for your use case.
            </motion.li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area */}
      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Use case recommendations */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              When to Use Reasoning
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Use reasoning */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: ANIMATION_DURATION }}
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-800">
                    Use Reasoning
                  </span>
                </div>
                <div className="space-y-3">
                  {useReasoningCases.map((rec, index) => (
                    <motion.div
                      key={rec.useCase}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.5 + index * STAGGER_DELAY,
                        duration: 0.3,
                      }}
                    >
                      <p className="text-xs font-semibold text-emerald-800">
                        {rec.useCase}
                      </p>
                      <p className="text-[10px] leading-relaxed text-emerald-700">
                        {rec.explanation}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Skip reasoning */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: ANIMATION_DURATION }}
                className="rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <X className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-bold text-red-800">
                    Skip Reasoning
                  </span>
                </div>
                <div className="space-y-3">
                  {skipReasoningCases.map((rec, index) => (
                    <motion.div
                      key={rec.useCase}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.6 + index * STAGGER_DELAY,
                        duration: 0.3,
                      }}
                    >
                      <p className="text-xs font-semibold text-red-800">
                        {rec.useCase}
                      </p>
                      <p className="text-[10px] leading-relaxed text-red-700">
                        {rec.explanation}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Best practices checklist */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.0,
              duration: ANIMATION_DURATION,
            }}
            className="rounded-xl border bg-card p-4"
          >
            <p className="mb-3 text-sm font-bold text-foreground">
              Best Practices Checklist
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {REASONING_BEST_PRACTICES.map((practice, index) => (
                <motion.div
                  key={practice}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 1.2 + index * 0.05,
                    duration: 0.3,
                  }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="text-[11px] leading-relaxed text-muted-foreground">
                    {practice}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
