import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/hooks/useSimulation";
import { LOCAL_SEARCH_STEPS, GLOBAL_SEARCH_STEPS } from "@/data/mock-graph-rag";
import { SIMULATION } from "@/config/simulation.config";
import type { SimulationStep } from "@/types/agent.types";

const SPEED_MULTIPLIERS = SIMULATION.speedMultipliers;

type SearchMode = "local" | "global";

/** Counter for reasoning step numbers within visible steps */
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

/** Simulation panel for a given set of steps */
function SimulationPanel({ steps }: { steps: SimulationStep[] }) {
  const memoizedSteps = useMemo(() => steps, [steps]);

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
  } = useSimulation(memoizedSteps);

  const showThinking = useMemo(() => {
    if (visibleSteps.length === 0) return false;
    const last = visibleSteps[visibleSteps.length - 1];
    return last.type === "llm-thinking" && !isComplete;
  }, [visibleSteps, isComplete]);

  return (
    <div className="flex h-full flex-col">
      {/* Controls */}
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

      {/* Simulation messages */}
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

              const resultStep = visibleSteps.find(
                (s) =>
                  s.type === "tool-result" &&
                  (s.metadata?.toolName as string) === toolName &&
                  visibleSteps.indexOf(s) > visibleSteps.indexOf(step),
              );
              const output =
                (resultStep?.metadata?.output as Record<string, unknown>) ?? {};

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
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border bg-muted/30 p-3"
                >
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Graph Search Result:
                  </p>
                  <pre className="overflow-auto text-xs leading-relaxed text-foreground">
                    {step.content}
                  </pre>
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

            return null;
          })}
        </AnimatePresence>

        <ThinkingIndicator
          isVisible={showThinking}
          text="Searching knowledge graph..."
        />

        {visibleSteps.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Click "Auto-play" or "Next Step" to start the simulation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const SEARCH_MODES: SearchMode[] = ["local", "global"];

export function Step4QueryDemo() {
  const [searchMode, setSearchMode] = useState<SearchMode>("local");

  const modeIndex = SEARCH_MODES.indexOf(searchMode);
  const setModeByIndex = useCallback(
    (i: number) => setSearchMode(SEARCH_MODES[i]),
    [],
  );
  useFullscreenStepper(modeIndex, SEARCH_MODES.length, setModeByIndex);

  const currentSteps =
    searchMode === "local" ? LOCAL_SEARCH_STEPS : GLOBAL_SEARCH_STEPS;

  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="GraphRAG Query Flow"
          highlights={["Local Search", "Global Search", "Subgraph Retrieval"]}
        >
          <p>
            GraphRAG supports two search strategies, each optimized for
            different types of questions:
          </p>
          <ul className="list-none space-y-3 pl-0">
            <li>
              <span className="font-semibold text-foreground">
                Local Search
              </span>{" "}
              starts from specific entities mentioned in the query, traverses
              their neighborhood in the graph, and retrieves the relevant
              subgraph along with community context. Best for specific,
              entity-focused questions.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Global Search
              </span>{" "}
              retrieves all community summaries and synthesizes a high-level
              answer. Best for broad, thematic questions that span the entire
              knowledge base.
            </li>
          </ul>
          <p>
            Toggle between the two modes and play each simulation to see how
            the query flow differs.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Simulation */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col">
          {/* Mode toggle */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Search mode:
            </span>
            <button
              type="button"
              onClick={() => setSearchMode("local")}
            >
              <Badge
                variant={searchMode === "local" ? "default" : "secondary"}
                className="cursor-pointer"
              >
                Local Search
              </Badge>
            </button>
            <button
              type="button"
              onClick={() => setSearchMode("global")}
            >
              <Badge
                variant={searchMode === "global" ? "default" : "secondary"}
                className="cursor-pointer"
              >
                Global Search
              </Badge>
            </button>
          </div>

          {/* Simulation panel - key forces remount on mode change */}
          <SimulationPanel key={searchMode} steps={currentSteps} />
        </InteractiveArea>
      </div>
    </div>
  );
}
