import { useMemo } from "react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { DatabasePanel } from "@/components/mcp/DatabasePanel";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { DB_QUERY_STEPS, getMCPActorDisplayName } from "@/data/mock-mcp-flows";
import { SIMULATION } from "@/config/simulation.config";

const SPEED_MULTIPLIERS = SIMULATION.speedMultipliers;

export function Step4DBQuery() {
  const steps = useMemo(() => DB_QUERY_STEPS, []);

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
    if (!currentStep)
      return "Click 'Auto-play' or 'Next Step' to start the simulation";

    const actor = getMCPActorDisplayName(currentStep.actor);
    switch (currentStep.type) {
      case "user-input":
        return `User asks: "${currentStep.content}"`;
      case "reasoning":
        return `${actor} is reasoning about the approach...`;
      case "agent-message":
        return `${actor} sends MCP request: ${currentStep.metadata?.method ?? currentStep.content}`;
      case "tool-call":
        return `MCP Server executes SQL on the database...`;
      case "tool-result":
        return `MCP Server returns the query result`;
      case "final-response":
        return `${actor} responds to the user with the answer`;
      default:
        return `${actor}: ${currentStep.type}`;
    }
  }, [currentStep]);

  /** Determine database panel state based on simulation progress */
  const dbState = useMemo(() => {
    if (!currentStep) return { isExecuting: false, showResult: false };

    const stepIndex = visibleSteps.length - 1;
    // Step dbq-4 is the SQL execution (index 3)
    // Step dbq-5 is the result (index 4)
    return {
      isExecuting: stepIndex >= 3,
      showResult: stepIndex >= 4,
    };
  }, [currentStep, visibleSteps]);

  /** Get the latest JSON-RPC message to display */
  const latestJsonMessage = useMemo(() => {
    if (!currentStep) return null;

    if (currentStep.metadata?.toolInput) {
      return currentStep.metadata.toolInput as string;
    }
    if (currentStep.metadata?.toolOutput) {
      return currentStep.metadata.toolOutput as string;
    }
    return null;
  }, [currentStep]);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Database Query via MCP"
          highlights={["Full Flow", "Agent", "MCP Server", "Database"]}
        >
          <p>
            Watch the complete flow of a database query through MCP. The agent
            receives a user question, reasons about how to answer it, calls the
            MCP server's execute_sql tool, and interprets the result.
          </p>

          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>User asks a data question</li>
            <li>Agent reasons about which tool to use</li>
            <li>Agent sends tools/call request via MCP</li>
            <li>MCP Server executes SQL on the database</li>
            <li>MCP Server returns the result via JSON-RPC</li>
            <li>Agent interprets the data</li>
            <li>Agent responds to the user</li>
          </ol>

          {/* Current step info */}
          <div className="mt-3 rounded-lg border bg-muted/50 p-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Step ({visibleSteps.length}/{steps.length})
            </div>
            <p className="mt-1 text-sm text-foreground">{currentDescription}</p>
          </div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col">
          {/* Split view: Database panel on top, JSON messages below */}
          <div className="flex-1 space-y-3">
            {/* Database panel */}
            <DatabasePanel
              isExecuting={dbState.isExecuting}
              showResult={dbState.showResult}
            />

            {/* JSON-RPC message display */}
            {latestJsonMessage && (
              <CodeBlock
                code={latestJsonMessage}
                language="json"
                title="JSON-RPC Message"
                className=""
              />
            )}

            {/* Current step message content */}
            {currentStep && currentStep.content && !latestJsonMessage && (
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {getMCPActorDisplayName(currentStep.actor)}
                </div>
                <p className="mt-1 text-xs text-foreground leading-relaxed">
                  {currentStep.content}
                </p>
              </div>
            )}
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
