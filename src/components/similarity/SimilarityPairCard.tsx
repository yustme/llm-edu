import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Thresholds for color-coding similarity scores */
const HIGH_SIMILARITY_THRESHOLD = 0.5;
const LOW_SIMILARITY_THRESHOLD = 0;

/** Colors for different similarity ranges */
const COLORS = {
  high: { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
  medium: { bar: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" },
  low: { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
} as const;

interface SimilarityPairCardProps {
  wordA: string;
  wordB: string;
  /** Cosine similarity in the range [-1, 1] */
  similarity: number;
  /** Animation delay in seconds */
  delay?: number;
  className?: string;
}

/** Returns the color scheme based on the similarity value */
function getColorScheme(similarity: number) {
  if (similarity >= HIGH_SIMILARITY_THRESHOLD) return COLORS.high;
  if (similarity >= LOW_SIMILARITY_THRESHOLD) return COLORS.medium;
  return COLORS.low;
}

/**
 * Displays a word pair with a colored similarity bar between them.
 * Green for high similarity, yellow for medium, red for low/negative.
 */
export function SimilarityPairCard({
  wordA,
  wordB,
  similarity,
  delay = 0,
  className,
}: SimilarityPairCardProps) {
  const colors = getColorScheme(similarity);
  /** Normalize similarity from [-1, 1] to [0, 100] for bar width */
  const barPercent = Math.max(0, ((similarity + 1) / 2) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        colors.bg,
        className,
      )}
    >
      <span className="w-24 text-right text-sm font-semibold text-foreground truncate">
        {wordA}
      </span>

      <div className="flex-1">
        <div className="h-2.5 w-full rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${barPercent}%` }}
            transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
            className={cn("h-full rounded-full", colors.bar)}
          />
        </div>
      </div>

      <span className="w-24 text-sm font-semibold text-foreground truncate">
        {wordB}
      </span>

      <span
        className={cn(
          "w-14 text-right text-xs font-mono font-bold",
          colors.text,
        )}
      >
        {similarity.toFixed(2)}
      </span>
    </motion.div>
  );
}
