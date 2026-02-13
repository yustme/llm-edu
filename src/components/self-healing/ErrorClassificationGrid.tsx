import { motion } from "framer-motion";
import {
  Database,
  Code,
  ShieldAlert,
  Clock,
  AlertTriangle,
  Ban,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ErrorClassification } from "@/data/mock-self-healing";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

/** Map icon name strings to actual Lucide components */
const ICON_MAP: Record<string, LucideIcon> = {
  Database,
  Code,
  ShieldAlert,
  Clock,
  AlertTriangle,
  Ban,
};

interface ErrorClassificationGridProps {
  errors: ErrorClassification[];
  className?: string;
}

/**
 * Grid of error type cards showing classification, example,
 * recovery strategy, and self-heal capability badge.
 */
export function ErrorClassificationGrid({
  errors,
  className,
}: ErrorClassificationGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {errors.map((error, index) => {
        const Icon = ICON_MAP[error.iconName] ?? AlertTriangle;

        return (
          <motion.div
            key={error.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="flex flex-col gap-3 rounded-lg border bg-card p-4"
          >
            {/* Header: icon + type name */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  error.color,
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {error.type} Error
                </span>
                <span
                  className={cn(
                    "inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium",
                    error.canSelfHeal
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700",
                  )}
                >
                  {error.canSelfHeal ? "Can Self-Heal" : "Needs Human"}
                </span>
              </div>
            </div>

            {/* Example error message */}
            <div className="rounded-md bg-muted px-3 py-2">
              <code className="text-xs font-mono text-muted-foreground leading-relaxed">
                {error.example}
              </code>
            </div>

            {/* Recovery strategy */}
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Recovery: </span>
              {error.recovery}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
