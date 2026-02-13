import { useState, useMemo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CitationSource } from "@/data/mock-grounding";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

interface CitationViewProps {
  response: string;
  sources: CitationSource[];
  className?: string;
}

/**
 * Parse a response string and split it into text segments and citation markers.
 * E.g. "text [1] more text [2]" -> [{type:"text",value:"text "},{type:"citation",value:1}, ...]
 */
interface TextSegment {
  type: "text";
  value: string;
}

interface CitationSegment {
  type: "citation";
  value: number;
}

type Segment = TextSegment | CitationSegment;

function parseResponse(response: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(response)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: response.slice(lastIndex, match.index) });
    }
    segments.push({ type: "citation", value: parseInt(match[1], 10) });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < response.length) {
    segments.push({ type: "text", value: response.slice(lastIndex) });
  }

  return segments;
}

const CITATION_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200",
  "bg-violet-100 text-violet-700 border-violet-300 hover:bg-violet-200",
  "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200",
  "bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-200",
] as const;

const SOURCE_CARD_COLORS = [
  "border-blue-300 bg-blue-50",
  "border-emerald-300 bg-emerald-50",
  "border-violet-300 bg-violet-50",
  "border-amber-300 bg-amber-50",
  "border-rose-300 bg-rose-50",
] as const;

function getCitationColor(index: number): string {
  return CITATION_COLORS[index % CITATION_COLORS.length];
}

function getSourceCardColor(index: number): string {
  return SOURCE_CARD_COLORS[index % SOURCE_CARD_COLORS.length];
}

/**
 * Displays a text response with inline citation markers and source reference cards below.
 * Hovering a citation marker highlights the corresponding source card.
 */
export function CitationView({ response, sources, className }: CitationViewProps) {
  const [hoveredCitation, setHoveredCitation] = useState<number | null>(null);
  const segments = useMemo(() => parseResponse(response), [response]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Response text with inline citations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        className="rounded-lg border bg-card p-5 text-sm leading-relaxed text-foreground"
      >
        {segments.map((segment, i) => {
          if (segment.type === "text") {
            return <Fragment key={i}>{segment.value}</Fragment>;
          }
          const sourceIndex = segment.value - 1;
          return (
            <button
              key={i}
              className={cn(
                "mx-0.5 inline-flex items-center justify-center rounded border px-1.5 py-0.5 text-xs font-semibold tabular-nums transition-colors cursor-pointer",
                getCitationColor(sourceIndex),
              )}
              onMouseEnter={() => setHoveredCitation(segment.value)}
              onMouseLeave={() => setHoveredCitation(null)}
              onClick={() =>
                setHoveredCitation(
                  hoveredCitation === segment.value ? null : segment.value,
                )
              }
            >
              {segment.value}
            </button>
          );
        })}
      </motion.div>

      {/* Source cards */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sources
        </p>
        <div className="space-y-3">
          <AnimatePresence>
            {sources.map((source, index) => {
              const isHighlighted = hoveredCitation === source.id;
              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: isHighlighted ? 1.02 : 1,
                  }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                    scale: { duration: 0.15 },
                  }}
                  className={cn(
                    "rounded-lg border-2 p-4 transition-shadow",
                    getSourceCardColor(index),
                    isHighlighted && "shadow-md ring-2 ring-primary/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        getCitationColor(index),
                      )}
                    >
                      {source.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {source.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {source.content}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate">{source.url}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
