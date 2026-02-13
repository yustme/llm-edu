import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { ThinkingChain } from "@/components/reasoning/ThinkingChain";
import { REASONING_COMPARISON } from "@/data/mock-reasoning";

const ANIMATION_DURATION = 0.4;

export function Step1Intro() {
  const { question, directAnswer, cotAnswer } = REASONING_COMPARISON;

  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Reasoning Matters"
          highlights={["Chain-of-Thought", "Step-by-Step", "Accuracy"]}
        >
          <p>
            Large language models generate text by predicting the next token.
            For simple questions, this works well. But for problems that require
            multi-step logic, a single-pass answer is often wrong.
          </p>
          <p>
            The key insight behind LLM reasoning is simple:{" "}
            <strong>thinking before answering improves accuracy</strong>. When
            the model is encouraged (or trained) to produce intermediate
            reasoning steps, it can decompose complex problems, track state
            across multiple steps, and catch its own mistakes.
          </p>
          <p>
            This is analogous to how humans solve math problems: we do not jump
            to the answer immediately. We write down intermediate steps, check
            our work, and arrive at the correct solution systematically.
          </p>
          <p>
            Compare the two approaches on the right: a direct answer that makes
            a common algebraic error versus a step-by-step chain that arrives at
            the correct result.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="rounded-lg border bg-muted/50 p-4 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Question
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {question}
            </p>
          </motion.div>

          {/* Comparison */}
          <ComparisonView
            leftLabel="Direct Answer"
            rightLabel="Chain-of-Thought"
            leftContent={
              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm leading-relaxed text-red-900">
                  {directAnswer.response}
                </div>
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <X className="h-4 w-4" />
                  <span>
                    Incorrect -- added 20% to the discounted price instead of
                    solving for the original
                  </span>
                </div>
              </div>
            }
            rightContent={
              <div className="space-y-3">
                <ThinkingChain
                  steps={cotAnswer.steps.map((content, i) => ({
                    title: `Step ${i + 1}`,
                    content,
                  }))}
                  answer={cotAnswer.response}
                />
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Check className="h-4 w-4" />
                  <span>
                    Correct -- systematic reasoning leads to the right answer
                  </span>
                </div>
              </div>
            }
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
