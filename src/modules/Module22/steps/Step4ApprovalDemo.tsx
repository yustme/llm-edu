import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChatMessage } from "@/components/simulation/ChatMessage";
import { ThinkingIndicator } from "@/components/simulation/ThinkingIndicator";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { ToolCallCard } from "@/components/simulation/ToolCallCard";
import { Button } from "@/components/ui/button";
import { useSimulation } from "@/hooks/useSimulation";
import { APPROVAL_DEMO_STEPS } from "@/data/mock-human-loop";

const APPROVAL_STEP_ID = "hitl-6";
const APPROVAL_RESPONSE_STEP_ID = "hitl-7";

export function Step4ApprovalDemo() {
  const {
    visibleSteps,
    isPlaying,
    isComplete,
    play,
    pause,
    reset,
    nextStep,
  } = useSimulation(APPROVAL_DEMO_STEPS);

  const [approvalState, setApprovalState] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  // Check if we are at the approval step (agent message is visible but user response is not yet)
  const approvalStepVisible = visibleSteps.some(
    (s) => s.id === APPROVAL_STEP_ID,
  );
  const approvalResponseVisible = visibleSteps.some(
    (s) => s.id === APPROVAL_RESPONSE_STEP_ID,
  );
  const showApprovalButtons =
    approvalStepVisible && !approvalResponseVisible && !isPlaying;

  const handleApprove = useCallback(() => {
    setApprovalState("approved");
    // Advance the simulation to the next step (user approval message)
    nextStep();
  }, [nextStep]);

  const handleReject = useCallback(() => {
    setApprovalState("rejected");
  }, []);

  const handleReset = useCallback(() => {
    setApprovalState("pending");
    reset();
  }, [reset]);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Interactive Approval Demo"
          highlights={[
            "Pre-Action Approval",
            "Destructive Operations",
            "Audit Trail",
          ]}
        >
          <p>
            Watch the agent analyze a customer database and propose cleanup
            actions. When it reaches a <strong>destructive operation</strong>{" "}
            (deleting duplicate records), it pauses and requests your approval.
          </p>
          <p>The simulation demonstrates:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Agent <strong>analyzes</strong> the database and finds issues
            </li>
            <li>
              Agent <strong>proposes</strong> actions with confidence scores
            </li>
            <li>
              Agent <strong>pauses</strong> and waits for human approval on
              destructive operations
            </li>
            <li>
              Human <strong>approves or rejects</strong> the proposed actions
            </li>
            <li>
              Agent <strong>executes</strong> only the approved actions and logs
              the decision
            </li>
          </ol>
          <p>
            Use the <strong>Approve</strong> or <strong>Reject</strong> buttons
            when they appear to interact with the simulation.
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
                  return (
                    <ThinkingIndicator key={step.id} isVisible={true} />
                  );
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
                case "agent-message":
                  return (
                    <ChatMessage
                      key={step.id}
                      role="assistant"
                      content={step.content}
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

          {/* Interactive Approve / Reject buttons */}
          <AnimatePresence>
            {showApprovalButtons && approvalState === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-4"
              >
                <p className="text-sm font-medium text-amber-800">
                  The agent is waiting for your approval
                </p>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={handleApprove}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReject}
                    className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rejected state */}
          <AnimatePresence>
            {approvalState === "rejected" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 rounded-lg border-2 border-red-200 bg-red-50 p-4"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-medium text-red-800">
                    Actions rejected by human operator
                  </p>
                </div>
                <p className="text-xs text-red-600">
                  The agent will not proceed with any destructive actions. The
                  rejection has been logged for audit purposes.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simulation controls */}
          <div className="flex justify-center gap-2 pt-2">
            {!isPlaying && !isComplete && approvalState !== "rejected" && !showApprovalButtons && (
              <Button size="sm" onClick={play}>
                {visibleSteps.length === 0 ? "Play" : "Resume"}
              </Button>
            )}
            {isPlaying && (
              <Button size="sm" variant="outline" onClick={pause}>
                Pause
              </Button>
            )}
            {(isComplete || approvalState === "rejected") && (
              <Button size="sm" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
            {!isPlaying &&
              !isComplete &&
              visibleSteps.length > 0 &&
              !showApprovalButtons &&
              approvalState !== "rejected" && (
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
