import { motion } from "framer-motion";
import { Code2, GitPullRequest, Server, Globe } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { EVAL_BEST_PRACTICES } from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

/** Deployment workflow stages */
const WORKFLOW_STAGES = [
  {
    label: "Development",
    description: "Write tests, run locally, iterate on prompts and tools",
    icon: Code2,
    color: "bg-blue-100 border-blue-300 text-blue-700",
    iconColor: "text-blue-600",
  },
  {
    label: "PR Review",
    description: "Automated eval suite runs on every pull request",
    icon: GitPullRequest,
    color: "bg-purple-100 border-purple-300 text-purple-700",
    iconColor: "text-purple-600",
  },
  {
    label: "Staging",
    description: "Full E2E evaluation in a production-like environment",
    icon: Server,
    color: "bg-amber-100 border-amber-300 text-amber-700",
    iconColor: "text-amber-600",
  },
  {
    label: "Production",
    description: "Continuous monitoring with alerting on metric degradation",
    icon: Globe,
    color: "bg-green-100 border-green-300 text-green-700",
    iconColor: "text-green-600",
  },
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Automate", "LLM-as-Judge", "Monitor"]}
        >
          <ul className="list-none space-y-4 pl-0">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <span className="font-semibold text-foreground">
                Evaluate at every stage of development.
              </span>{" "}
              From local development through PR review to production, run your
              evaluation suite to catch regressions before they reach users.
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
                Use LLM-as-Judge for subjective criteria.
              </span>{" "}
              Human evaluation does not scale. Use a structured rubric and a
              strong judge model to automatically score helpfulness, accuracy,
              and formatting.
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
                Track multiple metrics simultaneously.
              </span>{" "}
              Accuracy alone is not enough. Monitor latency, cost, tool
              correctness, and completion rate to get a complete picture of agent
              health.
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
                Test at every layer of the pyramid.
              </span>{" "}
              Combine fast unit tests for deterministic functions, integration
              tests for tool chains, and slower E2E tests for full workflows.
            </motion.li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          {/* Deployment workflow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            Deployment Workflow
          </motion.p>

          <div className="flex flex-col items-center gap-3 mb-6">
            {WORKFLOW_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.label} className="flex w-full flex-col items-center gap-3">
                  {/* Arrow connector above (except first) */}
                  {index > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{
                        delay: 0.3 + (index - 0.5) * STAGGER_DELAY,
                        duration: 0.3,
                      }}
                      className="flex flex-col items-center origin-top"
                    >
                      <div className="h-4 w-px bg-border" />
                      <div className="h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-border" />
                    </motion.div>
                  )}

                  {/* Stage card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                      ease: "easeOut",
                    }}
                    className={`flex w-full items-center gap-4 rounded-lg border-2 px-5 py-3 ${stage.color}`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${stage.iconColor}`} />
                    <div>
                      <span className="text-sm font-bold">{stage.label}</span>
                      <p className="text-xs opacity-80 mt-0.5">
                        {stage.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Best practices */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4 + WORKFLOW_STAGES.length * STAGGER_DELAY + 0.2,
              duration: 0.3,
            }}
            className="mb-3 text-sm font-medium text-muted-foreground"
          >
            Best Practices
          </motion.p>

          <div className="grid grid-cols-2 gap-3">
            {EVAL_BEST_PRACTICES.map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay:
                    0.6 +
                    WORKFLOW_STAGES.length * STAGGER_DELAY +
                    index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                  ease: "easeOut",
                }}
                className="rounded-lg border bg-card p-4"
              >
                <p className="text-sm font-semibold text-foreground mb-1">
                  {practice.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {practice.description}
                </p>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
