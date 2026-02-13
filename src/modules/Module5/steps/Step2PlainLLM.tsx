import { useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { usePresentationStore } from "@/stores/presentation.store";
import {
  PREBUILT_QUERIES,
  getPlainLlmSteps,
} from "@/data/mock-llm-responses";
import { SIMULATION } from "@/config/simulation.config";

const SPEED_MULTIPLIERS = SIMULATION.speedMultipliers;

export function Step2PlainLLM() {
  const queryIndex = usePresentationStore((s) => s.queryIndex);
  const registerQueries = usePresentationStore((s) => s.registerQueries);
  const setQueryIndex = usePresentationStore((s) => s.setQueryIndex);

  useEffect(() => {
    registerQueries(PREBUILT_QUERIES.length);
    return () => registerQueries(0);
  }, [registerQueries]);

  const selectedQuery = PREBUILT_QUERIES[queryIndex] ?? PREBUILT_QUERIES[0];
  const steps = useMemo(() => getPlainLlmSteps(selectedQuery), [selectedQuery]);

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

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Let's Ask the LLM a Data Question"
          highlights={["No Tools", "Training Data Only"]}
        >
          <p>
            Without access to tools or databases, the LLM can only respond based
            on its training data. It has no way to look up your specific company
            data.
          </p>
          <p>
            Select a query below and watch how the LLM handles it. Notice that
            the response is apologetic and unhelpful - the LLM simply cannot
            access external data.
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

          {/* Chat area */}
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

                if (step.type === "llm-thinking") {
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <ThinkingIndicator isVisible={!isComplete} />
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
