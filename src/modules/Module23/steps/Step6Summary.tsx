import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const WITHOUT_HEALING = [
  { metric: "Success Rate", value: "~60-70%" },
  { metric: "User Experience", value: "Raw errors shown" },
  { metric: "Maintenance", value: "Manual error handling" },
  { metric: "Autonomy", value: "Fails on first error" },
] as const;

const WITH_HEALING = [
  { metric: "Success Rate", value: "~90-95%" },
  { metric: "User Experience", value: "Transparent recovery" },
  { metric: "Maintenance", value: "Self-documenting logs" },
  { metric: "Autonomy", value: "Recovers automatically" },
] as const;

const DESIGN_CHECKLIST = [
  "Set maximum retry count (2-3 attempts)",
  "Classify errors by recoverability",
  "Provide schema/context awareness for analysis",
  "Implement graceful degradation for unrecoverable errors",
  "Log every error and recovery attempt",
  "Include backoff strategy for repeated failures",
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Retry Limits", "Classification", "Graceful Degradation"]}
        >
          <p>
            Self-healing transforms fragile agents into robust systems that
            handle real-world errors gracefully.
          </p>
          <p>Design principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Always set retry limits</strong> - prevent infinite
              loops with a maximum attempt count
            </li>
            <li>
              <strong>Classify before recovering</strong> - not all errors
              are self-healable; know when to escalate
            </li>
            <li>
              <strong>Use error context</strong> - error messages, schemas,
              and documentation are the agent&apos;s debugging tools
            </li>
            <li>
              <strong>Degrade gracefully</strong> - when recovery fails,
              explain the problem clearly instead of crashing
            </li>
            <li>
              <strong>Log everything</strong> - error and recovery logs
              enable continuous improvement of agent reliability
            </li>
          </ul>
          <p>
            Combined with <strong>Guardrails</strong> (Module 8) and{" "}
            <strong>Evaluation</strong> (Module 9), self-healing creates a
            production-ready agent that users can trust.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <ComparisonView
            leftLabel="Without Self-Healing"
            rightLabel="With Self-Healing"
            leftContent={
              <div className="space-y-2.5 text-sm">
                {WITHOUT_HEALING.map((item, index) => (
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
                {WITH_HEALING.map((item, index) => (
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
              {DESIGN_CHECKLIST.map((item, index) => (
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
