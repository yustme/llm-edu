import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Button } from "@/components/ui/button";
import { SelfHealingLoopDiagram } from "@/components/self-healing/SelfHealingLoopDiagram";

const ANIMATION_DURATION = 0.4;

/** Delay between automatic step transitions in milliseconds */
const AUTO_STEP_DELAY_MS = 1200;

/** Total number of nodes in the loop */
const TOTAL_NODES = 5;

/** Maximum retry attempts shown in the diagram */
const MAX_ATTEMPTS = 3;

const CYCLE_STAGES = [
  {
    label: "Generate",
    description:
      "The agent generates an action (SQL query, API call, code snippet) based on the user request.",
  },
  {
    label: "Execute",
    description:
      "The generated action is executed against the target system (database, API, runtime).",
  },
  {
    label: "Error?",
    description:
      "The agent checks the result. If an error occurred, it enters the recovery phase instead of returning a failed response.",
  },
  {
    label: "Analyze",
    description:
      "The agent reads the error message, inspects available context (schemas, docs, logs), and identifies the root cause.",
  },
  {
    label: "Fix",
    description:
      "Based on the analysis, the agent generates a corrected action and loops back to Execute for retry.",
  },
] as const;

/**
 * Total stepper positions: undefined (index 0) + nodes 0..TOTAL_NODES-1 (indices 1..TOTAL_NODES)
 */
const STEPPER_POSITIONS = TOTAL_NODES + 1;

export function Step2LoopDiagram() {
  const [activeStep, setActiveStep] = useState<number | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);
  const [attempt, setAttempt] = useState(1);

  const stepperIndex = activeStep === undefined ? 0 : activeStep + 1;
  const setStepperPosition = useCallback(
    (i: number) => setActiveStep(i === 0 ? undefined : i - 1),
    [],
  );
  useFullscreenStepper(stepperIndex, STEPPER_POSITIONS, setStepperPosition);

  const handlePlay = () => {
    setIsAnimating(true);
    setActiveStep(0);
    setAttempt(1);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= TOTAL_NODES) {
        clearInterval(interval);
        setIsAnimating(false);
      } else {
        setActiveStep(step);
      }
    }, AUTO_STEP_DELAY_MS);
  };

  const handleReset = () => {
    setActiveStep(undefined);
    setIsAnimating(false);
    setAttempt(1);
  };

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="The Error-Fix-Retry Loop"
          highlights={["Generate", "Execute", "Analyze", "Fix", "Max Retries"]}
        >
          <p>
            Self-healing follows a <strong>circular loop</strong> with a
            maximum retry count to prevent infinite cycles.
          </p>
          <p>The five stages:</p>
          <ul className="list-disc space-y-1 pl-5">
            {CYCLE_STAGES.map((stage) => (
              <li key={stage.label}>
                <strong>{stage.label}</strong> - {stage.description}
              </li>
            ))}
          </ul>
          <p>
            A <strong>maximum retry count</strong> (typically 2-3 attempts) prevents the
            agent from looping indefinitely. If all retries fail, the agent
            escalates to the user with a clear error explanation.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Self-Healing Cycle
          </p>

          <SelfHealingLoopDiagram
            activeStep={activeStep}
            attempt={attempt}
            maxAttempts={MAX_ATTEMPTS}
          />

          {/* Active step description */}
          {activeStep !== undefined && (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
              className="rounded-lg border bg-muted/50 px-4 py-3 text-center text-sm"
            >
              <span className="font-semibold text-foreground">
                {CYCLE_STAGES[activeStep]?.label}:
              </span>{" "}
              <span className="text-muted-foreground">
                {CYCLE_STAGES[activeStep]?.description}
              </span>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-2 pt-2">
            {!isAnimating && activeStep === undefined && (
              <Button size="sm" onClick={handlePlay}>
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Animate Cycle
              </Button>
            )}
            {(isAnimating || activeStep !== undefined) && (
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
