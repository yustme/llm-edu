import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BPE_VOCABULARY,
  PRESET_EXAMPLES,
  TOKEN_PALETTE,
} from "@/data/mock-tokenization";
import type { BpeVocabEntry } from "@/data/mock-tokenization";

const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.03;
const DEFAULT_TEXT = "Hello world! This is tokenization.";

/** Sorted vocabulary entries by token length (longest first) for greedy matching */
const SORTED_VOCAB: BpeVocabEntry[] = [...BPE_VOCABULARY].sort(
  (a, b) => b.token.length - a.token.length,
);

/** Build a lookup map from token string to ID */
const TOKEN_TO_ID = new Map<string, number>(
  BPE_VOCABULARY.map((entry) => [entry.token, entry.id]),
);

/** Greedy BPE tokenization: try longest match first */
function tokenize(text: string): { token: string; id: number }[] {
  const result: { token: string; id: number }[] = [];
  let position = 0;

  while (position < text.length) {
    let matched = false;
    for (const entry of SORTED_VOCAB) {
      if (text.startsWith(entry.token, position)) {
        result.push({ token: entry.token, id: entry.id });
        position += entry.token.length;
        matched = true;
        break;
      }
    }
    // If no match found, treat as unknown byte
    if (!matched) {
      const char = text[position];
      const fallbackId = TOKEN_TO_ID.get(char) ?? char.charCodeAt(0);
      result.push({ token: char, id: fallbackId });
      position += 1;
    }
  }

  return result;
}

/**
 * Interactive tokenizer that splits user input into color-coded subword tokens
 * and displays token IDs and statistics.
 */
export function TokenizerDemo() {
  const [text, setText] = useState(DEFAULT_TEXT);

  const tokens = useMemo(() => tokenize(text), [text]);

  const charCount = text.length;
  const tokenCount = tokens.length;
  const compressionRatio =
    charCount > 0 ? (charCount / tokenCount).toFixed(2) : "0";

  return (
    <div className="space-y-5">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESET_EXAMPLES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setText(preset.text)}
            className="rounded-md border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Text input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-lg border bg-background p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        rows={3}
        placeholder="Type or paste text here..."
      />

      {/* Token chips */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Tokens
        </p>
        <div className="flex flex-wrap gap-1">
          {tokens.map((t, index) => {
            const paletteIndex = index % TOKEN_PALETTE.length;
            const colorClass = TOKEN_PALETTE[paletteIndex];
            const displayToken =
              t.token === " "
                ? "\u2423"
                : t.token === "\n"
                  ? "\\n"
                  : t.token;

            return (
              <motion.span
                key={`${index}-${t.token}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-mono ${colorClass}`}
                title={`Token: "${t.token}" | ID: ${t.id}`}
              >
                {displayToken}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* Token IDs */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Token IDs
        </p>
        <div className="flex flex-wrap gap-1">
          {tokens.map((t, index) => (
            <motion.span
              key={`id-${index}-${t.id}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
              className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground"
            >
              {t.id}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 rounded-lg border bg-muted/30 px-4 py-2.5">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{charCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase">
            Characters
          </p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{tokenCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Tokens</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">
            {compressionRatio}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase">
            Chars/Token
          </p>
        </div>
      </div>
    </div>
  );
}
