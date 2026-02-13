import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  GitCompareArrows,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GROUNDING_PIPELINE_STAGES } from "@/data/mock-grounding";

const STAGE_ANIMATION_INTERVAL_MS = 600;
const ANIMATION_DURATION = 0.4;

interface GroundingPipelineProps {
  className?: string;
}

const ICON_MAP: Record<string, typeof MessageSquare> = {
  MessageSquare,
  Search,
  GitCompare: GitCompareArrows,
  FileText,
  ShieldCheck,
};

const STAGE_COLORS = [
  "bg-sky-100 border-sky-300 text-sky-700",
  "bg-blue-100 border-blue-300 text-blue-700",
  "bg-violet-100 border-violet-300 text-violet-700",
  "bg-emerald-100 border-emerald-300 text-emerald-700",
  "bg-green-100 border-green-300 text-green-700",
] as const;

const ACTIVE_RING_COLORS = [
  "ring-sky-400",
  "ring-blue-400",
  "ring-violet-400",
  "ring-emerald-400",
  "ring-green-400",
] as const;

/**
 * Visual pipeline diagram showing the grounding process stages.
 * Stages animate in sequentially, with arrows connecting each stage.
 */
export function GroundingPipeline({ className }: GroundingPipelineProps) {
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    const totalStages = GROUNDING_PIPELINE_STAGES.length;
    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= totalStages - 1) {
          return -1;
        }
        return prev + 1;
      });
    }, STAGE_ANIMATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-center text-sm font-medium text-muted-foreground">
        Grounding Pipeline
      </p>

      {/* Pipeline stages */}
      <div className="flex items-center justify-between gap-2">
        {GROUNDING_PIPELINE_STAGES.map((stage, index) => {
          const StageIcon = ICON_MAP[stage.icon] ?? MessageSquare;
          const isActive = index <= activeStage;
          const isCurrent = index === activeStage;
          const stageColor = STAGE_COLORS[index % STAGE_COLORS.length];
          const ringColor =
            ACTIVE_RING_COLORS[index % ACTIVE_RING_COLORS.length];

          return (
            <div key={stage.id} className="flex items-center gap-2">
              {/* Stage box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  scale: isCurrent ? 1.05 : 1,
                }}
                transition={{ duration: ANIMATION_DURATION }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-3 transition-shadow",
                  stageColor,
                  isCurrent && `ring-2 ${ringColor} shadow-md`,
                )}
                style={{ minWidth: "110px" }}
              >
                <StageIcon className="h-5 w-5" />
                <span className="text-center text-[11px] font-semibold leading-tight">
                  {stage.label}
                </span>
                <span className="text-center text-[9px] leading-tight opacity-75">
                  {stage.description}
                </span>
              </motion.div>

              {/* Arrow between stages */}
              {index < GROUNDING_PIPELINE_STAGES.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: index < activeStage ? 1 : 0.2,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
