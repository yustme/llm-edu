import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ErrorClassificationGrid } from "@/components/self-healing/ErrorClassificationGrid";
import { ERROR_CLASSIFICATIONS } from "@/data/mock-self-healing";

export function Step4ErrorClassification() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Error Classification"
          highlights={["Recoverable", "Non-Recoverable", "Strategy"]}
        >
          <p>
            Not all errors can be self-healed. A well-designed agent
            <strong> classifies errors</strong> to decide the appropriate
            recovery strategy.
          </p>
          <p>The two main categories:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Self-Healable</strong> - the agent can fix these
              autonomously (schema errors, syntax errors, timeouts, data edge
              cases)
            </li>
            <li>
              <strong>Needs Human</strong> - requires user or admin
              intervention (permission errors, rate limits, infrastructure
              failures)
            </li>
          </ul>
          <p>
            Classification drives the agent&apos;s decision: attempt automatic
            recovery or escalate immediately with a clear explanation.
          </p>
          <p>
            A good self-healing system also <strong>logs every error and
            recovery</strong> attempt for debugging and improvement.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Error Types & Recovery Strategies
          </p>
          <ErrorClassificationGrid errors={ERROR_CLASSIFICATIONS} />
        </InteractiveArea>
      </div>
    </div>
  );
}
