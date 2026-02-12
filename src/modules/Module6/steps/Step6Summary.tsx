import { motion } from "framer-motion";
import { FileText, ShieldCheck, AlertTriangle, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { TOOL_USE_BEST_PRACTICES } from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

/** Icons for each best practice card */
const PRACTICE_ICONS: LucideIcon[] = [
  FileText,
  ShieldCheck,
  AlertTriangle,
  Target,
];

/** Color classes for each best practice card */
const PRACTICE_COLORS = [
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-violet-100 text-violet-600 border-violet-200",
  "bg-amber-100 text-amber-600 border-amber-200",
  "bg-green-100 text-green-600 border-green-200",
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Tool Use", "Function Calling", "Agent Design"]}
        >
          <ul className="list-none space-y-4 pl-0">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <span className="font-semibold text-foreground">
                Tool use extends LLM capabilities beyond text.
              </span>{" "}
              By calling external functions, an LLM can perform precise
              calculations, access live data, query databases, and interact with
              any API.
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
                Clear tool definitions lead to reliable tool selection.
              </span>{" "}
              The LLM decides which tool to use based on the definitions it
              receives. Precise descriptions and well-typed schemas minimize
              errors.
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
                Multi-tool chains enable complex workflows.
              </span>{" "}
              Agents can orchestrate multiple tools in sequence, using
              intermediate results to inform subsequent calls and build
              comprehensive answers.
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
                Error handling is essential for robust agents.
              </span>{" "}
              Tools will fail. Agents that handle errors gracefully provide
              better user experiences and avoid propagating incorrect
              information.
            </motion.li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
            Tool Design Best Practices
          </p>
          <div className="grid grid-cols-2 gap-4">
            {TOOL_USE_BEST_PRACTICES.map((practice, index) => {
              const Icon = PRACTICE_ICONS[index];
              const color = PRACTICE_COLORS[index];

              return (
                <motion.div
                  key={practice.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                    ease: "easeOut",
                  }}
                  className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {practice.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {practice.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
