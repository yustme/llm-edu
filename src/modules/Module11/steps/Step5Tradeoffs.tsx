import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Crosshair, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const ANIMATION_DURATION = 0.4;
const STAGGER_DELAY = 0.12;

// -- Slider configuration for the interactive gradient bar --------------------

const MIN_SIZE = 50;
const MAX_SIZE = 800;
const STEP_SIZE = 10;
const DEFAULT_SIZE = 300;

/** Zone boundaries (character counts) */
const TOO_SMALL_THRESHOLD = 150;
const TOO_LARGE_THRESHOLD = 600;

const TOO_SMALL_ISSUES = [
  "Sentences split across chunks",
  "Lost paragraph-level context",
  "More chunks = more embedding API calls",
  "Higher retrieval noise (many small, shallow matches)",
] as const;

const TOO_LARGE_ISSUES = [
  "Irrelevant text dilutes the semantic signal",
  "Exceeds embedding model token limits",
  "Wastes LLM context window tokens",
  "Lower retrieval precision (broad, unfocused matches)",
] as const;

const SWEET_SPOT_BENEFITS = [
  "Complete thoughts preserved in each chunk",
  "High semantic density per vector",
  "Efficient use of embedding and LLM tokens",
  "Balanced retrieval precision and recall",
] as const;

function getZone(size: number): "too-small" | "sweet-spot" | "too-large" {
  if (size < TOO_SMALL_THRESHOLD) return "too-small";
  if (size > TOO_LARGE_THRESHOLD) return "too-large";
  return "sweet-spot";
}

function getZoneLabel(zone: "too-small" | "sweet-spot" | "too-large"): string {
  switch (zone) {
    case "too-small":
      return "Too Small";
    case "sweet-spot":
      return "Sweet Spot";
    case "too-large":
      return "Too Large";
  }
}

/** Preset chunk sizes for arrow-key navigation: too small -> sweet spot -> too large */
const ZONE_PRESETS = [100, 350, 700] as const;

// -- Component ----------------------------------------------------------------

export function Step5Tradeoffs() {
  const [chunkSize, setChunkSize] = useState(DEFAULT_SIZE);
  const zone = getZone(chunkSize);

  const presetIndex = ZONE_PRESETS.findIndex((p) => p === chunkSize);
  const currentIndex = presetIndex === -1 ? 0 : presetIndex;
  const setPresetByIndex = useCallback(
    (i: number) => setChunkSize(ZONE_PRESETS[i]),
    [],
  );
  useFullscreenStepper(currentIndex, ZONE_PRESETS.length, setPresetByIndex);

  /** Normalized position of the slider thumb (0-1) for gradient indicator */
  const normalizedPosition = (chunkSize - MIN_SIZE) / (MAX_SIZE - MIN_SIZE);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Chunk Size Tradeoffs"
          highlights={["Context", "Precision", "Sweet Spot"]}
        >
          <p>
            Chunk size is the most impactful parameter in a chunking strategy.
            Too small and you lose context. Too large and you dilute relevance.
          </p>
          <p>
            <strong>Too small (under ~150 chars)</strong> - individual sentences
            or fragments that lack the surrounding context needed for the LLM to
            generate a coherent answer.
          </p>
          <p>
            <strong>Too large (over ~600 chars)</strong> - multi-topic chunks
            where the embedding vector becomes an average of different ideas,
            reducing retrieval precision.
          </p>
          <p>
            The <strong>sweet spot (200-500 chars)</strong> varies by use case,
            but generally aligns with a single coherent idea or paragraph.
          </p>
          <p>
            Use the slider on the right to explore how chunk size affects
            quality. The gradient bar shows the tradeoff zone visually.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Gradient tradeoff bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="space-y-2"
          >
            <p className="text-center text-sm font-medium text-muted-foreground">
              Chunk Size Spectrum
            </p>

            <div className="relative h-8 w-full overflow-hidden rounded-full">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-300 via-30% via-green-400 via-50% via-green-400 via-70% via-yellow-300 via-80% to-red-400" />

              {/* Position indicator */}
              <motion.div
                className="absolute top-0 h-full w-1 -translate-x-1/2 bg-foreground shadow-lg"
                animate={{ left: `${normalizedPosition * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Labels under the bar */}
            <div className="flex justify-between px-1 text-xs text-muted-foreground">
              <span>Too Small</span>
              <span>Sweet Spot</span>
              <span>Too Large</span>
            </div>
          </motion.div>

          {/* Chunk size slider */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: ANIMATION_DURATION }}
          >
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
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={STEP_SIZE}
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
            />
          </motion.div>

          {/* Current zone indicator */}
          <motion.div
            key={zone}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "rounded-xl border px-5 py-4 text-center",
              zone === "too-small" &&
                "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40",
              zone === "sweet-spot" &&
                "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40",
              zone === "too-large" &&
                "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40"
            )}
          >
            <div className="mb-2 flex items-center justify-center gap-2">
              {zone === "sweet-spot" ? (
                <Crosshair className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : zone === "too-small" ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <Expand className="h-5 w-5 text-red-500" />
              )}
              <span
                className={cn(
                  "text-lg font-bold",
                  zone === "sweet-spot"
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                )}
              >
                {getZoneLabel(zone)}
              </span>
            </div>
          </motion.div>

          {/* Zone-specific impacts */}
          <div className="space-y-2">
            {(zone === "too-small"
              ? TOO_SMALL_ISSUES
              : zone === "too-large"
                ? TOO_LARGE_ISSUES
                : SWEET_SPOT_BENEFITS
            ).map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.3 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="flex items-start gap-2.5 rounded-lg border bg-card px-4 py-2.5 text-sm"
              >
                <span
                  className={cn(
                    "mt-0.5 block size-2 shrink-0 rounded-full",
                    zone === "sweet-spot"
                      ? "bg-green-500"
                      : "bg-red-500"
                  )}
                />
                <span className="text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
