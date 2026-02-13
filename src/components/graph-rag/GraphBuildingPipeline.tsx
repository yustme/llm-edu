import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  EXAMPLE_TEXT,
  EXTRACTED_ENTITIES,
  EXTRACTED_RELATIONSHIPS,
  ENTITY_TYPE_COLORS,
  ENTITY_TYPE_BORDER_COLORS,
} from "@/data/mock-graph-rag";
import type { ExtractedEntity, ExtractedRelationship } from "@/data/mock-graph-rag";
import { Button } from "@/components/ui/button";

/** Pipeline phases */
type PipelinePhase = "text" | "entities" | "relationships" | "graph";

const PHASE_LABELS: Record<PipelinePhase, string> = {
  text: "1. Source Text",
  entities: "2. Entity Extraction",
  relationships: "3. Relationship Extraction",
  graph: "4. Knowledge Graph",
};

const PHASE_ORDER: PipelinePhase[] = ["text", "entities", "relationships", "graph"];

const ENTITY_STAGGER = 0.08;
const RELATIONSHIP_STAGGER = 0.12;
const NODE_ANIMATION_DURATION = 0.4;

/** Pre-calculated positions for extracted entity nodes in the mini graph */
const MINI_GRAPH_POSITIONS: Record<string, { x: number; y: number }> = {
  "Sarah Chen": { x: 100, y: 50 },
  "Acme Corp": { x: 40, y: 120 },
  "AI Strategy": { x: 170, y: 120 },
  "James Park": { x: 300, y: 50 },
  "ML Platform": { x: 370, y: 120 },
  "San Francisco": { x: 280, y: 150 },
  "Dr. Maria Lopez": { x: 500, y: 50 },
  "MIT Lab": { x: 440, y: 120 },
  "NLP Research": { x: 540, y: 120 },
  "Graph Networks": { x: 500, y: 170 },
};

/**
 * Renders the example text with entities highlighted when phase >= "entities".
 */
function HighlightedText({
  showEntities,
  entities,
}: {
  showEntities: boolean;
  entities: ExtractedEntity[];
}) {
  if (!showEntities) {
    return <p className="text-sm leading-relaxed text-foreground">{EXAMPLE_TEXT}</p>;
  }

  // Build segments: alternating plain text and entity spans
  const segments: { text: string; entity?: ExtractedEntity }[] = [];
  let cursor = 0;

  const sorted = [...entities].sort((a, b) => a.startIndex - b.startIndex);
  for (const ent of sorted) {
    if (cursor < ent.startIndex) {
      segments.push({ text: EXAMPLE_TEXT.slice(cursor, ent.startIndex) });
    }
    segments.push({ text: ent.text, entity: ent });
    cursor = ent.endIndex;
  }
  if (cursor < EXAMPLE_TEXT.length) {
    segments.push({ text: EXAMPLE_TEXT.slice(cursor) });
  }

  return (
    <p className="text-sm leading-relaxed text-foreground">
      {segments.map((seg, i) =>
        seg.entity ? (
          <motion.span
            key={i}
            initial={{ backgroundColor: "transparent" }}
            animate={{ backgroundColor: "var(--highlight)" }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={cn(
              "rounded px-1 py-0.5 font-medium",
              ENTITY_TYPE_COLORS[seg.entity.type],
            )}
          >
            {seg.text}
          </motion.span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </p>
  );
}

/**
 * Renders extracted entity badges.
 */
function EntityList({ entities }: { entities: ExtractedEntity[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {entities.map((ent, i) => (
        <motion.span
          key={ent.text}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * ENTITY_STAGGER, duration: 0.3 }}
          className={cn(
            "rounded-md border px-2 py-1 text-xs font-medium",
            ENTITY_TYPE_COLORS[ent.type],
          )}
        >
          {ent.text}
          <span className="ml-1 opacity-60">({ent.type})</span>
        </motion.span>
      ))}
    </div>
  );
}

/**
 * Renders extracted relationships as a list.
 */
function RelationshipList({
  relationships,
}: {
  relationships: ExtractedRelationship[];
}) {
  return (
    <div className="space-y-1.5">
      {relationships.map((rel, i) => (
        <motion.div
          key={`${rel.source}-${rel.target}-${rel.label}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * RELATIONSHIP_STAGGER, duration: 0.3 }}
          className="flex items-center gap-2 text-xs"
        >
          <span className="font-medium text-foreground">{rel.source}</span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
            {rel.label}
          </span>
          <span className="text-muted-foreground">--&gt;</span>
          <span className="font-medium text-foreground">{rel.target}</span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Mini SVG graph showing extracted entities as nodes and relationships as edges.
 */
function MiniGraph({
  entities,
  relationships,
}: {
  entities: ExtractedEntity[];
  relationships: ExtractedRelationship[];
}) {
  return (
    <svg viewBox="0 0 600 200" className="w-full" style={{ maxHeight: 200 }}>
      {/* Edges */}
      {relationships.map((rel, i) => {
        const sourcePos = MINI_GRAPH_POSITIONS[rel.source];
        const targetPos = MINI_GRAPH_POSITIONS[rel.target];
        if (!sourcePos || !targetPos) return null;

        return (
          <motion.line
            key={`${rel.source}-${rel.target}`}
            x1={sourcePos.x}
            y1={sourcePos.y}
            x2={targetPos.x}
            y2={targetPos.y}
            stroke="#94a3b8"
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{
              delay: entities.length * 0.05 + i * 0.06,
              duration: 0.3,
            }}
          />
        );
      })}

      {/* Nodes */}
      {entities.map((ent, i) => {
        const pos = MINI_GRAPH_POSITIONS[ent.text];
        if (!pos) return null;
        const color = ENTITY_TYPE_BORDER_COLORS[ent.type];

        return (
          <motion.g
            key={ent.text}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: NODE_ANIMATION_DURATION }}
            style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={14}
              fill={color}
              fillOpacity={0.15}
              stroke={color}
              strokeWidth={1.5}
            />
            <text
              x={pos.x}
              y={pos.y + 26}
              textAnchor="middle"
              fill="#334155"
              fontSize={7}
              fontWeight={600}
            >
              {ent.text}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

/**
 * Animated pipeline showing text -> entity extraction -> relationship extraction -> graph.
 * Steps through phases with internal controls.
 */
export function GraphBuildingPipeline({ className }: { className?: string }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentPhase = PHASE_ORDER[phaseIndex];
  const isLastPhase = phaseIndex >= PHASE_ORDER.length - 1;

  const advance = useCallback(() => {
    setPhaseIndex((prev) => Math.min(prev + 1, PHASE_ORDER.length - 1));
  }, []);

  const resetPipeline = useCallback(() => {
    setPhaseIndex(0);
    setIsAutoPlaying(false);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || isLastPhase) {
      if (isLastPhase) setIsAutoPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      advance();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, isLastPhase, phaseIndex, advance]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Phase indicators */}
      <div className="flex items-center gap-2">
        {PHASE_ORDER.map((phase, idx) => (
          <div
            key={phase}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              idx <= phaseIndex
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {PHASE_LABELS[phase]}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 border-b pb-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          disabled={isLastPhase}
        >
          {isAutoPlaying ? "Pause" : "Auto-play"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={advance}
          disabled={isLastPhase || isAutoPlaying}
        >
          Next Phase
        </Button>
        <Button size="sm" variant="ghost" onClick={resetPipeline}>
          Reset
        </Button>
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Source text (always visible, with/without highlighting) */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Source Text
            </p>
            <HighlightedText
              showEntities={phaseIndex >= 1}
              entities={EXTRACTED_ENTITIES}
            />
          </div>

          {/* Entities */}
          {phaseIndex >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Extracted Entities
              </p>
              <EntityList entities={EXTRACTED_ENTITIES} />
            </motion.div>
          )}

          {/* Relationships */}
          {phaseIndex >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Extracted Relationships
              </p>
              <RelationshipList relationships={EXTRACTED_RELATIONSHIPS} />
            </motion.div>
          )}

          {/* Mini graph */}
          {phaseIndex >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Resulting Knowledge Graph
              </p>
              <div className="rounded-lg border bg-white p-2">
                <MiniGraph
                  entities={EXTRACTED_ENTITIES}
                  relationships={EXTRACTED_RELATIONSHIPS}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
