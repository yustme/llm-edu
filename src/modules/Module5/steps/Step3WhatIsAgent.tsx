import { motion } from "framer-motion";
import {
  Brain,
  Wrench,
  RefreshCw,
  Database as DatabaseIcon,
} from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { AGENT_COMPONENTS } from "../data";

const LAYER_ANIMATION_DELAY = 0.6;
const LAYER_ANIMATION_DURATION = 0.5;

/** Tool badge component for diagram */
function ToolBadge({
  label,
  delay,
}: {
  label: string;
  delay: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200"
    >
      {label}
    </motion.span>
  );
}

/** Animated agent architecture diagram */
function AgentDiagram() {
  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Center: LLM core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: LAYER_ANIMATION_DURATION, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300 shadow-lg">
          <Brain className="h-10 w-10 text-purple-600" />
        </div>
        <span className="mt-2 text-sm font-semibold text-purple-700">LLM</span>
      </motion.div>

      {/* Layer 1: Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: LAYER_ANIMATION_DELAY,
          duration: LAYER_ANIMATION_DURATION,
        }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">
            + {AGENT_COMPONENTS.tools.title}
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <ToolBadge label="SQL Database" delay={LAYER_ANIMATION_DELAY + 0.2} />
          <ToolBadge label="REST API" delay={LAYER_ANIMATION_DELAY + 0.3} />
          <ToolBadge label="File System" delay={LAYER_ANIMATION_DELAY + 0.4} />
          <ToolBadge label="Web Search" delay={LAYER_ANIMATION_DELAY + 0.5} />
        </div>
      </motion.div>

      {/* Layer 2: Reasoning Loop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: LAYER_ANIMATION_DELAY * 2,
          duration: LAYER_ANIMATION_DURATION,
        }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">
            + {AGENT_COMPONENTS.reasoningLoop.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {["Think", "Act", "Observe"].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: LAYER_ANIMATION_DELAY * 2 + 0.2 + i * 0.15,
                duration: 0.4,
              }}
              className="flex items-center gap-2"
            >
              <span className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200">
                {step}
              </span>
              {i < 2 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: LAYER_ANIMATION_DELAY * 2 + 0.4 + i * 0.15,
                    duration: 0.3,
                  }}
                  className="text-amber-400"
                >
                  &rarr;
                </motion.span>
              )}
            </motion.div>
          ))}
          {/* Loop arrow back */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: LAYER_ANIMATION_DELAY * 2 + 0.8,
              duration: 0.3,
            }}
            className="text-sm text-amber-400"
          >
            &#x21A9;
          </motion.span>
        </div>
      </motion.div>

      {/* Layer 3: Memory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: LAYER_ANIMATION_DELAY * 3,
          duration: LAYER_ANIMATION_DURATION,
        }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <DatabaseIcon className="h-5 w-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            + {AGENT_COMPONENTS.memory.title}
          </span>
        </div>
        <div className="flex gap-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: LAYER_ANIMATION_DELAY * 3 + 0.2,
              duration: 0.4,
            }}
            className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 border border-green-200"
          >
            Conversation History
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: LAYER_ANIMATION_DELAY * 3 + 0.35,
              duration: 0.4,
            }}
            className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 border border-green-200"
          >
            Context Window
          </motion.span>
        </div>
      </motion.div>

      {/* Final label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: LAYER_ANIMATION_DELAY * 4,
          duration: 0.6,
        }}
        className="mt-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-3"
      >
        <span className="text-sm font-bold text-primary">= AI Agent</span>
      </motion.div>
    </div>
  );
}

export function Step3WhatIsAgent() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Agent = LLM + Tools + Reasoning Loop + Memory"
          highlights={["Tools", "Reasoning Loop", "Memory"]}
        >
          <p>
            An AI agent extends the capabilities of an LLM by adding three key
            components that transform it from a text generator into an autonomous
            problem solver.
          </p>
          <ul className="list-none space-y-3 pl-0">
            <li>
              <span className="font-semibold text-blue-700">Tools</span> -{" "}
              {AGENT_COMPONENTS.tools.description}
            </li>
            <li>
              <span className="font-semibold text-amber-700">
                Reasoning Loop
              </span>{" "}
              - {AGENT_COMPONENTS.reasoningLoop.description}
            </li>
            <li>
              <span className="font-semibold text-green-700">Memory</span> -{" "}
              {AGENT_COMPONENTS.memory.description}
            </li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <AgentDiagram />
        </InteractiveArea>
      </div>
    </div>
  );
}
