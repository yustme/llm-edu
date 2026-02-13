import { motion } from "framer-motion";
import {
  EMBEDDING_VECTORS,
  HEATMAP_DIMENSION_COUNT,
} from "@/data/mock-tokenization";

const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.02;

const CELL_SIZE = 28;
const LABEL_WIDTH = 70;
const HEADER_HEIGHT = 24;

/**
 * Map a value in [-1, 1] to an RGB color.
 * Negative = blue, zero = white, positive = red.
 */
function valueToColor(value: number): string {
  const clamped = Math.max(-1, Math.min(1, value));
  if (clamped >= 0) {
    // White to red
    const intensity = Math.round(255 * (1 - clamped));
    return `rgb(255, ${intensity}, ${intensity})`;
  }
  // White to blue
  const intensity = Math.round(255 * (1 + clamped));
  return `rgb(${intensity}, ${intensity}, 255)`;
}

/**
 * Heatmap visualization of embedding vectors.
 * Shows a grid where rows are words and columns are vector dimensions,
 * colored by value (blue = negative, white = zero, red = positive).
 */
export function EmbeddingHeatmap() {
  const totalWidth = LABEL_WIDTH + HEATMAP_DIMENSION_COUNT * CELL_SIZE;
  const totalHeight = HEADER_HEIGHT + EMBEDDING_VECTORS.length * CELL_SIZE;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center uppercase tracking-wide">
        Embedding Dimensions (20 of ~1536)
      </p>

      <div className="overflow-x-auto">
        <svg
          width={totalWidth}
          height={totalHeight + 20}
          className="mx-auto"
          role="img"
          aria-label="Embedding vector heatmap showing dimension values for selected words"
        >
          {/* Dimension index headers */}
          {Array.from({ length: HEATMAP_DIMENSION_COUNT }).map((_, dimIndex) => (
            <text
              key={`header-${dimIndex}`}
              x={LABEL_WIDTH + dimIndex * CELL_SIZE + CELL_SIZE / 2}
              y={HEADER_HEIGHT - 6}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={8}
            >
              {dimIndex + 1}
            </text>
          ))}

          {/* Word labels and cells */}
          {EMBEDDING_VECTORS.map((vector, rowIndex) => (
            <g key={vector.word}>
              {/* Word label */}
              <text
                x={LABEL_WIDTH - 8}
                y={HEADER_HEIGHT + rowIndex * CELL_SIZE + CELL_SIZE / 2 + 4}
                textAnchor="end"
                className="fill-foreground"
                fontSize={12}
                fontWeight={600}
                fontFamily="ui-monospace, monospace"
              >
                {vector.word}
              </text>

              {/* Dimension cells */}
              {vector.dimensions
                .slice(0, HEATMAP_DIMENSION_COUNT)
                .map((value, dimIndex) => {
                  const cellIndex =
                    rowIndex * HEATMAP_DIMENSION_COUNT + dimIndex;
                  return (
                    <motion.rect
                      key={`cell-${rowIndex}-${dimIndex}`}
                      x={LABEL_WIDTH + dimIndex * CELL_SIZE + 1}
                      y={HEADER_HEIGHT + rowIndex * CELL_SIZE + 1}
                      width={CELL_SIZE - 2}
                      height={CELL_SIZE - 2}
                      rx={3}
                      fill={valueToColor(value)}
                      stroke="currentColor"
                      strokeWidth={0.5}
                      strokeOpacity={0.1}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: cellIndex * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                    />
                  );
                })}

              {/* Value labels inside cells */}
              {vector.dimensions
                .slice(0, HEATMAP_DIMENSION_COUNT)
                .map((value, dimIndex) => {
                  const cellIndex =
                    rowIndex * HEATMAP_DIMENSION_COUNT + dimIndex;
                  return (
                    <motion.text
                      key={`val-${rowIndex}-${dimIndex}`}
                      x={LABEL_WIDTH + dimIndex * CELL_SIZE + CELL_SIZE / 2}
                      y={
                        HEADER_HEIGHT +
                        rowIndex * CELL_SIZE +
                        CELL_SIZE / 2 +
                        3
                      }
                      textAnchor="middle"
                      fontSize={7}
                      fontFamily="ui-monospace, monospace"
                      fill={Math.abs(value) > 0.5 ? "white" : "#333"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: cellIndex * STAGGER_DELAY + 0.15,
                        duration: 0.2,
                      }}
                    >
                      {value.toFixed(1)}
                    </motion.text>
                  );
                })}
            </g>
          ))}
        </svg>
      </div>

      {/* Color legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div
            className="h-3 w-3 rounded-sm border"
            style={{ background: valueToColor(-1) }}
          />
          <span>-1.0 (negative)</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="h-3 w-3 rounded-sm border"
            style={{ background: valueToColor(0) }}
          />
          <span>0.0 (neutral)</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="h-3 w-3 rounded-sm border"
            style={{ background: valueToColor(1) }}
          />
          <span>+1.0 (positive)</span>
        </div>
      </div>
    </div>
  );
}
