import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EXAMPLE_PROMPTS,
  WORD_TO_TOKEN_RATIO,
  DEFAULT_CONTEXT_WINDOW_SIZE,
  DEFAULT_RESPONSE_RESERVATION,
} from "@/data/mock-context-window";

// ---------------------------------------------------------------------------
// Simple mock tokenizer: split by whitespace/punctuation, multiply by ratio
// ---------------------------------------------------------------------------

function estimateTokenCount(text: string): number {
  if (!text.trim()) return 0;
  // Split on whitespace and punctuation boundaries
  const words = text.trim().split(/\s+/);
  return Math.ceil(words.length * WORD_TO_TOKEN_RATIO);
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// Context window size options for the selector
// ---------------------------------------------------------------------------

const CONTEXT_WINDOW_OPTIONS = [
  { label: "8K", value: 8_000 },
  { label: "32K", value: 32_000 },
  { label: "128K", value: 128_000 },
  { label: "200K", value: 200_000 },
];

/**
 * Interactive token counter with live fill bar.
 * Lets users type text, see estimated token counts, and visualize
 * how much of the context window is being used.
 */
export function TokenCounter() {
  const [systemPrompt, setSystemPrompt] = useState<string>(
    EXAMPLE_PROMPTS[0].systemPrompt,
  );
  const [userPrompt, setUserPrompt] = useState<string>(
    EXAMPLE_PROMPTS[0].userPrompt,
  );
  const [contextWindowSize, setContextWindowSize] = useState<number>(
    DEFAULT_CONTEXT_WINDOW_SIZE,
  );
  const [responseReservation, setResponseReservation] = useState<number>(
    DEFAULT_RESPONSE_RESERVATION,
  );

  // Calculate token counts
  const systemTokens = useMemo(
    () => estimateTokenCount(systemPrompt),
    [systemPrompt],
  );
  const userTokens = useMemo(
    () => estimateTokenCount(userPrompt),
    [userPrompt],
  );
  const totalInputTokens = systemTokens + userTokens;
  const totalUsed = totalInputTokens + responseReservation;
  const remainingTokens = contextWindowSize - totalUsed;
  const usagePercent = Math.min(
    (totalUsed / contextWindowSize) * 100,
    100,
  );
  const isOverflow = totalUsed > contextWindowSize;
  const inputPercent = Math.min(
    (totalInputTokens / contextWindowSize) * 100,
    100,
  );
  const reservedPercent = Math.min(
    (responseReservation / contextWindowSize) * 100,
    100 - inputPercent,
  );

  // Load an example prompt
  const loadExample = (index: number) => {
    const example = EXAMPLE_PROMPTS[index];
    setSystemPrompt(example.systemPrompt);
    setUserPrompt(example.userPrompt);
  };

  return (
    <div className="space-y-5">
      {/* Example prompt selector */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Load Example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={example.label}
              onClick={() => loadExample(index)}
              className="rounded-md border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      {/* Context window size selector */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Context Window Size
          </label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {formatNumber(contextWindowSize)} tokens
          </span>
        </div>
        <div className="flex gap-2">
          {CONTEXT_WINDOW_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setContextWindowSize(option.value)}
              className={cn(
                "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                contextWindowSize === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Response reservation slider */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Response Reservation
          </label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {formatNumber(responseReservation)} tokens
          </span>
        </div>
        <input
          type="range"
          min={512}
          max={16384}
          step={512}
          value={responseReservation}
          onChange={(e) => setResponseReservation(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
        />
        <div className="mt-0.5 flex justify-between text-xs text-muted-foreground">
          <span>512</span>
          <span>16,384</span>
        </div>
      </div>

      {/* System prompt textarea */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            System Prompt
          </label>
          <span className="text-xs tabular-nums text-violet-600">
            ~{systemTokens} tokens
          </span>
        </div>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={3}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Enter system prompt..."
        />
      </div>

      {/* User prompt textarea */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            User Prompt
          </label>
          <span className="text-xs tabular-nums text-blue-600">
            ~{userTokens} tokens
          </span>
        </div>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={4}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Enter user message..."
        />
      </div>

      {/* Fill meter visualization */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Context Usage
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={isOverflow ? "overflow" : "ok"}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={cn(
                "flex items-center gap-1 text-xs font-semibold",
                isOverflow ? "text-red-600" : "text-green-600",
              )}
            >
              {isOverflow ? (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  OVERFLOW ({formatNumber(Math.abs(remainingTokens))} over)
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  {formatNumber(remainingTokens)} remaining
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Stacked bar */}
        <div className="relative h-8 w-full overflow-hidden rounded-lg bg-muted">
          {/* Input tokens segment */}
          <motion.div
            className={cn(
              "absolute inset-y-0 left-0 rounded-l-lg",
              isOverflow ? "bg-red-500" : "bg-blue-500",
            )}
            initial={{ width: 0 }}
            animate={{ width: `${inputPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Response reservation segment */}
          <motion.div
            className={cn(
              "absolute inset-y-0",
              isOverflow ? "bg-red-300" : "bg-amber-400",
            )}
            style={{ left: `${inputPercent}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${reservedPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          />
          {/* Percentage label centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-sm">
              {usagePercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-sm",
                isOverflow ? "bg-red-500" : "bg-blue-500",
              )}
            />
            Input: ~{formatNumber(totalInputTokens)} tokens
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-sm",
                isOverflow ? "bg-red-300" : "bg-amber-400",
              )}
            />
            Reserved: ~{formatNumber(responseReservation)} tokens
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted border" />
            Free: ~{formatNumber(Math.max(remainingTokens, 0))} tokens
          </span>
        </div>
      </div>

      {/* Token breakdown summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-violet-50 p-3 text-center">
          <p className="text-lg font-bold tabular-nums text-violet-700">
            {formatNumber(systemTokens)}
          </p>
          <p className="text-xs text-violet-600">System Tokens</p>
        </div>
        <div className="rounded-lg border bg-blue-50 p-3 text-center">
          <p className="text-lg font-bold tabular-nums text-blue-700">
            {formatNumber(userTokens)}
          </p>
          <p className="text-xs text-blue-600">User Tokens</p>
        </div>
        <div
          className={cn(
            "rounded-lg border p-3 text-center",
            isOverflow ? "bg-red-50" : "bg-amber-50",
          )}
        >
          <p
            className={cn(
              "text-lg font-bold tabular-nums",
              isOverflow ? "text-red-700" : "text-amber-700",
            )}
          >
            {formatNumber(responseReservation)}
          </p>
          <p
            className={cn(
              "text-xs",
              isOverflow ? "text-red-600" : "text-amber-600",
            )}
          >
            Response Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
