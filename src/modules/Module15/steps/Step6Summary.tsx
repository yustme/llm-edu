import { motion } from "framer-motion";
import {
  Database,
  Layers,
  Bot,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { KEY_TAKEAWAYS, SEMANTIC_TOOLS } from "../data";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

/** Animated flow diagram: Raw Data -> Semantic Layer -> AI Agent -> Consistent Results */
function FlowDiagram() {
  const steps = [
    {
      icon: Database,
      label: "Raw Data",
      sublabel: "Tables, columns, rows",
      color: "bg-blue-100 border-blue-300 text-blue-700",
      iconColor: "text-blue-600",
    },
    {
      icon: Layers,
      label: "Semantic Layer",
      sublabel: "Metrics, dimensions, filters",
      color: "bg-indigo-100 border-indigo-300 text-indigo-700",
      iconColor: "text-indigo-600",
    },
    {
      icon: Bot,
      label: "AI Agent",
      sublabel: "Queries semantic definitions",
      color: "bg-purple-100 border-purple-300 text-purple-700",
      iconColor: "text-purple-600",
    },
    {
      icon: CheckCircle2,
      label: "Consistent Results",
      sublabel: "Same answer every time",
      color: "bg-green-100 border-green-300 text-green-700",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2 + index * 0.3,
              duration: ANIMATION_DURATION,
            }}
            className={`flex items-center gap-3 rounded-xl border-2 px-6 py-4 ${step.color}`}
          >
            <step.icon className={`h-6 w-6 ${step.iconColor}`} />
            <div>
              <p className="text-sm font-bold">{step.label}</p>
              <p className="text-[10px] opacity-75">{step.sublabel}</p>
            </div>
          </motion.div>

          {/* Arrow between steps */}
          {index < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{
                delay: 0.4 + index * 0.3,
                duration: 0.2,
              }}
              className="flex flex-col items-center py-1 origin-top"
            >
              <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Semantic Layer", "Consistency", "Trust"]}
        >
          <ul className="list-none space-y-4 pl-0">
            {KEY_TAKEAWAYS.map((takeaway, index) => (
              <motion.li
                key={takeaway.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
              >
                <span className="font-semibold text-foreground">
                  {takeaway.title}
                </span>{" "}
                {takeaway.detail}
              </motion.li>
            ))}
          </ul>

          {/* Semantic layer tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-2 space-y-2"
          >
            <p className="text-sm font-semibold text-foreground">
              Example Tools:
            </p>
            <div className="flex flex-wrap gap-2">
              {SEMANTIC_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-md border bg-muted/50 px-2.5 py-1.5"
                  title={tool.description}
                >
                  <span className="text-xs font-medium text-foreground">
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
            Semantic Layer Architecture
          </p>
          <FlowDiagram />
        </InteractiveArea>
      </div>
    </div>
  );
}
