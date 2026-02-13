import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { DatasetTable } from "@/components/semantic/DatasetTable";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { DIRTY_DATASET, CLEAN_DATASET } from "@/data/mock-data-quality";
import { FIX_PROPOSALS } from "../data";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step5RemediationDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Remediation Demo"
          highlights={["Propose", "Review", "Apply"]}
        >
          <p>
            The quality agent proposes SQL-based fixes for each detected issue.
            Each fix includes:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Description</strong> of what the fix does
            </li>
            <li>
              <strong>SQL query</strong> to execute the fix
            </li>
            <li>
              <strong>Impact assessment</strong> - what changes in the data
            </li>
          </ul>
          <p>
            Fixes are proposed but <strong>not applied automatically</strong>.
            A human reviews and approves each fix before execution. This
            ensures safety while automating the tedious work of writing
            remediation queries.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <ComparisonView
            leftLabel="Before (Dirty)"
            rightLabel="After (Clean)"
            leftContent={<DatasetTable tables={[DIRTY_DATASET]} />}
            rightContent={<DatasetTable tables={[CLEAN_DATASET]} />}
          />

          <p className="text-center text-sm font-medium text-muted-foreground mt-4">
            Fix Proposals
          </p>

          <div className="space-y-3">
            {FIX_PROPOSALS.map((fix, index) => (
              <motion.div
                key={fix.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="rounded-lg border bg-card p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {fix.issue}
                  </p>
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                    {fix.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{fix.description}</p>
                <CodeBlock code={fix.sql} language="sql" />
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
