import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, FileText, GitBranch } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { OPTIMIZATION_TECHNIQUES } from "../data";
import type { OptimizationTechnique } from "../data";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const TECHNIQUE_ICONS: Record<string, React.ElementType> = {
  caching: Zap,
  "model-routing": Brain,
  "prompt-optimization": FileText,
  "parallel-tools": GitBranch,
};

export function Step4Strategies() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  const toggleTechnique = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Count how many techniques are enabled (in order) for stepper position
  const enabledCount = OPTIMIZATION_TECHNIQUES.filter(
    (t) => enabled[t.id],
  ).length;

  const setEnabledCount = useCallback((count: number) => {
    const next: Record<string, boolean> = {};
    OPTIMIZATION_TECHNIQUES.forEach((t, i) => {
      next[t.id] = i < count;
    });
    setEnabled(next);
  }, []);

  useFullscreenStepper(
    enabledCount,
    OPTIMIZATION_TECHNIQUES.length + 1,
    setEnabledCount,
  );

  const totalCostReduction = OPTIMIZATION_TECHNIQUES.reduce(
    (sum, t) => sum + (enabled[t.id] ? t.costReduction : 0),
    0,
  );

  const totalLatencyReduction = OPTIMIZATION_TECHNIQUES.reduce(
    (sum, t) => sum + (enabled[t.id] ? t.latencyReduction : 0),
    0,
  );

  const clampedCost = Math.min(totalCostReduction, 80);
  const clampedLatency = Math.min(totalLatencyReduction, 80);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Optimization Strategies"
          highlights={["Caching", "Model Routing", "Prompt Tuning", "Parallel"]}
        >
          <p>
            There are four main techniques to reduce cost and latency in
            production AI agents. Each targets a different bottleneck.
          </p>
          <p>
            Toggle each technique on the right to see its impact. In practice,
            these optimizations <strong>compound</strong> - applying multiple
            techniques together yields the best results.
          </p>
          <p>
            The key is to <strong>measure first</strong>, identify your biggest
            bottleneck, and apply the most impactful optimization. Then measure
            again.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Toggle Optimizations
          </p>

          {/* Technique cards with toggles */}
          <div className="space-y-3">
            {OPTIMIZATION_TECHNIQUES.map(
              (technique: OptimizationTechnique, index: number) => {
                const Icon =
                  TECHNIQUE_ICONS[technique.id] ?? Zap;
                const isEnabled = enabled[technique.id] ?? false;

                return (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-3 rounded-lg border bg-card p-3"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {technique.name}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {technique.description}
                      </p>
                      <div className="mt-1 flex gap-2">
                        {technique.costReduction > 0 && (
                          <span className="text-xs font-medium text-green-600">
                            -{technique.costReduction}% cost
                          </span>
                        )}
                        {technique.latencyReduction > 0 && (
                          <span className="text-xs font-medium text-blue-600">
                            -{technique.latencyReduction}% latency
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTechnique(technique.id)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        isEnabled ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          isEnabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </motion.div>
                );
              },
            )}
          </div>

          {/* Total savings summary */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${clampedCost}-${clampedLatency}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Estimated Total Savings
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-green-600 tabular-nums">
                    -{clampedCost}%
                  </p>
                  <p className="text-xs text-muted-foreground">Cost</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600 tabular-nums">
                    -{clampedLatency}%
                  </p>
                  <p className="text-xs text-muted-foreground">Latency</p>
                </div>
              </div>

              {/* Savings bars */}
              <div className="mt-3 space-y-2">
                <div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${clampedCost}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${clampedLatency}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </InteractiveArea>
      </div>
    </div>
  );
}
