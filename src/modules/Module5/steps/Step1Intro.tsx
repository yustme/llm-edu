import { motion } from "framer-motion";
import { User, Brain, MessageSquare, ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const ANIMATION_DELAY_BASE = 0.3;
const ANIMATION_DELAY_STEP = 0.5;
const ANIMATION_DURATION = 0.5;

/** Animated diagram showing User -> LLM -> Text Response flow */
function LlmFlowDiagram() {
  const nodes = [
    {
      icon: User,
      label: "User",
      color: "bg-blue-100 text-blue-600 border-blue-200",
    },
    {
      icon: Brain,
      label: "LLM",
      color: "bg-purple-100 text-purple-600 border-purple-200",
    },
    {
      icon: MessageSquare,
      label: "Text Response",
      color: "bg-gray-100 text-gray-600 border-gray-200",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 py-12">
      {nodes.map((node, index) => (
        <div key={node.label} className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: ANIMATION_DELAY_BASE + index * ANIMATION_DELAY_STEP * 2,
              duration: ANIMATION_DURATION,
              ease: "easeOut",
            }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${node.color}`}
            >
              <node.icon className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {node.label}
            </span>
          </motion.div>

          {/* Arrow between nodes */}
          {index < nodes.length - 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay:
                  ANIMATION_DELAY_BASE +
                  index * ANIMATION_DELAY_STEP * 2 +
                  ANIMATION_DELAY_STEP,
                duration: ANIMATION_DURATION,
              }}
            >
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="LLMs Are Powerful, But Limited"
          highlights={["Training Data", "Text Generation", "No External Access"]}
        >
          <p>
            Large Language Models (LLMs) are trained on massive amounts of text
            data. They can generate remarkably human-like responses, translate
            languages, write code, and reason about complex topics.
          </p>
          <p>
            However, LLMs have a fundamental limitation: they can only work with
            their training data and the text in the current conversation. They
            cannot:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Access external databases or APIs</li>
            <li>Run code or execute SQL queries</li>
            <li>Retrieve real-time information</li>
            <li>Take actions in the real world</li>
          </ul>
          <p>
            When you ask an LLM a question about your specific data, it can only
            give you a generic or apologetic response.
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
            How a plain LLM works:
          </motion.p>
          <LlmFlowDiagram />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 0.6 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            The LLM receives text input and produces text output.
            <br />
            No access to external data or tools.
          </motion.p>
        </InteractiveArea>
      </div>
    </div>
  );
}
