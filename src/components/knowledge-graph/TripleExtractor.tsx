import { useMemo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { EntitySpan, KGTriple, KGNodeType } from "@/data/mock-knowledge-graph";
import { NODE_TYPE_COLORS } from "@/data/mock-knowledge-graph";

interface TripleExtractorProps {
  text: string;
  entitySpans: EntitySpan[];
  triples: KGTriple[];
  phaseIndex: number;
  onPhaseChange: (index: number) => void;
  className?: string;
}

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

type Phase = "raw" | "entities" | "triples" | "graph";

const PHASE_LABELS: Record<Phase, string> = {
  raw: "Raw Text",
  entities: "Entity Recognition (NER)",
  triples: "Extracted Triples",
  graph: "Mini Knowledge Graph",
};

const PHASES: Phase[] = ["raw", "entities", "triples", "graph"];

/** Build an entity-type lookup from entity spans */
function entityTypeMap(spans: EntitySpan[]): Map<string, KGNodeType> {
  const map = new Map<string, KGNodeType>();
  for (const span of spans) {
    map.set(span.text, span.type);
  }
  return map;
}

/**
 * Animated text-to-triples extraction component.
 * Shows the pipeline: raw text -> highlighted entities -> triples -> mini graph.
 */
export function TripleExtractor({
  text,
  entitySpans,
  triples,
  phaseIndex,
  onPhaseChange,
  className,
}: TripleExtractorProps) {
  const currentPhase = PHASES[phaseIndex] ?? PHASES[0];

  const typeMap = useMemo(() => entityTypeMap(entitySpans), [entitySpans]);

  /** Render text with entity highlights */
  const highlightedText = useMemo(() => {
    const sorted = [...entitySpans].sort((a, b) => a.startIndex - b.startIndex);
    const parts: { text: string; entity: EntitySpan | null }[] = [];
    let cursor = 0;
    for (const span of sorted) {
      if (span.startIndex > cursor) {
        parts.push({ text: text.slice(cursor, span.startIndex), entity: null });
      }
      parts.push({ text: span.text, entity: span });
      cursor = span.endIndex;
    }
    if (cursor < text.length) {
      parts.push({ text: text.slice(cursor), entity: null });
    }
    return parts;
  }, [text, entitySpans]);

  /** Unique nodes from triples for the mini graph */
  const miniNodes = useMemo(() => {
    const seen = new Set<string>();
    const nodes: { id: string; label: string; type: KGNodeType }[] = [];
    for (const triple of triples) {
      if (!seen.has(triple.subject)) {
        seen.add(triple.subject);
        nodes.push({
          id: triple.subject,
          label: triple.subject,
          type: typeMap.get(triple.subject) ?? "concept",
        });
      }
      if (!seen.has(triple.object)) {
        seen.add(triple.object);
        nodes.push({
          id: triple.object,
          label: triple.object,
          type: typeMap.get(triple.object) ?? "concept",
        });
      }
    }
    return nodes;
  }, [triples, typeMap]);

  /** Position mini graph nodes in a circle layout */
  const miniNodePositions = useMemo(() => {
    const cx = 280;
    const cy = 120;
    const rx = 200;
    const ry = 80;
    return miniNodes.map((node, i) => {
      const angle = (2 * Math.PI * i) / miniNodes.length - Math.PI / 2;
      return {
        ...node,
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
      };
    });
  }, [miniNodes]);

  const miniNodeMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const n of miniNodePositions) {
      map.set(n.id, { x: n.x, y: n.y });
    }
    return map;
  }, [miniNodePositions]);

  const canGoNext = phaseIndex < PHASES.length - 1;
  const canGoPrev = phaseIndex > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Phase indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {PHASES.map((phase, i) => (
            <Fragment key={phase}>
              {i > 0 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                  i === phaseIndex
                    ? "bg-primary/10 text-primary"
                    : i < phaseIndex
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {PHASE_LABELS[phase]}
              </span>
            </Fragment>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPhaseChange(phaseIndex - 1)}
            disabled={!canGoPrev}
          >
            Back
          </Button>
          <Button
            size="sm"
            onClick={() => onPhaseChange(phaseIndex + 1)}
            disabled={!canGoNext}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {/* Phase: raw text */}
        {currentPhase === "raw" && (
          <motion.div
            key="raw"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border bg-muted/50 p-4"
          >
            <p className="text-sm leading-relaxed text-foreground">{text}</p>
          </motion.div>
        )}

        {/* Phase: entity highlights */}
        {currentPhase === "entities" && (
          <motion.div
            key="entities"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border bg-muted/50 p-4"
          >
            <p className="text-sm leading-relaxed">
              {highlightedText.map((part, i) =>
                part.entity ? (
                  <motion.span
                    key={`entity-${i}`}
                    initial={{ backgroundColor: "transparent" }}
                    animate={{ backgroundColor: "var(--highlight)" }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className={cn(
                      "rounded px-1 py-0.5 font-medium",
                      NODE_TYPE_COLORS[part.entity.type].bg,
                      NODE_TYPE_COLORS[part.entity.type].text,
                    )}
                    title={part.entity.type}
                  >
                    {part.text}
                  </motion.span>
                ) : (
                  <span key={`text-${i}`}>{part.text}</span>
                ),
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entitySpans.map((span, i) => (
                <motion.span
                  key={span.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.3 + i * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    NODE_TYPE_COLORS[span.type].bg,
                    NODE_TYPE_COLORS[span.type].text,
                  )}
                >
                  {span.text}
                  <span className="opacity-60">({span.type})</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase: extracted triples */}
        {currentPhase === "triples" && (
          <motion.div
            key="triples"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {triples.map((triple, i) => {
              const subjectType = typeMap.get(triple.subject) ?? "concept";
              const objectType = typeMap.get(triple.object) ?? "concept";
              return (
                <motion.div
                  key={`${triple.subject}-${triple.predicate}-${triple.object}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
                >
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-xs font-medium",
                      NODE_TYPE_COLORS[subjectType].bg,
                      NODE_TYPE_COLORS[subjectType].text,
                    )}
                  >
                    {triple.subject}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {triple.predicate}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-xs font-medium",
                      NODE_TYPE_COLORS[objectType].bg,
                      NODE_TYPE_COLORS[objectType].text,
                    )}
                  >
                    {triple.object}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Phase: mini graph */}
        {currentPhase === "graph" && (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border bg-background"
          >
            <svg viewBox="0 0 560 240" className="h-auto w-full">
              {/* Edges from triples */}
              {triples.map((triple, i) => {
                const s = miniNodeMap.get(triple.subject);
                const t = miniNodeMap.get(triple.object);
                if (!s || !t) return null;
                return (
                  <motion.g key={`edge-${i}`}>
                    <motion.line
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                      x1={s.x}
                      y1={s.y}
                      x2={t.x}
                      y2={t.y}
                      stroke="#94a3b8"
                      strokeWidth={1}
                    />
                    <motion.text
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                      x={(s.x + t.x) / 2}
                      y={(s.y + t.y) / 2 - 4}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px]"
                    >
                      {triple.predicate}
                    </motion.text>
                  </motion.g>
                );
              })}

              {/* Nodes */}
              {miniNodePositions.map((node, i) => {
                const colors = NODE_TYPE_COLORS[node.type];
                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    style={{
                      transformOrigin: `${node.x}px ${node.y}px`,
                    }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={14}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={1.5}
                    />
                    <text
                      x={node.x}
                      y={node.y + 24}
                      textAnchor="middle"
                      className="fill-foreground text-[10px] font-medium"
                    >
                      {node.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
