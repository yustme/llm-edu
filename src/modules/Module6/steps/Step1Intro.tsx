import { motion } from "framer-motion";
import {
  Calculator,
  Cloud,
  Database,
  FolderOpen,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const ANIMATION_STAGGER = 0.15;
const ANIMATION_DURATION = 0.4;
const COLUMN_DELAY = 0.8;

interface CapabilityItem {
  label: string;
  icon: LucideIcon;
}

const LIMITATIONS: CapabilityItem[] = [
  { label: "Precise Math", icon: Calculator },
  { label: "Real-Time Data", icon: Cloud },
  { label: "Database Queries", icon: Database },
  { label: "File Operations", icon: FolderOpen },
];

const WITH_TOOLS: CapabilityItem[] = [
  { label: "Calculator", icon: Calculator },
  { label: "Weather API", icon: Cloud },
  { label: "SQL Executor", icon: Database },
  { label: "File System", icon: FolderOpen },
];

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why LLMs Need External Tools"
          highlights={["Function Calling", "Tool Use", "Capabilities"]}
        >
          <p>
            Large Language Models are powerful text generators, but they operate
            entirely within the world of tokens. They cannot perform precise
            arithmetic, access live APIs, query databases, or interact with
            external systems on their own.
          </p>
          <p>
            <strong>Tool use</strong> (also called <strong>function calling</strong>)
            bridges this gap. The LLM is given descriptions of available tools
            and can decide when and how to call them, transforming a text-only
            model into a capable agent.
          </p>
          <p>
            Instead of guessing or hallucinating, the LLM delegates tasks to
            specialized tools and incorporates their results into a grounded,
            accurate response.
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
            LLM Capabilities: Without vs With Tools
          </motion.p>

          <div className="flex w-full max-w-xl gap-6">
            {/* Without Tools column */}
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
                className="mb-4 text-center text-sm font-semibold text-red-600"
              >
                LLM Limitations
              </motion.h3>
              <div className="space-y-3">
                {LIMITATIONS.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3 + index * ANIMATION_STAGGER,
                      duration: ANIMATION_DURATION,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium text-red-700">
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* With Tools column */}
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + COLUMN_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="mb-4 text-center text-sm font-semibold text-green-600"
              >
                With Tools
              </motion.h3>
              <div className="space-y-3">
                {WITH_TOOLS.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay:
                        0.3 + COLUMN_DELAY + index * ANIMATION_STAGGER,
                      duration: ANIMATION_DURATION,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
