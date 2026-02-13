import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { PATTERN_COMPARISON } from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

/** Complexity badge color */
function complexityColor(complexity: string): string {
  switch (complexity) {
    case "Low":
      return "bg-green-100 text-green-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    case "High":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Patterns", "Trade-offs", "Decision Framework"]}
        >
          <ul className="list-none space-y-4 pl-0">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <span className="font-semibold text-foreground">
                Choose the pattern that fits your task structure.
              </span>{" "}
              Sequential for dependent steps, parallel for independent work,
              router for varied query types, evaluator for quality-sensitive
              outputs.
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
                Patterns can be composed.
              </span>{" "}
              A router can dispatch to a sequential pipeline or a parallel
              fan-out. An evaluator can wrap any other pattern to ensure quality.
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
                Start simple, add complexity when needed.
              </span>{" "}
              Begin with a single agent. If that is not enough, add tools. If
              you need multiple agents, choose the simplest orchestration
              pattern that solves your problem.
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
                Monitor and iterate.
              </span>{" "}
              Observe how your agents perform in production. Use the
              evaluator-optimizer pattern to build in self-improvement, and
              track latency to spot bottlenecks.
            </motion.li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-4 text-center text-sm font-medium text-muted-foreground"
          >
            Pattern Comparison
          </motion.p>

          {/* Table header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="grid grid-cols-4 gap-3 border-b pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <span>Pattern</span>
            <span>Best For</span>
            <span>Complexity</span>
            <span>Latency</span>
          </motion.div>

          {/* Table rows */}
          <div className="divide-y">
            {PATTERN_COMPARISON.map((row, index) => (
              <motion.div
                key={row.pattern}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                  ease: "easeOut",
                }}
                className="grid grid-cols-4 gap-3 py-4 text-sm"
              >
                <span className="font-semibold text-foreground">
                  {row.pattern}
                </span>
                <span className="text-muted-foreground">{row.bestFor}</span>
                <span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${complexityColor(row.complexity)}`}
                  >
                    {row.complexity}
                  </span>
                </span>
                <span className="text-muted-foreground">{row.latency}</span>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
