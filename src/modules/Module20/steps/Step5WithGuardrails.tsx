import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { GUARDED_STEPS } from "@/data/mock-guardrails";
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

export function Step5WithGuardrails() {
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
  } = useSimulation(GUARDED_STEPS);

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
          title="With Guardrails"
          highlights={["Input Validator", "Blocked", "Safe Response"]}
        >
          <p>
            Now the <strong>same prompt injection attack</strong> is sent to an
            agent equipped with guardrails. This time, the input is checked
            before it ever reaches the LLM.
          </p>
          <p>Watch how the guarded agent:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Receives the injected instruction (same as before)
            </li>
            <li>
              Sends the input to the{" "}
              <span className="font-medium">input_validator</span> tool
            </li>
            <li>
              The validator detects the prompt injection pattern
            </li>
            <li>
              Returns a safe, generic refusal instead of leaking data
            </li>
          </ol>
          <p>
            The guardrail catches the attack early, preventing any sensitive
            information from being exposed. The user receives a polite but firm
            refusal.
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
                  const stepNum = getReasoningStepNumber(visibleSteps, step.id);
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
                  const status = getToolCallStatus(step, visibleSteps, isComplete);

                  // Find matching tool result for output
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

                // Skip tool-result rendering (shown inside ToolCallCard)
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
                      className="rounded-lg border-2 border-green-400 bg-green-50 p-3"
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
              text="Agent is thinking..."
            />

            {/* Empty state */}
            {visibleSteps.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Click &quot;Auto-play&quot; or &quot;Next Step&quot; to start
                  the guarded agent simulation
                </p>
              </div>
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
