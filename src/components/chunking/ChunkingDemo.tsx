import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_TEXT, CHUNK_COLORS } from "@/data/mock-chunking";
import {
  chunkText,
  computeStats,
  type ChunkingStrategy,
  type ChunkResult,
} from "./chunking-utils";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";

// -- Configuration constants --------------------------------------------------

const DEFAULT_CHUNK_SIZE = 200;
const MIN_CHUNK_SIZE = 50;
const MAX_CHUNK_SIZE = 500;
const CHUNK_SIZE_STEP = 10;

const DEFAULT_OVERLAP = 10;
const MIN_OVERLAP = 0;
const MAX_OVERLAP = 50;
const OVERLAP_STEP = 5;

const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.05;

const STRATEGIES: { id: ChunkingStrategy; label: string }[] = [
  { id: "fixed", label: "Fixed Size" },
  { id: "sentence", label: "Sentence" },
  { id: "paragraph", label: "Paragraph" },
  { id: "recursive", label: "Recursive" },
];

// -- Component ----------------------------------------------------------------

export function ChunkingDemo() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [strategy, setStrategy] = useState<ChunkingStrategy>("fixed");
  const [chunkSize, setChunkSize] = useState(DEFAULT_CHUNK_SIZE);
  const [overlapPercent, setOverlapPercent] = useState(DEFAULT_OVERLAP);

  const strategyIndex = STRATEGIES.findIndex((s) => s.id === strategy);
  const setStrategyByIndex = useCallback(
    (i: number) => setStrategy(STRATEGIES[i].id),
    [],
  );
  useFullscreenStepper(strategyIndex, STRATEGIES.length, setStrategyByIndex);

  const chunks: ChunkResult[] = useMemo(
    () => chunkText(text, strategy, chunkSize, overlapPercent),
    [text, strategy, chunkSize, overlapPercent]
  );

  const stats = useMemo(
    () => computeStats(chunks, overlapPercent),
    [chunks, overlapPercent]
  );

  return (
    <div className="space-y-5">
      {/* Text input */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Input Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Paste or type text to chunk..."
        />
      </div>

      {/* Strategy selector */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Strategy
        </label>
        <div className="flex flex-wrap gap-2">
          {STRATEGIES.map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant={strategy === s.id ? "default" : "outline"}
              onClick={() => setStrategy(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Chunk Size
            </label>
            <span className="text-sm tabular-nums text-muted-foreground">
              {chunkSize} chars
            </span>
          </div>
          <input
            type="range"
            min={MIN_CHUNK_SIZE}
            max={MAX_CHUNK_SIZE}
            step={CHUNK_SIZE_STEP}
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
          />
          <div className="mt-0.5 flex justify-between text-xs text-muted-foreground">
            <span>{MIN_CHUNK_SIZE}</span>
            <span>{MAX_CHUNK_SIZE}</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Overlap
            </label>
            <span className="text-sm tabular-nums text-muted-foreground">
              {overlapPercent}%
            </span>
          </div>
          <input
            type="range"
            min={MIN_OVERLAP}
            max={MAX_OVERLAP}
            step={OVERLAP_STEP}
            value={overlapPercent}
            onChange={(e) => setOverlapPercent(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
          />
          <div className="mt-0.5 flex justify-between text-xs text-muted-foreground">
            <span>{MIN_OVERLAP}%</span>
            <span>{MAX_OVERLAP}%</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 px-4 py-2.5">
        <StatBadge label="Chunks" value={String(stats.chunkCount)} />
        <StatBadge label="Avg Size" value={`${stats.avgSize} chars`} />
        <StatBadge label="Min" value={`${stats.minSize}`} />
        <StatBadge label="Max" value={`${stats.maxSize}`} />
        <StatBadge label="Overlap" value={`${stats.overlapPercent}%`} />
      </div>

      {/* Chunked output */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Result ({chunks.length} chunks)
        </label>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {chunks.map((chunk, index) => {
              const color = CHUNK_COLORS[index % CHUNK_COLORS.length];
              return (
                <motion.div
                  key={`${strategy}-${chunkSize}-${overlapPercent}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm leading-relaxed",
                    color.bg,
                    color.border
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs font-normal">
                      Chunk {index + 1}
                    </Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {chunk.text.length} chars
                    </span>
                  </div>
                  <p className={cn("whitespace-pre-wrap text-xs", color.text)}>
                    {chunk.text}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// -- Internal helpers ---------------------------------------------------------

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}
