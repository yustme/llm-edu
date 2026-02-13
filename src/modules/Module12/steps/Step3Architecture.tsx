import { motion } from "framer-motion";
import { Search, AlertTriangle, FileText, Wrench, ArrowDown } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

const ARCH_STAGES = [
  {
    label: "Scan",
    description: "Profile dataset structure, data types, and distributions",
    icon: Search,
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    label: "Detect",
    description: "Identify missing values, duplicates, inconsistencies, and outliers",
    icon: AlertTriangle,
    color: "bg-amber-100 border-amber-300 text-amber-700",
  },
  {
    label: "Report",
    description: "Generate quality scorecard with severity-ranked issue list",
    icon: FileText,
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
  {
    label: "Fix",
    description: "Propose and apply SQL-based remediation with human approval",
    icon: Wrench,
    color: "bg-green-100 border-green-300 text-green-700",
  },
] as const;

export function Step3Architecture() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Quality Agent Architecture"
          highlights={["Scan", "Detect", "Report", "Fix"]}
        >
          <p>
            A data quality agent follows a four-stage pipeline to systematically
            find and fix issues in your dataset.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Scan</strong> - Profile the data to understand structure,
              types, and statistical distributions
            </li>
            <li>
              <strong>Detect</strong> - Apply rules and ML-based checks to
              identify issues across all quality dimensions
            </li>
            <li>
              <strong>Report</strong> - Generate a scored report with issues
              ranked by severity and business impact
            </li>
            <li>
              <strong>Fix</strong> - Propose SQL-based fixes that can be
              reviewed and approved before execution
            </li>
          </ul>
          <p>
            The agent can run on a schedule (daily, hourly) or be triggered
            after new data loads.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Agent Pipeline
          </p>
          <div className="flex flex-col items-center gap-2">
            {ARCH_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={stage.label} className="flex w-full flex-col items-center gap-2">
                  {index > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{
                        delay: 0.2 + (index - 0.5) * STAGGER_DELAY,
                        duration: 0.3,
                      }}
                      className="flex flex-col items-center origin-top"
                    >
                      <ArrowDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className={`flex w-full max-w-md items-center gap-4 rounded-lg border-2 px-5 py-3 ${stage.color}`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{stage.label}</p>
                      <p className="text-xs opacity-80">{stage.description}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
