import { useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { usePresentationStore } from "@/stores/presentation.store";
import {
  PREBUILT_QUERIES,
  getAgentSteps,
} from "@/data/mock-llm-responses";
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

  // Check if there's a tool-result after this tool-call with the same tool name
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

export function Step4AgentDemo() {
  const queryIndex = usePresentationStore((s) => s.queryIndex);
  const registerQueries = usePresentationStore((s) => s.registerQueries);
  const setQueryIndex = usePresentationStore((s) => s.setQueryIndex);

  useEffect(() => {
    registerQueries(PREBUILT_QUERIES.length);
    return () => registerQueries(0);
  }, [registerQueries]);

  const selectedQuery = PREBUILT_QUERIES[queryIndex] ?? PREBUILT_QUERIES[0];
  const steps = useMemo(() => getAgentSteps(selectedQuery), [selectedQuery]);

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

  const handleQuerySelect = useCallback(
    (index: number) => {
      setQueryIndex(index);
    },
    [setQueryIndex],
  );

  useEffect(() => {
    reset();
  }, [selectedQuery, reset]);

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
          title="Same Question, Now With an Agent"
          highlights={["Reasoning Loop", "Tool Calls", "Data-Driven"]}
        >
          <p>
            Watch how an agent approaches the same data question. Unlike a plain
            LLM, the agent can reason about the problem, use tools to query the
            database, and provide a comprehensive answer with real data.
          </p>
          <p>The agent follows a reasoning loop:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-medium">Think</span> - Analyze what
              information is needed
            </li>
            <li>
              <span className="font-medium">Act</span> - Execute a tool (e.g.,
              run SQL query)
            </li>
            <li>
              <span className="font-medium">Observe</span> - Examine the result
              and decide next steps
            </li>
          </ol>
          <p>
            This loop repeats until the agent has enough information to provide a
            complete answer.
          </p>

          {/* Query selector */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-foreground">
              Select a query:
            </p>
            <div className="flex flex-col gap-2">
              {PREBUILT_QUERIES.map((query, idx) => (
                <Button
                  key={query}
                  variant={idx === queryIndex ? "default" : "outline"}
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => handleQuerySelect(idx)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
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
                        autoExpand={toolName === "execute_sql"}
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
                  Click "Auto-play" or "Next Step" to start the agent simulation
                </p>
              </div>
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
