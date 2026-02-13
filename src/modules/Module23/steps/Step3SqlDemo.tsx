import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { SQL_SELF_HEALING_STEPS } from "@/data/mock-self-healing";

export function Step3SqlDemo() {
  const { visibleSteps, isPlaying, isComplete, play, pause, reset, nextStep } =
    useSimulation(SQL_SELF_HEALING_STEPS);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="SQL Self-Healing Demo"
          highlights={["Error Detection", "Schema Lookup", "Query Correction"]}
        >
          <p>
            Watch the agent attempt to answer{" "}
            <strong>&ldquo;Show me total revenue by department&rdquo;</strong>
          </p>
          <p>What happens step by step:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Agent generates SQL referencing a <strong>non-existent
              table</strong> (<code>dept_revenue</code>)
            </li>
            <li>
              Database returns an <strong>error</strong> listing available
              tables
            </li>
            <li>
              Agent <strong>analyzes the error</strong> and fetches the real
              schema
            </li>
            <li>
              Agent <strong>generates corrected SQL</strong> with proper JOINs
            </li>
            <li>
              Query executes <strong>successfully</strong> and returns results
            </li>
          </ol>
          <p>
            This is the core self-healing pattern: <strong>fail, learn,
            fix, retry</strong>. The agent never shows the raw error to the
            user - it resolves the problem autonomously.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Agent Simulation
          </p>

          <div className="space-y-3">
            {visibleSteps.map((step, index) => {
              switch (step.type) {
                case "user-input":
                  return (
                    <ChatMessage
                      key={step.id}
                      role="user"
                      content={step.content}
                    />
                  );
                case "llm-thinking":
                  return <ThinkingIndicator key={step.id} isVisible={true} />;
                case "reasoning":
                  return (
                    <ReasoningStep
                      key={step.id}
                      stepNumber={index}
                      title={step.actor}
                      content={step.content}
                      status="done"
                    />
                  );
                case "tool-call":
                  return (
                    <ToolCallCard
                      key={step.id}
                      toolName={step.actor}
                      input={
                        (step.metadata?.input as Record<string, unknown>) ?? {}
                      }
                      output={{}}
                      status="running"
                    />
                  );
                case "tool-result": {
                  const result =
                    (step.metadata?.result as Record<string, unknown>) ?? {};
                  const hasError = "error" in result;
                  return (
                    <ToolCallCard
                      key={step.id}
                      toolName={step.actor}
                      input={{}}
                      output={result}
                      status={hasError ? "error" : "complete"}
                    />
                  );
                }
                case "final-response":
                  return (
                    <ChatMessage
                      key={step.id}
                      role="assistant"
                      content={step.content}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>

          <div className="flex justify-center gap-2 pt-2">
            {!isPlaying && !isComplete && (
              <Button size="sm" onClick={play}>
                {visibleSteps.length === 0 ? "Play" : "Resume"}
              </Button>
            )}
            {isPlaying && (
              <Button size="sm" variant="outline" onClick={pause}>
                Pause
              </Button>
            )}
            {isComplete && (
              <Button size="sm" variant="outline" onClick={reset}>
                Reset
              </Button>
            )}
            {!isPlaying && !isComplete && visibleSteps.length > 0 && (
              <Button size="sm" variant="outline" onClick={nextStep}>
                Next Step
              </Button>
            )}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
