import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InteractiveAreaProps {
  children: ReactNode;
  className?: string;
}

/**
 * Right-side visualization container with consistent padding,
 * border, and background styling.
 */
export function InteractiveArea({ children, className }: InteractiveAreaProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
