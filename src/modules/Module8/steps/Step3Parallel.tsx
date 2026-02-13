import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { OrchestrationDiagram } from "@/components/orchestration/OrchestrationDiagram";
import { PARALLEL_PATTERN } from "@/data/mock-orchestration";

const FLOW_STAGGER = 0.3;
const FLOW_BASE_DELAY = 1.2;

export function Step3Parallel() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Parallel Fan-Out"
          highlights={["Fan-Out", "Parallel", "Merge"]}
        >
          <p>
            In the <strong>parallel fan-out</strong> pattern, an orchestrator
            splits the task into independent sub-tasks. Multiple agents work
            on them concurrently, and a merger combines the results.
          </p>
          <p>
            This is much faster than sequential processing for tasks where
            sub-tasks do not depend on each other. The total latency equals
            the longest sub-task, not the sum.
          </p>
          <p>
            Use cases include multi-source research, parallel data analysis,
            and any scenario where work can be divided into independent units.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center gap-8">
          {/* Diagram */}
          <OrchestrationDiagram
            agents={PARALLEL_PATTERN.agents}
            layout="parallel"
          />

          {/* Flow steps */}
          <div className="w-full max-w-md space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.3 }}
              className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Flow Steps
            </motion.p>
            {PARALLEL_PATTERN.flow.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: FLOW_BASE_DELAY + i * FLOW_STAGGER,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="flex items-start gap-3 rounded-lg border bg-card px-4 py-2 text-sm"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
