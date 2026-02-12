import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MetricData } from "@/data/mock-evaluation";

const ANIMATION_DURATION_MS = 1200;
const ANIMATION_FRAME_INTERVAL_MS = 16;

const STATUS_COLORS: Record<MetricData["status"], { bar: string; text: string; bg: string }> = {
  good: { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
  warning: { bar: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" },
  bad: { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
};

interface MetricCardProps {
  metric: MetricData;
  delay?: number;
  className?: string;
}

/**
 * Displays a single metric with an animated counter value and
 * a progress bar showing progress toward the target threshold.
 */
export function MetricCard({ metric, delay = 0, className }: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const colors = STATUS_COLORS[metric.status];

  /** Percentage of target achieved (capped at 100% for bar width) */
  const progressPercent = Math.min((metric.value / metric.target) * 100, 120);
  const barWidth = Math.min(progressPercent, 100);

  useEffect(() => {
    let frame: ReturnType<typeof setTimeout>;
    const start = performance.now();
    const delayMs = delay * 1000;

    function tick() {
      const elapsed = performance.now() - start - delayMs;
      if (elapsed < 0) {
        frame = setTimeout(tick, ANIMATION_FRAME_INTERVAL_MS);
        return;
      }
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      /** Ease-out cubic for smooth deceleration */
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Number((metric.value * eased).toFixed(2)));
      if (progress < 1) {
        frame = setTimeout(tick, ANIMATION_FRAME_INTERVAL_MS);
      }
    }

    frame = setTimeout(tick, ANIMATION_FRAME_INTERVAL_MS);
    return () => clearTimeout(frame);
  }, [metric.value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-lg border p-4",
        colors.bg,
        className,
      )}
    >
      <p className="text-xs font-medium text-muted-foreground mb-1">
        {metric.name}
      </p>

      {/* Animated value */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className={cn("text-2xl font-bold tabular-nums", colors.text)}>
          {metric.unit === "$" ? `$${animatedValue.toFixed(2)}` : animatedValue.toFixed(metric.value % 1 === 0 ? 0 : 1)}
        </span>
        {metric.unit !== "$" && (
          <span className="text-sm text-muted-foreground">{metric.unit}</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors.bar)}
        />
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Target: {metric.unit === "$" ? `$${metric.target.toFixed(2)}` : `${metric.target}${metric.unit}`}
      </p>
    </motion.div>
  );
}
