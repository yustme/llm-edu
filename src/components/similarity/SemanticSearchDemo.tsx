import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMANTIC_SEARCH_DATA } from "@/data/mock-similarity";
import type { SearchDocument } from "@/data/mock-similarity";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STAGGER_DELAY = 0.08;
const ANIMATION_DURATION = 0.35;

/** Default threshold value */
const DEFAULT_THRESHOLD = 0.5;
/** Slider min/max/step */
const SLIDER_MIN = 0;
const SLIDER_MAX = 1;
const SLIDER_STEP = 0.05;

/** Score badge color thresholds */
const HIGH_SCORE_THRESHOLD = 0.7;
const MEDIUM_SCORE_THRESHOLD = 0.4;

/** Score badge colors */
const SCORE_COLORS = {
  high: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  low: "bg-red-100 text-red-700 border-red-300",
} as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getScoreColor(score: number): string {
  if (score >= HIGH_SCORE_THRESHOLD) return SCORE_COLORS.high;
  if (score >= MEDIUM_SCORE_THRESHOLD) return SCORE_COLORS.medium;
  return SCORE_COLORS.low;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface DocumentCardProps {
  doc: SearchDocument;
  index: number;
  isAboveThreshold: boolean;
}

function DocumentCard({ doc, index, isAboveThreshold }: DocumentCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        delay: index * STAGGER_DELAY,
        duration: ANIMATION_DURATION,
        layout: { duration: 0.3 },
      }}
      className={cn(
        "flex gap-3 rounded-lg border p-3 transition-opacity",
        isAboveThreshold ? "bg-card" : "bg-muted/30 opacity-50",
      )}
    >
      {/* Rank number */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {doc.title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
          {doc.snippet}
        </p>
      </div>

      {/* Similarity score badge */}
      <div
        className={cn(
          "flex h-7 shrink-0 items-center rounded-md border px-2 text-xs font-mono font-bold",
          getScoreColor(doc.similarity),
        )}
      >
        {doc.similarity.toFixed(2)}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface SemanticSearchDemoProps {
  /** Show the threshold slider prominently */
  showThreshold?: boolean;
  /** Show precision/recall indicators */
  showMetrics?: boolean;
  className?: string;
}

/**
 * Semantic search demonstration with query selection,
 * document ranking, and optional threshold filtering.
 */
export function SemanticSearchDemo({
  showThreshold = false,
  showMetrics = false,
  className,
}: SemanticSearchDemoProps) {
  const [selectedQueryId, setSelectedQueryId] = useState(
    SEMANTIC_SEARCH_DATA[0].id,
  );
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

  const selectedQuery = SEMANTIC_SEARCH_DATA.find(
    (q) => q.id === selectedQueryId,
  )!;

  const sortedDocs = useMemo(
    () => [...selectedQuery.documents].sort((a, b) => b.similarity - a.similarity),
    [selectedQuery],
  );

  const aboveThreshold = sortedDocs.filter((d) => d.similarity >= threshold);
  const belowThreshold = sortedDocs.filter((d) => d.similarity < threshold);

  /** Simulated precision: ratio of highly relevant docs above threshold */
  const truePositives = aboveThreshold.filter(
    (d) => d.similarity >= HIGH_SCORE_THRESHOLD,
  ).length;
  const precision =
    aboveThreshold.length > 0 ? truePositives / aboveThreshold.length : 0;

  /** Simulated recall: ratio of highly relevant docs retrieved */
  const totalRelevant = sortedDocs.filter(
    (d) => d.similarity >= HIGH_SCORE_THRESHOLD,
  ).length;
  const recall = totalRelevant > 0 ? truePositives / totalRelevant : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Query selector */}
      <div className="flex flex-wrap items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Query:</span>
        {SEMANTIC_SEARCH_DATA.map((q) => (
          <button
            key={q.id}
            onClick={() => setSelectedQueryId(q.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              q.id === selectedQueryId
                ? "border-primary bg-primary/10 text-primary"
                : "bg-card text-foreground hover:bg-accent",
            )}
          >
            {q.query}
          </button>
        ))}
      </div>

      {/* Threshold slider */}
      {showThreshold && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Similarity Threshold
            </label>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-mono font-bold text-primary">
              {threshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{SLIDER_MIN.toFixed(1)} (show all)</span>
            <span>{SLIDER_MAX.toFixed(1)} (exact match only)</span>
          </div>
        </div>
      )}

      {/* Metrics (precision/recall) */}
      {showMetrics && showThreshold && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Above Threshold</p>
            <p className="text-lg font-bold text-foreground">
              {aboveThreshold.length}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}/ {sortedDocs.length}
              </span>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Precision</p>
            <p className={cn("text-lg font-bold", precision >= 0.7 ? "text-green-600" : "text-yellow-600")}>
              {(precision * 100).toFixed(0)}%
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Recall</p>
            <p className={cn("text-lg font-bold", recall >= 0.7 ? "text-green-600" : "text-yellow-600")}>
              {(recall * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      )}

      {/* Document list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedDocs.map((doc, index) => (
            <DocumentCard
              key={`${selectedQueryId}-${doc.id}`}
              doc={doc}
              index={index}
              isAboveThreshold={doc.similarity >= threshold}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Threshold indicator */}
      {showThreshold && (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-foreground/70" />
            <span>Above threshold ({aboveThreshold.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span>Below threshold ({belowThreshold.length})</span>
          </div>
        </div>
      )}
    </div>
  );
}
