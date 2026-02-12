import { motion } from "framer-motion";
import { FlaskConical, TestTube, Workflow, BarChart3 } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const ANIMATION_STAGGER = 0.35;
const ANIMATION_DURATION = 0.5;

/** Testing pyramid layers from bottom (widest) to top (narrowest) */
const PYRAMID_LAYERS = [
  {
    label: "Unit Tests",
    count: "~100s",
    icon: TestTube,
    width: "w-full",
    color: "bg-green-100 border-green-300 text-green-700",
    iconColor: "text-green-600",
  },
  {
    label: "Integration Tests",
    count: "~50s",
    icon: Workflow,
    width: "w-4/5",
    color: "bg-blue-100 border-blue-300 text-blue-700",
    iconColor: "text-blue-600",
  },
  {
    label: "E2E Tests",
    count: "~20s",
    icon: FlaskConical,
    width: "w-3/5",
    color: "bg-amber-100 border-amber-300 text-amber-700",
    iconColor: "text-amber-600",
  },
  {
    label: "Monitoring",
    count: "Always On",
    icon: BarChart3,
    width: "w-2/5",
    color: "bg-purple-100 border-purple-300 text-purple-700",
    iconColor: "text-purple-600",
  },
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Evaluate AI Agents?"
          highlights={["Non-Deterministic", "Testing Pyramid", "Systematic"]}
        >
          <p>
            LLMs are <strong>non-deterministic</strong> by nature. The same
            prompt can produce different outputs across runs, making traditional
            software testing insufficient.
          </p>
          <p>
            AI agent evaluation requires a <strong>systematic approach</strong>{" "}
            that covers multiple layers:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-medium">Unit tests</span> - Verify
              individual tool functions and parsers
            </li>
            <li>
              <span className="font-medium">Integration tests</span> - Test
              tool chains and data pipelines
            </li>
            <li>
              <span className="font-medium">End-to-end tests</span> - Validate
              complete agent workflows
            </li>
            <li>
              <span className="font-medium">Monitoring</span> - Track metrics
              in production continuously
            </li>
          </ol>
          <p>
            Without proper evaluation, you cannot measure quality, detect
            regressions, or confidently deploy updates to your agent.
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
            className="mb-8 text-center text-sm font-medium text-muted-foreground"
          >
            AI Agent Testing Pyramid
          </motion.p>

          <div className="flex w-full max-w-md flex-col-reverse items-center gap-3">
            {PYRAMID_LAYERS.map((layer, index) => {
              const Icon = layer.icon;
              /** Bottom layer animates first (index 0 in reversed array is last in PYRAMID_LAYERS) */
              const animDelay = 0.3 + (PYRAMID_LAYERS.length - 1 - index) * ANIMATION_STAGGER;

              return (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, y: 20, scaleX: 0.8 }}
                  animate={{ opacity: 1, y: 0, scaleX: 1 }}
                  transition={{
                    delay: animDelay,
                    duration: ANIMATION_DURATION,
                    ease: "easeOut",
                  }}
                  className={`${layer.width} flex items-center justify-between rounded-lg border-2 px-5 py-3 ${layer.color}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 shrink-0 ${layer.iconColor}`} />
                    <span className="text-sm font-bold">{layer.label}</span>
                  </div>
                  <span className="text-xs font-medium opacity-70">
                    {layer.count}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.3 + PYRAMID_LAYERS.length * ANIMATION_STAGGER + 0.3,
              duration: 0.4,
            }}
            className="mt-8 flex w-full max-w-md items-center justify-between text-xs text-muted-foreground"
          >
            <span>More tests, faster feedback</span>
            <div className="mx-4 h-px flex-1 bg-border" />
            <span>Fewer tests, higher confidence</span>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
