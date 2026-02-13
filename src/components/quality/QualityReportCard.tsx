import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface QualityReportCardProps {
  score: number;
  totalRows: number;
  issuesFound: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  className?: string;
}

const ANIMATION_DURATION = 0.4;

const SEVERITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

const TYPE_LABELS: Record<string, string> = {
  missing_values: "Missing",
  duplicates: "Duplicates",
  inconsistencies: "Inconsistent",
  outliers: "Outliers",
};

function scoreColor(score: number): string {
  if (score > 80) return "text-green-600";
  if (score > 60) return "text-amber-600";
  return "text-red-600";
}

function scoreBgColor(score: number): string {
  if (score > 80) return "bg-green-500";
  if (score > 60) return "bg-amber-500";
  return "bg-red-500";
}

/**
 * Quality report card showing score, breakdowns by type and severity.
 */
export function QualityReportCard({
  score,
  totalRows,
  issuesFound,
  byType,
  bySeverity,
  className,
}: QualityReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION }}
      className={cn("rounded-lg border bg-card p-4 space-y-4", className)}
    >
      {/* Score header */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className={cn("text-3xl font-bold tabular-nums", scoreColor(score))}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
        <div className="flex-1">
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn("h-full rounded-full", scoreBgColor(score))}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{totalRows} rows scanned</span>
            <span>{issuesFound} issues found</span>
          </div>
        </div>
      </div>

      {/* Breakdown sections */}
      <div className="grid grid-cols-2 gap-4">
        {/* By type */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            By Type
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(byType).map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-xs">
                {TYPE_LABELS[type] ?? type}: {count}
              </Badge>
            ))}
          </div>
        </div>

        {/* By severity */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            By Severity
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(bySeverity).map(([severity, count]) => (
              <Badge
                key={severity}
                variant="outline"
                className={cn("text-xs", SEVERITY_COLORS[severity])}
              >
                {severity}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
