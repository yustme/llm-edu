import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  EMBEDDING_SCATTER_DATA,
  CLUSTER_COLORS,
  CLUSTER_LABELS,
} from "@/data/mock-tokenization";
import type { EmbeddingCluster } from "@/data/mock-tokenization";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";

const ANIMATION_DURATION = 0.4;
const STAGGER_DELAY = 0.06;

const SVG_WIDTH = 500;
const SVG_HEIGHT = 430;
const PADDING_LEFT = 40;
const PADDING_BOTTOM = 30;
const PADDING_TOP = 20;
const PADDING_RIGHT = 20;
const DOT_RADIUS = 5;
const DOT_RADIUS_HOVER = 7;

const CLUSTER_KEYS = Object.keys(CLUSTER_COLORS) as EmbeddingCluster[];

/**
 * SVG-based 2D scatter plot of word embeddings projected onto two axes.
 * Words are colored by cluster category with optional hover highlighting.
 */
export function EmbeddingScatter() {
  const [highlightedCluster, setHighlightedCluster] =
    useState<EmbeddingCluster | null>(null);

  // Fullscreen arrow-key control: position 0 = no highlight, 1..N = each cluster
  const stepperIndex = highlightedCluster === null ? 0 : CLUSTER_KEYS.indexOf(highlightedCluster) + 1;
  const setStepperPosition = useCallback(
    (i: number) => setHighlightedCluster(i === 0 ? null : CLUSTER_KEYS[i - 1]),
    [],
  );
  useFullscreenStepper(stepperIndex, CLUSTER_KEYS.length + 1, setStepperPosition);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center uppercase tracking-wide">
        2D Projection of Word Embeddings (t-SNE)
      </p>

      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="mx-auto"
        role="img"
        aria-label="Scatter plot showing word clusters in 2D embedding space"
      >
        {/* Background */}
        <rect
          x={PADDING_LEFT}
          y={PADDING_TOP}
          width={SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT}
          height={SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.1}
          rx={4}
        />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => {
          const xLine =
            PADDING_LEFT +
            frac * (SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT);
          const yLine =
            PADDING_TOP +
            frac * (SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM);
          return (
            <g key={frac}>
              <line
                x1={xLine}
                y1={PADDING_TOP}
                x2={xLine}
                y2={SVG_HEIGHT - PADDING_BOTTOM}
                stroke="currentColor"
                strokeOpacity={0.05}
              />
              <line
                x1={PADDING_LEFT}
                y1={yLine}
                x2={SVG_WIDTH - PADDING_RIGHT}
                y2={yLine}
                stroke="currentColor"
                strokeOpacity={0.05}
              />
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={SVG_WIDTH / 2}
          y={SVG_HEIGHT - 5}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={11}
        >
          Dimension 1
        </text>
        <text
          x={12}
          y={SVG_HEIGHT / 2}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={11}
          transform={`rotate(-90, 12, ${SVG_HEIGHT / 2})`}
        >
          Dimension 2
        </text>

        {/* Data points */}
        {EMBEDDING_SCATTER_DATA.map((point, index) => {
          const isHighlighted =
            highlightedCluster === null ||
            highlightedCluster === point.cluster;
          const opacity = isHighlighted ? 1 : 0.15;
          const radius =
            highlightedCluster === point.cluster
              ? DOT_RADIUS_HOVER
              : DOT_RADIUS;

          return (
            <g key={point.word}>
              {/* Dot */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={radius}
                fill={CLUSTER_COLORS[point.cluster]}
                opacity={opacity}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: radius, opacity }}
                transition={{
                  delay: index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHighlightedCluster(point.cluster)}
                onMouseLeave={() => setHighlightedCluster(null)}
              />
              {/* Label */}
              <motion.text
                x={point.x}
                y={point.y - DOT_RADIUS - 6}
                textAnchor="middle"
                dominantBaseline="auto"
                fontSize={10}
                fontWeight={500}
                fill={CLUSTER_COLORS[point.cluster]}
                opacity={opacity}
                initial={{ opacity: 0, y: point.y }}
                animate={{ opacity, y: point.y - DOT_RADIUS - 6 }}
                transition={{
                  delay: index * STAGGER_DELAY + 0.15,
                  duration: 0.3,
                }}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHighlightedCluster(point.cluster)}
                onMouseLeave={() => setHighlightedCluster(null)}
              >
                {point.word}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {CLUSTER_KEYS.map((cluster) => (
          <button
            key={cluster}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-opacity"
            style={{
              opacity:
                highlightedCluster === null || highlightedCluster === cluster
                  ? 1
                  : 0.3,
            }}
            onMouseEnter={() => setHighlightedCluster(cluster)}
            onMouseLeave={() => setHighlightedCluster(null)}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: CLUSTER_COLORS[cluster] }}
            />
            <span className="text-foreground">{CLUSTER_LABELS[cluster]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
