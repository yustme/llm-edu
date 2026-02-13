import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { COMPARISON_SAMPLE_TEXT, CHUNK_COLORS } from "@/data/mock-chunking";
import {
  chunkText,
  type ChunkingStrategy,
  type ChunkResult,
} from "./chunking-utils";

// -- Configuration constants --------------------------------------------------

const COMPARISON_CHUNK_SIZE = 200;
const COMPARISON_OVERLAP = 0;
const ANIMATION_DURATION = 0.35;
const STAGGER_DELAY = 0.08;

interface ColumnConfig {
  strategy: ChunkingStrategy;
  label: string;
}

const COLUMNS: ColumnConfig[] = [
  { strategy: "fixed", label: "Fixed Size" },
  { strategy: "sentence", label: "Sentence-Based" },
  { strategy: "paragraph", label: "Paragraph-Based" },
];

// -- Component ----------------------------------------------------------------

export function ChunkComparisonView() {
  const columnChunks = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      chunks: chunkText(
        COMPARISON_SAMPLE_TEXT,
        col.strategy,
        COMPARISON_CHUNK_SIZE,
        COMPARISON_OVERLAP
      ),
    }));
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Same text, three strategies ({COMPARISON_CHUNK_SIZE} char target)
      </p>
      <div className="grid grid-cols-3 gap-3">
        {columnChunks.map((col, colIndex) => (
          <ComparisonColumn
            key={col.strategy}
            label={col.label}
            chunks={col.chunks}
            colIndex={colIndex}
          />
        ))}
      </div>
    </div>
  );
}

// -- Column sub-component -----------------------------------------------------

function ComparisonColumn({
  label,
  chunks,
  colIndex,
}: {
  label: string;
  chunks: ChunkResult[];
  colIndex: number;
}) {
  return (
    <div className="flex flex-col rounded-lg border bg-card">
      {/* Header */}
      <div className="border-b px-3 py-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </h4>
        <span className="text-xs text-muted-foreground">
          {chunks.length} chunks
        </span>
      </div>

      {/* Chunks */}
      <div className="space-y-1.5 p-2">
        {chunks.map((chunk, index) => {
          const color = CHUNK_COLORS[index % CHUNK_COLORS.length];
          return (
            <motion.div
              key={`${label}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: colIndex * 0.15 + index * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
              className={cn(
                "rounded border px-2 py-1.5",
                color.bg,
                color.border
              )}
            >
              <div className="mb-0.5 flex items-center justify-between">
                <Badge variant="outline" className="h-4 text-[10px] font-normal px-1.5">
                  {index + 1}
                </Badge>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {chunk.text.length}c
                </span>
              </div>
              <p
                className={cn(
                  "line-clamp-3 whitespace-pre-wrap text-[11px] leading-snug",
                  color.text
                )}
              >
                {chunk.text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
