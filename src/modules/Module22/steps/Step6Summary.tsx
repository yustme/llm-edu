import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import {
  WITHOUT_HITL,
  WITH_HITL,
  DESIGN_CHECKLIST_HITL,
} from "@/data/mock-human-loop";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={[
            "Approval Gates",
            "Confidence Routing",
            "Feedback Loops",
          ]}
        >
          <p>
            Human-in-the-loop is not about limiting AI -- it is about building{" "}
            <strong>trust</strong> and <strong>accountability</strong> into
            agentic systems.
          </p>
          <p>Design principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Match oversight to risk</strong> - use pre-action approval
              for high-stakes, irreversible operations; post-action review for
              routine tasks
            </li>
            <li>
              <strong>Calibrate confidence thresholds</strong> - use real-world
              data to set auto-execute, suggest, and escalate boundaries
            </li>
            <li>
              <strong>Close the feedback loop</strong> - every human decision
              (approve, reject, correct) is a training signal for improvement
            </li>
            <li>
              <strong>Log everything</strong> - approval decisions, confidence
              scores, and outcomes create an audit trail and training data
            </li>
            <li>
              <strong>Handle unavailability</strong> - design timeouts and
              fallbacks for when human reviewers are not available
            </li>
          </ul>
          <p>
            Combined with <strong>Guardrails</strong> (Module 8) and{" "}
            <strong>Evaluation</strong> (Module 9), HITL creates a
            production-ready agent that users and regulators can trust.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <ComparisonView
            leftLabel="Without HITL"
            rightLabel="With HITL"
            leftContent={
              <div className="space-y-2.5 text-sm">
                {WITHOUT_HITL.map((item, index) => (
                  <motion.div
                    key={item.metric}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span>
                      <strong>{item.metric}:</strong> {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            }
            rightContent={
              <div className="space-y-2.5 text-sm">
                {WITH_HITL.map((item, index) => (
                  <motion.div
                    key={item.metric}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>
                      <strong>{item.metric}:</strong> {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            }
          />

          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Design Checklist
            </p>
            <div className="space-y-2">
              {DESIGN_CHECKLIST_HITL.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
