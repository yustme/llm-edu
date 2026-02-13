import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import type { Claim, ClaimStatus } from "@/data/mock-grounding";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

interface HallucinationDetectorProps {
  claims: Claim[];
  className?: string;
}

const STATUS_CONFIG: Record<
  ClaimStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    dotColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeColor: string;
  }
> = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    dotColor: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    badgeColor: "bg-green-100 text-green-700",
  },
  partial: {
    label: "Partially Verified",
    icon: AlertTriangle,
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  hallucinated: {
    label: "Hallucinated",
    icon: XCircle,
    dotColor: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    badgeColor: "bg-red-100 text-red-700",
  },
};

/**
 * Interactive hallucination detection view.
 * Displays claims with colored status indicators and expandable verification details.
 */
export function HallucinationDetector({
  claims,
  className,
}: HallucinationDetectorProps) {
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

  // Fullscreen arrow-key navigation: cycle through claims
  const claimIndex = expandedClaim === null ? -1 : claims.findIndex((c) => c.id === expandedClaim);
  const setClaimByIndex = useCallback(
    (i: number) => setExpandedClaim(claims[i].id),
    [claims],
  );
  useFullscreenStepper(
    claimIndex === -1 ? 0 : claimIndex,
    claims.length,
    setClaimByIndex,
  );

  const verifiedCount = claims.filter((c) => c.status === "verified").length;
  const partialCount = claims.filter((c) => c.status === "partial").length;
  const hallucinatedCount = claims.filter(
    (c) => c.status === "hallucinated",
  ).length;

  function toggleClaim(claimId: string) {
    setExpandedClaim((prev) => (prev === claimId ? null : claimId));
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary statistics */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        className="flex items-center justify-center gap-6 rounded-lg border bg-muted/30 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-foreground">
            {verifiedCount} Verified
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-sm font-medium text-foreground">
            {partialCount} Partial
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-foreground">
            {hallucinatedCount} Hallucinated
          </span>
        </div>
      </motion.div>

      {/* Claims list */}
      <div className="space-y-2">
        {claims.map((claim, index) => {
          const config = STATUS_CONFIG[claim.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedClaim === claim.id;

          return (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
            >
              {/* Claim row */}
              <button
                onClick={() => toggleClaim(claim.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                  isExpanded
                    ? cn(config.bgColor, config.borderColor)
                    : "bg-card hover:bg-muted/50",
                )}
              >
                {/* Status indicator */}
                <div
                  className={cn(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    config.bgColor,
                  )}
                >
                  <StatusIcon className={cn("h-3.5 w-3.5", config.textColor)} />
                </div>

                {/* Claim text */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-foreground">
                    {claim.text}
                  </p>
                </div>

                {/* Status badge and chevron */}
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      config.badgeColor,
                    )}
                  >
                    {config.label}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "mx-2 mt-1 rounded-b-lg border border-t-0 px-4 py-3",
                        config.bgColor,
                        config.borderColor,
                      )}
                    >
                      <p className="text-xs leading-relaxed text-foreground">
                        {claim.explanation}
                      </p>
                      {claim.sourceRef && (
                        <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                          Source: {claim.sourceRef}
                        </p>
                      )}
                      {!claim.sourceRef && (
                        <p className="mt-2 text-[10px] font-medium text-red-600">
                          No source found to support this claim
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
