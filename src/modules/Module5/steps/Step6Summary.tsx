import { motion } from "framer-motion";
import {
  Brain,
  Wrench,
  RefreshCw,
  Database as DatabaseIcon,
  Globe,
  FileText,
  Search,
} from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

/** Static architecture diagram for the summary */
function ArchitectureDiagram() {
  const tools = [
    { icon: DatabaseIcon, label: "SQL Database" },
    { icon: Globe, label: "REST API" },
    { icon: FileText, label: "File System" },
    { icon: Search, label: "Web Search" },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Agent container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-primary">
          AI Agent
        </span>

        {/* LLM core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300"
        >
          <Brain className="h-8 w-8 text-purple-600" />
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-sm font-semibold text-purple-700"
        >
          LLM Core
        </motion.span>

        {/* Reasoning Loop */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: ANIMATION_DURATION }}
          className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 border border-amber-200"
        >
          <RefreshCw className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-700">
            Think &rarr; Act &rarr; Observe &rarr; Repeat
          </span>
        </motion.div>

        {/* Memory */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: ANIMATION_DURATION }}
          className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 border border-green-200"
        >
          <DatabaseIcon className="h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-green-700">
            Conversation History + Context
          </span>
        </motion.div>
      </motion.div>

      {/* Connection line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
        className="h-6 w-px bg-border origin-top"
      />

      {/* Tools row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: ANIMATION_DURATION }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wide text-blue-700">
            Tools
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.1 + index * STAGGER_DELAY,
                duration: 0.3,
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 border border-blue-200"
            >
              <tool.icon className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                {tool.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel title="Key Takeaways" highlights={["Agent", "LLM", "Tools"]}>
          <ul className="list-none space-y-4 pl-0">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <span className="font-semibold text-foreground">
                An AI agent extends LLMs with real-world capabilities.
              </span>{" "}
              By adding tools, a reasoning loop, and memory, agents can access
              databases, call APIs, and perform actions that a plain LLM cannot.
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
                The reasoning loop enables multi-step problem solving.
              </span>{" "}
              Instead of generating a single response, agents think about what
              they need, take actions, observe results, and iterate until the
              task is complete.
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
                Tools give agents real-world capabilities.
              </span>{" "}
              SQL databases, REST APIs, file systems, web search - tools are the
              bridge between the LLM's intelligence and external data and
              systems.
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
                Memory provides continuity and context.
              </span>{" "}
              Agents track conversation history and accumulated context, allowing
              them to make informed decisions across multiple interactions.
            </motion.li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
            Complete Agent Architecture
          </p>
          <ArchitectureDiagram />
        </InteractiveArea>
      </div>
    </div>
  );
}
