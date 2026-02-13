import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const BEST_PRACTICES = [
  {
    id: "automate-checks",
    label: "Automate quality checks",
    description: "Run quality scans automatically after every data load to catch issues early.",
  },
  {
    id: "score-trends",
    label: "Track quality scores over time",
    description: "Monitor quality trends to detect gradual degradation before it impacts downstream systems.",
  },
  {
    id: "human-in-loop",
    label: "Keep human in the loop for fixes",
    description: "Propose fixes automatically but require human approval before applying changes to production data.",
  },
  {
    id: "document-rules",
    label: "Document quality rules",
    description: "Codify business rules as automated checks so quality definitions are consistent and auditable.",
  },
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Automate", "Monitor", "Human-in-Loop"]}
        >
          <p>
            AI-powered quality agents transform data quality management from a
            manual, reactive process into an <strong>automated, proactive</strong>{" "}
            workflow.
          </p>
          <p>Key principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Measure all five dimensions</strong> - completeness,
              accuracy, consistency, timeliness, uniqueness
            </li>
            <li>
              <strong>Automate detection</strong> but keep humans in the loop
              for remediation decisions
            </li>
            <li>
              <strong>Track trends</strong> to catch gradual quality degradation
            </li>
            <li>
              <strong>Integrate with pipelines</strong> - run quality checks as
              part of your ETL/ELT process
            </li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <ComparisonView
            leftLabel="Manual QA"
            rightLabel="AI Agent QA"
            leftContent={
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Spot checks on sample data only</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Hours of manual SQL writing</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Inconsistent rule application</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Reactive - issues found after damage done</span>
                </div>
              </div>
            }
            rightContent={
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Full dataset scan every time</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Auto-generated fix proposals</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Consistent, codified quality rules</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Proactive - catches issues at load time</span>
                </div>
              </div>
            }
          />

          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Best Practices
            </p>
            <div className="space-y-2">
              {BEST_PRACTICES.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
