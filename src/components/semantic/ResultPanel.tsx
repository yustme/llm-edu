import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/presentation/CodeBlock";

type ResultStatus = "success" | "warning" | "error";

interface ResultPanelProps {
  /** The result value to display prominently */
  result: string;
  /** Visual status of the result */
  status: ResultStatus;
  /** Label shown above the result (e.g., "Agent Run 1") */
  label: string;
  /** The SQL query that produced this result */
  sqlUsed: string;
  /** Optional explanation of the problem with this result */
  problem?: string;
  className?: string;
}

const STATUS_STYLES: Record<ResultStatus, {
  bg: string;
  border: string;
  text: string;
  iconBg: string;
  Icon: typeof Check;
}> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    iconBg: "bg-green-100",
    Icon: Check,
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    iconBg: "bg-amber-100",
    Icon: AlertTriangle,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    iconBg: "bg-red-100",
    Icon: X,
  },
};

/**
 * Displays a query result with appropriate styling based on status.
 * Shows the SQL used (in a CodeBlock) and the resulting number prominently.
 */
export function ResultPanel({
  result,
  status,
  label,
  sqlUsed,
  problem,
  className,
}: ResultPanelProps) {
  const style = STATUS_STYLES[status];
  const { Icon } = style;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 space-y-3",
        style.bg,
        style.border,
        className,
      )}
    >
      {/* Header with label and icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            style.iconBg,
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", style.text)} />
        </div>
      </div>

      {/* SQL code block */}
      <CodeBlock code={sqlUsed} language="sql" />

      {/* Result number */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Result:</span>
        <span className={cn("text-lg font-bold", style.text)}>{result}</span>
      </div>

      {/* Problem description (if any) */}
      {problem && (
        <p className={cn("text-xs leading-relaxed", style.text)}>
          {problem}
        </p>
      )}
    </div>
  );
}
