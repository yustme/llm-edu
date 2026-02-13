import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ColumnMapping } from "@/data/mock-etl";

interface SchemaMappingProps {
  sourceColumns: string[];
  targetColumns: string[];
  mappings: ColumnMapping[];
  className?: string;
}

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

function confidenceColor(confidence: number): string {
  if (confidence > 0.9) return "text-green-500 stroke-green-500";
  if (confidence > 0.7) return "text-amber-500 stroke-amber-500";
  return "text-red-500 stroke-red-500";
}

function confidenceBg(confidence: number): string {
  if (confidence > 0.9) return "bg-green-100 border-green-300 text-green-700";
  if (confidence > 0.7) return "bg-amber-100 border-amber-300 text-amber-700";
  return "bg-red-100 border-red-300 text-red-700";
}

const ROW_HEIGHT = 36;
const ROW_GAP = 4;

/**
 * Visual column mapping between source and target schemas.
 * Shows connecting lines colored by confidence score.
 */
export function SchemaMapping({
  sourceColumns,
  targetColumns,
  mappings,
  className,
}: SchemaMappingProps) {
  const maxRows = Math.max(sourceColumns.length, targetColumns.length);
  const svgHeight = maxRows * (ROW_HEIGHT + ROW_GAP);

  return (
    <div className={cn("flex items-start gap-0", className)}>
      {/* Source columns */}
      <div className="flex w-40 shrink-0 flex-col gap-1">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Source
        </p>
        {sourceColumns.map((col, i) => (
          <motion.div
            key={col}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="flex h-[36px] items-center rounded border bg-muted px-2 text-xs font-mono"
          >
            {col}
          </motion.div>
        ))}
      </div>

      {/* SVG connecting lines */}
      <svg
        width="120"
        height={svgHeight + 24}
        className="shrink-0"
        style={{ marginTop: 24 }}
      >
        {mappings.map((mapping, i) => {
          const sourceIdx = sourceColumns.indexOf(mapping.source);
          const targetIdx = targetColumns.indexOf(mapping.target);
          if (sourceIdx === -1 || targetIdx === -1) return null;

          const y1 = sourceIdx * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2;
          const y2 = targetIdx * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2;

          return (
            <motion.line
              key={mapping.source}
              x1={0}
              y1={y1}
              x2={120}
              y2={y2}
              strokeWidth={2}
              className={confidenceColor(mapping.confidence)}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.5 + i * STAGGER_DELAY,
                duration: 0.6,
              }}
            />
          );
        })}
      </svg>

      {/* Target columns */}
      <div className="flex w-48 shrink-0 flex-col gap-1">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Target
        </p>
        {targetColumns.map((col, i) => {
          const mapping = mappings.find((m) => m.target === col);
          return (
            <motion.div
              key={col}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: i * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
              className="flex h-[36px] items-center justify-between rounded border bg-muted px-2 text-xs font-mono"
            >
              <span>{col}</span>
              {mapping && (
                <span
                  className={cn(
                    "ml-1 rounded px-1 py-0.5 text-[10px] font-medium border",
                    confidenceBg(mapping.confidence),
                  )}
                >
                  {Math.round(mapping.confidence * 100)}%
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
