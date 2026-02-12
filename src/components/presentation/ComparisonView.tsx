import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ComparisonViewProps {
  leftLabel: string;
  rightLabel: string;
  leftContent: ReactNode;
  rightContent: ReactNode;
  className?: string;
}

/**
 * Side-by-side split view with labels at the top of each panel
 * and a vertical divider between them.
 */
export function ComparisonView({
  leftLabel,
  rightLabel,
  leftContent,
  rightContent,
  className,
}: ComparisonViewProps) {
  return (
    <div className={cn("flex gap-0 rounded-xl border bg-card", className)}>
      {/* Left panel */}
      <div className="flex flex-1 flex-col">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {leftLabel}
          </h3>
        </div>
        <div className="flex-1 p-4">{leftContent}</div>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-border" />

      {/* Right panel */}
      <div className="flex flex-1 flex-col">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {rightLabel}
          </h3>
        </div>
        <div className="flex-1 p-4">{rightContent}</div>
      </div>
    </div>
  );
}
