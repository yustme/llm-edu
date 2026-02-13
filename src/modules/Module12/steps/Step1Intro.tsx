import { motion } from "framer-motion";
import { AlertCircle, Copy, Shuffle, TrendingUp } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ISSUE_TYPES } from "../data";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const ICONS: Record<string, React.ElementType> = {
  AlertCircle,
  Copy,
  Shuffle,
  TrendingUp,
};

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Data Quality Matters"
          highlights={["Garbage In", "Garbage Out", "AI Accuracy"]}
        >
          <p>
            <strong>Garbage in, garbage out</strong> - the quality of AI agent
            outputs is fundamentally limited by the quality of the data they
            work with.
          </p>
          <p>
            Poor data quality leads to:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Incorrect analytics</strong> - duplicate records inflate
              revenue, missing values skew averages
            </li>
            <li>
              <strong>Failed agent tasks</strong> - agents produce wrong answers
              when underlying data is inconsistent
            </li>
            <li>
              <strong>Lost trust</strong> - stakeholders lose confidence when
              reports show different numbers each time
            </li>
            <li>
              <strong>Compliance risk</strong> - regulatory reporting requires
              accurate, complete data
            </li>
          </ul>
          <p>
            AI-powered quality agents can <strong>automate</strong> the
            detection and remediation of data quality issues at scale.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Common Data Quality Issues
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ISSUE_TYPES.map((issue, index) => {
              const Icon = ICONS[issue.iconName] ?? AlertCircle;
              return (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`rounded-lg border-2 p-4 ${issue.color}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-bold">{issue.label}</p>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    {issue.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
