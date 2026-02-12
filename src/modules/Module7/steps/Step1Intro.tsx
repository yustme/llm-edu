import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const ANIMATION_STAGGER = 0.3;
const ANIMATION_DURATION = 0.5;

/** Complexity pyramid levels, from bottom (simplest) to top (most complex) */
const PYRAMID_LEVELS = [
  {
    label: "Orchestrated Agent Network",
    description: "Multiple agents coordinated by orchestration patterns",
    color: "bg-purple-100 border-purple-300 text-purple-700",
    width: "w-full",
  },
  {
    label: "Multi-Agent Pipeline",
    description: "Several agents working together on sub-tasks",
    color: "bg-blue-100 border-blue-300 text-blue-700",
    width: "w-5/6",
  },
  {
    label: "Single Agent with Tools",
    description: "One agent using function calling to interact with external tools",
    color: "bg-amber-100 border-amber-300 text-amber-700",
    width: "w-4/6",
  },
  {
    label: "Single LLM Call",
    description: "Direct prompt-in, text-out with no tools or memory",
    color: "bg-green-100 border-green-300 text-green-700",
    width: "w-3/6",
  },
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Orchestration Matters"
          highlights={["Orchestration", "Multi-Agent", "Patterns"]}
        >
          <p>
            A single LLM call can answer simple questions, but complex
            real-world tasks often require <strong>multiple agents</strong> with
            different specialties working together.
          </p>
          <p>
            <strong>Orchestration</strong> is the art of coordinating these
            agents: deciding who does what, in which order, and how their
            outputs combine into a final result.
          </p>
          <p>
            Different tasks call for different orchestration patterns. A data
            pipeline benefits from sequential processing, while a research task
            benefits from parallel execution. Choosing the right pattern is key
            to building effective agentic systems.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6 text-center text-sm font-medium text-muted-foreground"
          >
            Complexity Pyramid: From Simple to Orchestrated
          </motion.p>

          <div className="flex w-full max-w-lg flex-col items-center gap-3">
            {/* Render pyramid top-to-bottom (most complex at top visually, simplest at bottom) */}
            {[...PYRAMID_LEVELS].reverse().map((level, visualIndex) => {
              /* Animation order: bottom appears first (index 0 = simplest) */
              const animIndex = PYRAMID_LEVELS.length - 1 - visualIndex;

              return (
                <motion.div
                  key={level.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + animIndex * ANIMATION_STAGGER,
                    duration: ANIMATION_DURATION,
                    ease: "easeOut",
                  }}
                  className={`${level.width} mx-auto`}
                >
                  <div
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 px-4 py-3 text-center ${level.color}`}
                  >
                    <span className="text-sm font-bold">{level.label}</span>
                    <span className="text-xs opacity-80">
                      {level.description}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Axis labels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.3 + PYRAMID_LEVELS.length * ANIMATION_STAGGER + 0.2,
                duration: 0.4,
              }}
              className="mt-4 flex w-full items-center justify-between text-xs text-muted-foreground"
            >
              <span>Simple</span>
              <div className="mx-4 h-px flex-1 bg-border" />
              <span>Complex</span>
            </motion.div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
