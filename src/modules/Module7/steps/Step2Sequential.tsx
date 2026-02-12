import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { OrchestrationDiagram } from "@/components/orchestration/OrchestrationDiagram";
import { SEQUENTIAL_PATTERN } from "@/data/mock-orchestration";

const FLOW_STAGGER = 0.3;
const FLOW_BASE_DELAY = 1.0;

export function Step2Sequential() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Sequential Pipeline"
          highlights={["Pipeline", "Sequential", "Chain"]}
        >
          <p>
            In a <strong>sequential pipeline</strong>, agents work one after
            another. Each agent receives the output of the previous agent and
            passes its own result to the next.
          </p>
          <p>
            This is the simplest orchestration pattern and works well when each
            step depends on the result of the previous one, like a data
            processing pipeline: <em>extract, transform, load</em>.
          </p>
          <p>
            The downside is latency: the total time is the sum of all steps.
            If steps are independent, consider the parallel pattern instead.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center gap-8">
          {/* Diagram */}
          <OrchestrationDiagram
            agents={SEQUENTIAL_PATTERN.agents}
            layout="sequential"
          />

          {/* Flow steps */}
          <div className="w-full max-w-md space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Flow Steps
            </motion.p>
            {SEQUENTIAL_PATTERN.flow.map((step, i) => (
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
