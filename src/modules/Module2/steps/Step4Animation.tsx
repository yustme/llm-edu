import { useMemo } from "react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { AgentWorkflow } from "@/components/agents/AgentWorkflow";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { MULTI_AGENT_STEPS, getActorDisplayName } from "@/data/mock-multi-agent";
import { SIMULATION } from "@/config/simulation.config";

const SPEED_MULTIPLIERS = SIMULATION.speedMultipliers;

export function Step4Animation() {
  const steps = useMemo(() => MULTI_AGENT_STEPS, []);

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
    currentStep,
  } = useSimulation(steps);

  /** Current step description */
  const currentDescription = useMemo(() => {
    if (!currentStep) return "Click 'Auto-play' or 'Next Step' to start the simulation";

    const actor = getActorDisplayName(currentStep.actor);
    switch (currentStep.type) {
      case "user-input":
        return `User sends the request: "${currentStep.content.slice(0, 50)}..."`;
      case "reasoning":
        return `${actor} is thinking...`;
      case "agent-message":
        return `${actor} sends a message`;
      case "tool-call":
        return `${actor} calls tool: ${(currentStep.metadata?.toolName as string) ?? currentStep.content}`;
      case "tool-result":
        return `Tool returns result to ${actor}`;
      case "final-response":
        return `${actor} delivers the final report`;
      default:
        return `${actor}: ${currentStep.type}`;
    }
  }, [currentStep]);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Watch Agents Collaborate"
          highlights={["Step-by-Step", "Real-Time", "Visualization"]}
        >
          <p>
            Watch the agents solve the task step by step. As each step plays,
            the active agent's node lights up and messages appear on the
            communication edges.
          </p>
          <p>
            Use the controls below the diagram to play through the simulation
            automatically or step through manually.
          </p>

          {/* Current step info */}
          <div className="mt-4 rounded-lg border bg-muted/50 p-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Step ({visibleSteps.length}/{steps.length})
            </div>
            <p className="mt-1 text-sm text-foreground">{currentDescription}</p>
          </div>

          {/* Message content preview */}
          {currentStep && currentStep.content && (
            <div className="mt-2 rounded-lg border bg-card p-3">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Message Content
              </div>
              <p className="mt-1 max-h-32 overflow-auto text-xs text-muted-foreground leading-relaxed">
                {currentStep.content}
              </p>
            </div>
          )}
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col">
          {/* React Flow diagram */}
          <div className="h-[340px] flex-1">
            <AgentWorkflow
              messages={steps}
              activeMessageIndex={
                visibleSteps.length > 0 ? visibleSteps.length - 1 : -1
              }
              className="h-full w-full"
            />
          </div>

          {/* Simulation controls */}
          <div className="mt-3 flex items-center gap-2 border-t pt-3">
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
        </InteractiveArea>
      </div>
    </div>
  );
}
