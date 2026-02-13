import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AUTONOMY_LEVELS } from "@/data/mock-human-loop";
import type { AutonomyLevel } from "@/data/mock-human-loop";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const RISK_BADGE_STYLES: Record<AutonomyLevel["riskLevel"], string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

/**
 * Horizontal spectrum visualization showing autonomy levels
 * from fully manual (safe) to fully autonomous (risky).
 * Each level is rendered as an animated card along a gradient bar.
 */
export function AutonomySpectrum() {
  return (
    <div className="space-y-6">
      {/* Gradient bar */}
      <div className="relative">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {AUTONOMY_LEVELS.map((level, index) => (
            <motion.div
              key={level.id}
              className={cn("flex-1", level.color)}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: index * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
              style={{ transformOrigin: "left" }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between px-1">
          <span className="text-xs text-green-600 font-medium">Safe</span>
          <span className="text-xs text-red-600 font-medium">Risky</span>
        </div>
      </div>

      {/* Level cards */}
      <div className="grid grid-cols-5 gap-3">
        {AUTONOMY_LEVELS.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="flex flex-col gap-2 rounded-lg border bg-card p-3"
          >
            <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full", level.color)} />
              <span className="text-xs font-semibold leading-tight">
                {level.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {level.description}
            </p>
            <div className="mt-auto">
              <span
                className={cn(
                  "inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase",
                  RISK_BADGE_STYLES[level.riskLevel],
                )}
              >
                {level.riskLevel} risk
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
