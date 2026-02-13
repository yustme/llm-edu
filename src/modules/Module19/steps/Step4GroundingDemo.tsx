import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { GROUNDING_PIPELINE_STEPS } from "@/data/mock-grounding";

export function Step4GroundingDemo() {
  const { visibleSteps, isPlaying, isComplete, play, pause, reset, nextStep } =
    useSimulation(GROUNDING_PIPELINE_STEPS);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Interactive Grounding Demo"
          highlights={[
            "Source Retrieval",
            "Cross-Reference",
            "Fact Verification",
          ]}
        >
          <p>
            Watch the full grounding pipeline in action. The agent receives a
            factual question about renewable energy statistics and must produce
            a verifiable, cited answer.
          </p>
          <p>What happens step by step:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              User asks a factual question requiring specific data
            </li>
            <li>
              Agent <strong>analyzes the query</strong> to determine what
              sources are needed
            </li>
            <li>
              Agent <strong>searches the knowledge base</strong> and retrieves
              3 relevant documents
            </li>
            <li>
              Agent <strong>cross-references</strong> the documents to check
              for consistency
            </li>
            <li>
              Agent <strong>verifies each claim</strong> against source material
            </li>
            <li>
              Agent generates the <strong>final response with citations</strong>
            </li>
            <li>
              A <strong>post-generation fact check</strong> validates all
              citations
            </li>
          </ol>
          <p>
            Notice how the agent never makes a claim it cannot trace back to a
            retrieved document. This is the core principle of grounded
            generation.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Grounding Pipeline Simulation
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
                  return (
                    <ToolCallCard
                      key={step.id}
                      toolName={step.actor}
                      input={{}}
                      output={result}
                      status="complete"
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
