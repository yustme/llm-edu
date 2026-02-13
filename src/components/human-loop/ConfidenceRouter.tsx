import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ROUTING_ACTIONS,
  CONFIDENCE_ZONES,
} from "@/data/mock-human-loop";
import type { RoutingAction, ConfidenceZone } from "@/data/mock-human-loop";

const ANIMATION_DURATION = 0.3;

const DEFAULT_HIGH_THRESHOLD = 90;
const DEFAULT_LOW_THRESHOLD = 70;

/**
 * Determines which zone an action belongs to based on its confidence
 * and the current threshold settings.
 */
function getZoneForAction(
  action: RoutingAction,
  highThreshold: number,
  lowThreshold: number,
): ConfidenceZone["id"] {
  const confidencePercent = action.confidence * 100;
  if (confidencePercent >= highThreshold) return "auto";
  if (confidencePercent >= lowThreshold) return "suggest";
  return "escalate";
}

/**
 * Interactive confidence-based routing visualization.
 * Two sliders control the high and low thresholds.
 * Actions are sorted into zones based on their confidence scores.
 */
export function ConfidenceRouter() {
  const [highThreshold, setHighThreshold] = useState(DEFAULT_HIGH_THRESHOLD);
  const [lowThreshold, setLowThreshold] = useState(DEFAULT_LOW_THRESHOLD);

  // Ensure high threshold is always above low threshold
  function handleHighChange(value: number) {
    setHighThreshold(Math.max(value, lowThreshold + 1));
  }

  function handleLowChange(value: number) {
    setLowThreshold(Math.min(value, highThreshold - 1));
  }

  // Group actions into zones
  const grouped: Record<ConfidenceZone["id"], RoutingAction[]> = {
    auto: [],
    suggest: [],
    escalate: [],
  };

  for (const action of ROUTING_ACTIONS) {
    const zone = getZoneForAction(action, highThreshold, lowThreshold);
    grouped[zone].push(action);
  }

  return (
    <div className="space-y-6">
      {/* Threshold sliders */}
      <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">
              Auto-Execute Threshold
            </label>
            <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-mono font-semibold text-green-700">
              {highThreshold}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={99}
            value={highThreshold}
            onChange={(e) => handleHighChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-green-600"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">
              Escalation Threshold
            </label>
            <span className="rounded bg-red-100 px-2 py-0.5 text-sm font-mono font-semibold text-red-700">
              {lowThreshold}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            value={lowThreshold}
            onChange={(e) => handleLowChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-red-600"
          />
        </div>

        {/* Zone bar visualization */}
        <div className="flex h-6 w-full overflow-hidden rounded-full border">
          <div
            className="flex items-center justify-center bg-red-100 text-[10px] font-medium text-red-700 transition-all duration-300"
            style={{ width: `${lowThreshold}%` }}
          >
            Escalate
          </div>
          <div
            className="flex items-center justify-center bg-amber-100 text-[10px] font-medium text-amber-700 transition-all duration-300"
            style={{ width: `${highThreshold - lowThreshold}%` }}
          >
            Suggest
          </div>
          <div
            className="flex items-center justify-center bg-green-100 text-[10px] font-medium text-green-700 transition-all duration-300"
            style={{ width: `${100 - highThreshold}%` }}
          >
            Auto
          </div>
        </div>
      </div>

      {/* Action zones */}
      <div className="grid grid-cols-3 gap-3">
        {CONFIDENCE_ZONES.map((zone) => (
          <div
            key={zone.id}
            className={cn(
              "rounded-lg border p-3",
              zone.bgColor,
              zone.borderColor,
            )}
          >
            <h4 className={cn("mb-1 text-sm font-semibold", zone.color)}>
              {zone.label}
            </h4>
            <p className="mb-3 text-[10px] text-muted-foreground">
              {zone.description}
            </p>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {grouped[zone.id].map((action) => (
                  <motion.div
                    key={action.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: ANIMATION_DURATION }}
                    className="rounded-md border bg-white/80 px-3 py-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        {action.label}
                      </span>
                      <span
                        className={cn(
                          "ml-2 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold",
                          zone.id === "auto"
                            ? "bg-green-100 text-green-700"
                            : zone.id === "suggest"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700",
                        )}
                      >
                        {Math.round(action.confidence * 100)}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {action.description}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {grouped[zone.id].length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground italic">
                  No actions in this zone
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
