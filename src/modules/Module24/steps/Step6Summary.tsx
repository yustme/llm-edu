import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { OPTIMIZATION_CHECKLIST } from "../data";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const WORKFLOW_STEPS = [
  { label: "Measure", description: "Establish baseline metrics" },
  { label: "Identify", description: "Find the biggest bottleneck" },
  { label: "Optimize", description: "Apply targeted technique" },
  { label: "Validate", description: "Measure improvement" },
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Optimization Decision Framework"
          highlights={["Measure First", "Targeted Changes", "Iterate"]}
        >
          <p>
            Optimization is an iterative process. The key principle is:{" "}
            <strong>measure, identify, optimize, validate</strong>.
          </p>
          <p>Key takeaways:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Always <strong>measure baseline</strong> cost and latency before
              making changes
            </li>
            <li>
              <strong>Model routing</strong> gives the biggest cost reduction
              by using cheaper models for simple tasks
            </li>
            <li>
              <strong>Caching</strong> eliminates redundant calls entirely -
              the fastest/cheapest call is the one you never make
            </li>
            <li>
              <strong>Parallel tool calls</strong> reduce latency when multiple
              independent tools are needed
            </li>
            <li>
              <strong>Prompt optimization</strong> reduces token count, which
              impacts both cost and latency
            </li>
          </ul>
          <p>
            Start with the highest-impact optimization for your specific
            bottleneck, then iterate.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Optimization workflow */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Optimization Workflow
            </p>
            <div className="flex items-center justify-center gap-2">
              {WORKFLOW_STEPS.map((step, index) => (
                <div key={step.label} className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2 + index * 0.2,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {step.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground text-center max-w-20">
                      {step.description}
                    </span>
                  </motion.div>
                  {index < WORKFLOW_STEPS.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.2, duration: 0.3 }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optimization checklist */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Optimization Checklist
            </p>
            <div className="space-y-2">
              {OPTIMIZATION_CHECKLIST.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 1.0 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
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
