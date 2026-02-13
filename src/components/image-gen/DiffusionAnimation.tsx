import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DIFFUSION_STAGES,
  DIFFUSION_COLORS,
  type DiffusionStage,
} from "@/data/mock-image-gen";

const STAGGER_DELAY = 0.3;
const ANIMATION_DURATION = 0.5;
const CELL_SIZE = "size-4";
const GRID_GAP = "gap-0.5";

interface DiffusionGridProps {
  stage: DiffusionStage;
  index: number;
}

function DiffusionGrid({ stage, index }: DiffusionGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * STAGGER_DELAY,
        duration: ANIMATION_DURATION,
      }}
      className="flex flex-col items-center gap-2"
    >
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        Step {stage.stepNumber}
      </p>
      <div className={cn("grid grid-cols-8", GRID_GAP)}>
        {stage.grid.flatMap((row, rowIndex) =>
          row.map((colorIndex, colIndex) => (
            <motion.div
              key={`${stage.id}-${rowIndex}-${colIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay:
                  index * STAGGER_DELAY +
                  0.2 +
                  (rowIndex * 8 + colIndex) * 0.003,
                duration: 0.15,
              }}
              className={cn(
                CELL_SIZE,
                "rounded-[2px]",
                DIFFUSION_COLORS[colorIndex],
              )}
            />
          )),
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-foreground">{stage.label}</p>
        <p className="text-[10px] text-muted-foreground max-w-[120px] leading-tight">
          {stage.description}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Animated visualization of the diffusion denoising process.
 * Shows 6 stages from pure noise to a clear organized pattern,
 * each represented as an 8x8 grid of colored cells.
 */
export function DiffusionAnimation() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-center gap-4 flex-wrap">
        {DIFFUSION_STAGES.map((stage, index) => (
          <DiffusionGrid key={stage.id} stage={stage} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: DIFFUSION_STAGES.length * STAGGER_DELAY + 0.3,
          duration: 0.4,
        }}
        className="flex items-center justify-center gap-2"
      >
        <div className="h-px flex-1 bg-border" />
        <p className="text-xs text-muted-foreground px-3">
          Each step predicts and removes a small amount of noise, guided by the
          text prompt embedding
        </p>
        <div className="h-px flex-1 bg-border" />
      </motion.div>
    </div>
  );
}
