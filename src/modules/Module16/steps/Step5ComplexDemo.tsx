import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { COMPLEX_QUERY_STEPS } from "@/data/mock-text-to-sql";

export function Step5ComplexDemo() {
  const { visibleSteps, isPlaying, isComplete, play, pause, reset, nextStep } =
    useSimulation(COMPLEX_QUERY_STEPS);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Complex Multi-Table Query"
          highlights={["JOIN", "GROUP BY", "Aggregation"]}
        >
          <p>
            This demo shows a more complex question:{" "}
            <strong>&ldquo;What is the revenue by product category?&rdquo;</strong>
          </p>
          <p>
            The agent must reason about which tables to join, how to calculate
            revenue (order_amount minus discount), and how to group results.
          </p>
          <p>Key observations:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Requires <strong>JOIN</strong> between orders and products tables
            </li>
            <li>
              Agent correctly defines revenue as{" "}
              <code>order_amount - discount</code>
            </li>
            <li>
              Filters to <code>status = &apos;completed&apos;</code> only
            </li>
            <li>
              Uses <code>GROUP BY</code> and <code>ORDER BY</code> for the
              breakdown
            </li>
          </ul>
          <p>
            This is where <strong>schema context</strong> is essential - without
            knowing the products table has a category column, the agent cannot
            generate a correct JOIN.
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
                case "tool-result":
                  return (
                    <ToolCallCard
                      key={step.id}
                      toolName="execute_sql"
                      input={{}}
                      output={
                        (step.metadata?.result as Record<string, unknown>) ?? {}
                      }
                      status="complete"
                    />
                  );
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
