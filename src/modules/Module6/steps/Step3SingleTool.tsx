import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { SINGLE_TOOL_STEPS } from "@/data/mock-tool-use";
import { SIMULATION } from "@/config/simulation.config";
import type { SimulationStep } from "@/types/agent.types";

const SPEED_MULTIPLIERS = SIMULATION.speedMultipliers;

/** Counter to track reasoning step numbers within the visible steps */
function getReasoningStepNumber(
  visibleSteps: SimulationStep[],
  currentStepId: string,
): number {
  let count = 0;
  for (const step of visibleSteps) {
    if (step.type === "reasoning") count++;
    if (step.id === currentStepId) break;
  }
  return count;
}

/** Determine tool call status based on whether its result is visible */
function getToolCallStatus(
  step: SimulationStep,
  visibleSteps: SimulationStep[],
  isSimComplete: boolean,
): "pending" | "running" | "complete" | "error" {
  const toolName = (step.metadata?.toolName as string) ?? "";
  const stepIndex = visibleSteps.findIndex((s) => s.id === step.id);

  const hasResult = visibleSteps.some(
    (s, i) =>
      i > stepIndex &&
      s.type === "tool-result" &&
      (s.metadata?.toolName as string) === toolName,
  );

  if (hasResult) return "complete";
  if (isSimComplete) return "complete";
  return "running";
}

export function Step3SingleTool() {
  const steps = useMemo(() => SINGLE_TOOL_STEPS, []);

  const {
    play,
    pause,
    reset,
    nextStep,
    visibleSteps,
    isPlaying,
    isComplete,
    speed,
    setSpeed,
  } = useSimulation(steps);

  /** Check if thinking indicator should be shown */
  const showThinking = useMemo(() => {
    if (visibleSteps.length === 0) return false;
    const last = visibleSteps[visibleSteps.length - 1];
    return last.type === "llm-thinking" && !isComplete;
  }, [visibleSteps, isComplete]);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Single Tool Call"
          highlights={["Reasoning", "Tool Call", "Result"]}
        >
          <p>
            When a user asks a question that requires external capabilities, the
            LLM follows a structured flow:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>The user asks a question</li>
            <li>The LLM reasons about which tool to use</li>
            <li>The LLM generates a structured tool call</li>
            <li>The tool executes and returns a result</li>
            <li>The LLM formats the result into a natural response</li>
          </ol>
          <p>
            In this example, the LLM recognizes it needs a calculator for
            precise arithmetic and delegates the computation instead of guessing.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col">
          {/* Simulation controls */}
          <div className="mb-4 flex items-center gap-2 border-b pb-3">
            <Button
              size="sm"
              variant="outline"
              onClick={isPlaying ? pause : play}
              disabled={isComplete}
            >
              {isPlaying ? "Pause" : "Auto-play"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={nextStep}
              disabled={isPlaying || isComplete}
            >
              Next Step
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              Reset
            </Button>

            {/* Speed controls */}
            <div className="ml-auto flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Speed:</span>
              {SPEED_MULTIPLIERS.map((mult) => (
                <Button
                  key={mult}
                  size="sm"
                  variant={speed === mult ? "default" : "ghost"}
                  className="h-7 px-2 text-xs"
                  onClick={() => setSpeed(mult)}
                >
                  {mult}x
                </Button>
              ))}
            </div>
          </div>

          {/* Simulation area */}
          <div className="flex-1 space-y-4 overflow-auto">
            <AnimatePresence mode="popLayout">
              {visibleSteps.map((step) => {
                if (step.type === "user-input") {
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChatMessage role="user" content={step.content} />
                    </motion.div>
                  );
                }

                if (step.type === "reasoning") {
                  const stepNum = getReasoningStepNumber(
                    visibleSteps,
                    step.id,
                  );
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ReasoningStep
                        stepNumber={stepNum}
                        title="Reasoning"
                        content={step.content}
                        status="done"
                      />
                    </motion.div>
                  );
                }

                if (step.type === "tool-call") {
                  const toolName =
                    (step.metadata?.toolName as string) ?? step.content;
                  const input =
                    (step.metadata?.input as Record<string, unknown>) ?? {};
                  const status = getToolCallStatus(
                    step,
                    visibleSteps,
                    isComplete,
                  );

                  const resultStep = visibleSteps.find(
                    (s) =>
                      s.type === "tool-result" &&
                      (s.metadata?.toolName as string) === toolName &&
                      visibleSteps.indexOf(s) > visibleSteps.indexOf(step),
                  );
                  const output =
                    (resultStep?.metadata?.output as Record<string, unknown>) ??
                    {};

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ToolCallCard
                        toolName={toolName}
                        input={input}
                        output={output}
                        status={status}
                      />
                    </motion.div>
                  );
                }

                if (step.type === "tool-result") {
                  return null;
                }

                if (step.type === "final-response") {
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChatMessage
                        role="assistant"
                        content={step.content}
                        isTyping
                      />
                    </motion.div>
                  );
                }

                return null;
              })}
            </AnimatePresence>

            {/* Thinking indicator */}
            <ThinkingIndicator
              isVisible={showThinking}
              text="Processing..."
            />

            {/* Empty state */}
            {visibleSteps.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Click "Auto-play" or "Next Step" to start the simulation
                </p>
              </div>
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
