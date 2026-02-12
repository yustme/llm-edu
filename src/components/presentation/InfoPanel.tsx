import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  /** Panel heading */
  title: string;
  /** Flexible content - can include paragraphs, lists, etc. */
  children: ReactNode;
  /** Optional key terms to highlight with emphasis styling */
  highlights?: string[];
  className?: string;
}

/**
 * Left-side explanatory panel with a heading, content area,
 * and optional highlight badges for key terms.
 */
export function InfoPanel({
  title,
  children,
  highlights,
  className,
}: InfoPanelProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>

      <div className="text-muted-foreground space-y-3 text-base leading-relaxed">
        {children}
      </div>

      {highlights && highlights.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {highlights.map((term) => (
            <span
              key={term}
              className="bg-primary/10 text-primary rounded-md px-2.5 py-1 text-sm font-medium"
            >
              {term}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
