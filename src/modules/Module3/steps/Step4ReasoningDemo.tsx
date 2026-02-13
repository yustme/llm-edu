import { useMemo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { SIMULATION } from "@/config/simulation.config";
import {
  REASONING_PROBLEMS,
  getReasoningSimulationSteps,
} from "@/data/mock-reasoning";
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

export function Step4ReasoningDemo() {
  const [selectedProblem, setSelectedProblem] = useState(
    REASONING_PROBLEMS[0].id,
  );

  const steps = useMemo(
    () => getReasoningSimulationSteps(selectedProblem),
    [selectedProblem],
  );

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

  const handleProblemSelect = useCallback(
    (problemId: string) => {
      setSelectedProblem(problemId);
    },
    [],
  );

  // Reset simulation when problem changes
  useEffect(() => {
    reset();
  }, [selectedProblem, reset]);

  /** Check if thinking indicator should be shown */
  const showThinking = useMemo(() => {
    if (visibleSteps.length === 0) return false;
    const last = visibleSteps[visibleSteps.length - 1];
    return last.type === "llm-thinking" && !isComplete;
  }, [visibleSteps, isComplete]);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Reasoning Model in Action"
          highlights={["Thinking Tokens", "Step-by-Step", "Verification"]}
        >
          <p>
            Watch how a reasoning model solves a problem. Unlike a standard LLM
            that outputs the answer directly, a reasoning model produces an
            internal chain of thought -- breaking the problem into steps,
            applying logic, and verifying the result before responding.
          </p>
          <p>
            Each reasoning step represents a sequence of internal "thinking
            tokens" that the model generates before producing its final answer.
            In models like o1 and DeepSeek-R1, these thinking tokens are the
            core mechanism that enables stronger performance on hard problems.
          </p>
          <p>
            Select a problem type below and click "Auto-play" to see the
            reasoning chain unfold step by step.
          </p>

          {/* Problem selector */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-foreground">
              Select a problem:
            </p>
            <div className="flex gap-2">
              {REASONING_PROBLEMS.map((problem) => (
                <Button
                  key={problem.id}
                  variant={
                    problem.id === selectedProblem ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleProblemSelect(problem.id)}
                >
                  {problem.label}
                </Button>
              ))}
            </div>
          </div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area */}
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
                        title={step.actor}
                        content={step.content}
                        status="done"
                      />
                    </motion.div>
                  );
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

                // Skip llm-thinking (handled by ThinkingIndicator)
                if (step.type === "llm-thinking") {
                  return null;
                }

                return null;
              })}
            </AnimatePresence>

            {/* Thinking indicator */}
            <ThinkingIndicator
              isVisible={showThinking}
              text="Model is thinking..."
            />

            {/* Empty state */}
            {visibleSteps.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Click "Auto-play" or "Next Step" to start the reasoning
                  simulation
                </p>
              </div>
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
