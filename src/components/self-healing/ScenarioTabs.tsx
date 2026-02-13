import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelfHealingScenario } from "@/data/mock-self-healing";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.35;

interface ScenarioTabsProps {
  scenarios: SelfHealingScenario[];
  className?: string;
}

/**
 * Tabbed view showing self-healing scenarios across different domains.
 * Each tab reveals a vertical stepper/timeline of the error-fix flow.
 */
export function ScenarioTabs({ scenarios, className }: ScenarioTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const activeScenario = scenarios[activeTab];
  if (!activeScenario) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Tab buttons */}
      <div className="flex gap-2">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => setActiveTab(index)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              index === activeTab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {/* Scenario description */}
      <p className="text-sm text-muted-foreground">
        {activeScenario.description}
      </p>

      {/* Vertical stepper timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScenario.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: ANIMATION_DURATION }}
          className="space-y-0"
        >
          {activeScenario.steps.map((step, index) => {
            const isLast = index === activeScenario.steps.length - 1;

            return (
              <motion.div
                key={`${activeScenario.id}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="flex gap-3"
              >
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                      step.isError
                        ? "border-red-400 bg-red-50 text-red-600"
                        : "border-green-400 bg-green-50 text-green-600",
                    )}
                  >
                    {step.isError ? (
                      <X className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 min-h-[16px]",
                        step.isError ? "bg-red-200" : "bg-green-200",
                      )}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="pb-4 pt-0.5">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide",
                      step.isError
                        ? "text-red-600"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  <div
                    className={cn(
                      "mt-1 rounded-md px-3 py-2 text-xs font-mono leading-relaxed",
                      step.isError
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {step.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
