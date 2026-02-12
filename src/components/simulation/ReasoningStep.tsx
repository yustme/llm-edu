import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ReasoningStatus = "pending" | "active" | "done";

interface ReasoningStepProps {
  /** Step number shown in the circle */
  stepNumber: number;
  /** Step title */
  title: string;
  /** Step description or content */
  content: string;
  /** Current status of this step */
  status: ReasoningStatus;
  /** Optional icon to display instead of the step number */
  icon?: ReactNode;
  className?: string;
}

const STATUS_STYLES: Record<
  ReasoningStatus,
  { circle: string; title: string; content: string }
> = {
  pending: {
    circle: "bg-muted text-muted-foreground border-muted",
    title: "text-muted-foreground",
    content: "text-muted-foreground/60",
  },
  active: {
    circle: "bg-primary text-primary-foreground border-primary animate-pulse",
    title: "text-foreground font-semibold",
    content: "text-foreground",
  },
  done: {
    circle: "bg-green-100 text-green-700 border-green-300",
    title: "text-foreground",
    content: "text-muted-foreground",
  },
};

/**
 * Single reasoning loop step with a numbered circle, title,
 * content text, and status-based styling.
 */
export function ReasoningStep({
  stepNumber,
  title,
  content,
  status,
  icon,
  className,
}: ReasoningStepProps) {
  const styles = STATUS_STYLES[status];

  return (
    <div className={cn("flex gap-3", className)}>
      {/* Step circle */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
          styles.circle,
        )}
      >
        {status === "done" ? (
          <Check className="h-4 w-4" />
        ) : icon ? (
          icon
        ) : (
          stepNumber
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 pt-0.5">
        <span className={cn("text-sm transition-colors", styles.title)}>
          {title}
        </span>
        <p className={cn("text-sm leading-relaxed transition-colors", styles.content)}>
          {content}
        </p>
      </div>
    </div>
  );
}
