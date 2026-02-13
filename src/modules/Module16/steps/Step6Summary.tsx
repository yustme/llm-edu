import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { CHALLENGES_AND_SOLUTIONS } from "../data";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Schema First", "Validate", "Semantic Layer"]}
        >
          <p>
            Text-to-SQL bridges the gap between natural language and databases,
            but requires careful engineering to work reliably.
          </p>
          <p>Key principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Always provide schema context</strong> - the LLM must know
              available tables and columns
            </li>
            <li>
              <strong>Validate before executing</strong> - check SQL syntax and
              permissions before running queries
            </li>
            <li>
              <strong>Use a semantic layer</strong> (Module 4) to define
              canonical metrics and resolve ambiguity
            </li>
            <li>
              <strong>Handle errors gracefully</strong> - retry with refined
              prompts when queries fail
            </li>
          </ul>
          <p>
            The <strong>Semantic Layer</strong> from Module 4 directly improves
            Text-to-SQL by providing pre-defined metric definitions, eliminating
            ambiguity in questions like &ldquo;what is revenue?&rdquo;
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <ComparisonView
            leftLabel="Without Semantic Layer"
            rightLabel="With Semantic Layer"
            leftContent={
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>LLM guesses what &ldquo;revenue&rdquo; means</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Inconsistent results across queries</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>May include cancelled orders in revenue</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Different SQL each time for same question</span>
                </div>
              </div>
            }
            rightContent={
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Canonical metric definitions provided</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Consistent results every time</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Revenue = completed orders after discounts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Deterministic SQL from defined formulas</span>
                </div>
              </div>
            }
          />

          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Challenges & Solutions
            </p>
            <div className="space-y-2">
              {CHALLENGES_AND_SOLUTIONS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.challenge}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.solution}
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
