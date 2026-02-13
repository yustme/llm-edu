import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ConfidenceRouter } from "@/components/human-loop/ConfidenceRouter";

export function Step5ConfidenceRouting() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Confidence-Based Routing"
          highlights={[
            "Threshold Tuning",
            "Auto-Execute",
            "Escalation",
          ]}
        >
          <p>
            Instead of applying the same approval process to every action, a
            well-designed agent routes decisions based on its{" "}
            <strong>confidence score</strong>.
          </p>
          <p>Three zones define the routing behavior:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-green-600">Auto-Execute</strong> - High
              confidence actions proceed without human input. The agent is sure
              enough to act alone.
            </li>
            <li>
              <strong className="text-amber-600">Suggest & Wait</strong> -
              Medium confidence actions are proposed to the human for approval.
              The agent has a plan but wants verification.
            </li>
            <li>
              <strong className="text-red-600">Escalate</strong> - Low
              confidence actions are fully deferred to human judgment. The agent
              acknowledges it does not know the right course.
            </li>
          </ul>
          <p>
            Use the <strong>sliders</strong> to adjust the thresholds and
            observe how the same set of actions gets routed differently. In
            production, these thresholds are calibrated using historical data
            and evaluation metrics.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Interactive Confidence Routing
          </p>
          <ConfidenceRouter />
        </InteractiveArea>
      </div>
    </div>
  );
}
