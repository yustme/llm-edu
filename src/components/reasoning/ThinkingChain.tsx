import { motion } from "framer-motion";
import { Check, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGGER_DELAY = 0.18;
const ANIMATION_DURATION = 0.4;

interface ThinkingStep {
  title: string;
  content: string;
}

interface ThinkingChainProps {
  steps: ThinkingStep[];
  answer: string;
  className?: string;
}

/**
 * Visual representation of a reasoning chain.
 * Steps animate in sequentially with connecting lines.
 * The final answer is highlighted in a special card at the bottom.
 */
export function ThinkingChain({ steps, answer, className }: ThinkingChainProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Thinking steps */}
      <div className="relative space-y-0">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
              ease: "easeOut",
            }}
            className="relative flex gap-3 pb-4"
          >
            {/* Vertical connector line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: index * STAGGER_DELAY + 0.2,
                  duration: 0.3,
                }}
                className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px origin-top bg-border"
              />
            )}

            {/* Step circle */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-purple-100 border-purple-300 text-purple-700 text-xs font-bold">
              {index + 1}
            </div>

            {/* Step content */}
            <div className="flex flex-col gap-1 pt-0.5">
              <span className="text-sm font-semibold text-foreground">
                {step.title}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connector to answer */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{
          delay: steps.length * STAGGER_DELAY,
          duration: 0.3,
        }}
        className="ml-[15px] h-4 w-px origin-top bg-emerald-300"
      />

      {/* Final answer card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: steps.length * STAGGER_DELAY + 0.2,
          duration: ANIMATION_DURATION,
        }}
        className="flex items-start gap-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-400">
          <Check className="h-4 w-4 text-emerald-700" />
        </div>
        <div className="flex flex-col gap-1 pt-0.5">
          <span className="text-sm font-bold text-emerald-800">
            Conclusion
          </span>
          <p className="text-sm leading-relaxed text-emerald-700">
            {answer}
          </p>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: steps.length * STAGGER_DELAY + 0.5, duration: 0.4 }}
        className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Lightbulb className="h-3.5 w-3.5" />
        <span>Each step represents an internal reasoning token sequence</span>
      </motion.div>
    </div>
  );
}
