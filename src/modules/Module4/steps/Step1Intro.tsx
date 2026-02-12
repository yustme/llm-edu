import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { INCONSISTENCY_EXPLANATION } from "../data";
import { formatCurrency } from "@/lib/formatters";
import {
  REVENUE_RUN1,
  REVENUE_RUN2,
  REVENUE_RUN3,
} from "@/data/sample-dataset";

const ANIMATION_DURATION = 0.5;
const STAGGER_BASE_DELAY = 0.8;
const STAGGER_INTERVAL = 0.7;

/** Colors for the 3 inconsistent results */
const RESULT_STYLES = [
  { bg: "bg-red-100", border: "border-red-300", text: "text-red-700" },
  { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700" },
  { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-700" },
] as const;

const RESULTS = [
  { value: REVENUE_RUN1, label: "Agent 1" },
  { value: REVENUE_RUN2, label: "Agent 2" },
  { value: REVENUE_RUN3, label: "Agent 3" },
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="The Consistency Problem"
          highlights={["Same Question", "Different Answers", "Why?"]}
        >
          <p>
            Ask the same question to 3 different agents (or the same agent 3
            times), and you may get 3 different answers. Why?
          </p>
          <p>{INCONSISTENCY_EXPLANATION.intro}</p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center gap-8">
          {/* The question */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="flex items-center gap-3 rounded-xl border-2 border-blue-200 bg-blue-50 px-6 py-4"
          >
            <HelpCircle className="h-6 w-6 text-blue-500 shrink-0" />
            <span className="text-lg font-semibold text-blue-800">
              &ldquo;What is total revenue?&rdquo;
            </span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="h-8 w-px bg-border origin-top"
          />

          {/* 3 different results appearing one after another */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {RESULTS.map((result, index) => (
              <motion.div
                key={result.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: STAGGER_BASE_DELAY + index * STAGGER_INTERVAL,
                  duration: ANIMATION_DURATION,
                }}
                className={`flex items-center justify-between rounded-lg border px-5 py-3 ${RESULT_STYLES[index].bg} ${RESULT_STYLES[index].border}`}
              >
                <span
                  className={`text-sm font-medium ${RESULT_STYLES[index].text}`}
                >
                  {result.label}:
                </span>
                <span
                  className={`text-xl font-bold ${RESULT_STYLES[index].text}`}
                >
                  {formatCurrency(result.value)}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Inconsistency callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: STAGGER_BASE_DELAY + 3 * STAGGER_INTERVAL,
              duration: 0.6,
            }}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center"
          >
            <p className="text-sm font-semibold text-red-700">
              3 agents, 3 different answers for the same question
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
