import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { WITHOUT_RAG_STEPS } from "@/data/mock-rag";
import { SIMULATION } from "@/config/simulation.config";

const SPEED_MULTIPLIERS = SIMULATION.speedMultipliers;

export function Step3WithoutRAG() {
  const steps = useMemo(() => WITHOUT_RAG_STEPS, []);

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

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="LLM Without External Knowledge"
          highlights={["No Retrieval", "Hallucination Risk", "Training Data Only"]}
        >
          <p>
            When an LLM is asked a domain-specific question without access to
            external knowledge, it can only rely on its training data.
          </p>
          <p>
            In this simulation, we ask about an internal company refund policy.
            The LLM has never seen this document during training, so it either:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Hallucinate</strong> - Fabricates plausible-sounding but
              incorrect details (e.g., guesses a 30-day window when the real
              policy is 60 days)
            </li>
            <li>
              <strong>Hedge</strong> - Gives a vague response and suggests
              checking internal documentation
            </li>
          </ul>
          <p>
            Neither outcome is useful for someone who needs the actual policy
            details right now.
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
