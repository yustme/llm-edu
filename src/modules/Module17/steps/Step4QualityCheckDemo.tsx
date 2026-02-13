import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { DatasetTable } from "@/components/semantic/DatasetTable";
import { Badge } from "@/components/ui/badge";
import { QualityReportCard } from "@/components/quality/QualityReportCard";
import { DIRTY_DATASET, QUALITY_ISSUES, QUALITY_REPORT } from "@/data/mock-data-quality";
import { cn } from "@/lib/utils";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

const SEVERITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

const TYPE_COLORS: Record<string, string> = {
  missing_values: "bg-red-100 text-red-700",
  duplicates: "bg-amber-100 text-amber-700",
  inconsistencies: "bg-blue-100 text-blue-700",
  outliers: "bg-purple-100 text-purple-700",
};

export function Step4QualityCheckDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Quality Check Demo"
          highlights={["Scan", "Detect", "Report"]}
        >
          <p>
            The quality agent scans the TechShop orders dataset and
            identifies issues across all quality dimensions.
          </p>
          <p>
            In this demo, the agent found <strong>6 issues</strong> in a
            10-row dataset, resulting in a quality score of{" "}
            <strong>72/100</strong>.
          </p>
          <p>Issues detected:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Duplicate</strong> - Order O001 appears twice
            </li>
            <li>
              <strong>Missing values</strong> - 2 orders without customer_id
            </li>
            <li>
              <strong>Inconsistencies</strong> - Mixed case in status column
            </li>
            <li>
              <strong>Outlier</strong> - Order amount of 999,999 CZK
            </li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Dataset with Issues
          </p>

          <DatasetTable tables={[DIRTY_DATASET]} />

          <p className="text-center text-sm font-medium text-muted-foreground mt-4">
            Detected Issues
          </p>

          <div className="space-y-2">
            {QUALITY_ISSUES.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="flex items-start gap-3 rounded-lg border bg-card p-3"
              >
                <Badge
                  variant="outline"
                  className={cn("shrink-0 text-xs", TYPE_COLORS[issue.type])}
                >
                  {issue.type.replace("_", " ")}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">{issue.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Row {issue.row} / Column: {issue.column} / Value: {issue.currentValue}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn("shrink-0 text-xs", SEVERITY_COLORS[issue.severity])}
                >
                  {issue.severity}
                </Badge>
              </motion.div>
            ))}
          </div>

          <QualityReportCard
            score={QUALITY_REPORT.score}
            totalRows={QUALITY_REPORT.totalRows}
            issuesFound={QUALITY_REPORT.issuesFound}
            byType={QUALITY_REPORT.byType}
            bySeverity={QUALITY_REPORT.bySeverity}
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
