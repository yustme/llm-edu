import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { NODE_TYPE_COLORS } from "@/data/mock-knowledge-graph";
import type { KGNodeType } from "@/data/mock-knowledge-graph";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

/** Simple graph data for the introductory SVG */
const INTRO_NODES: {
  id: string;
  label: string;
  type: KGNodeType;
  x: number;
  y: number;
}[] = [
  { id: "einstein", label: "Albert Einstein", type: "person", x: 160, y: 100 },
  { id: "ulm", label: "Ulm", type: "place", x: 60, y: 220 },
  { id: "relativity", label: "Relativity", type: "concept", x: 300, y: 220 },
  { id: "theory", label: "Theory", type: "concept", x: 440, y: 140 },
];

const INTRO_EDGES: { source: string; target: string; label: string }[] = [
  { source: "einstein", target: "ulm", label: "born_in" },
  { source: "einstein", target: "relativity", label: "developed" },
  { source: "relativity", target: "theory", label: "type" },
];

const TRIPLE_EXAMPLES = [
  { subject: "Einstein", predicate: "born_in", object: "Ulm" },
  { subject: "Einstein", predicate: "developed", object: "Relativity" },
  { subject: "Relativity", predicate: "type", object: "Theory" },
];

const BUILDING_BLOCKS = [
  {
    term: "Nodes (Entities)",
    description:
      "Objects or concepts in the world -- people, places, things, ideas.",
  },
  {
    term: "Edges (Relationships)",
    description:
      "Typed connections between nodes -- born_in, developed, type_of.",
  },
  {
    term: "Triples",
    description:
      "The atomic unit: (Subject, Predicate, Object) -- e.g., (Einstein, born_in, Ulm).",
  },
];

/** Build a lookup map */
function nodeMap(
  nodes: typeof INTRO_NODES,
): Map<string, (typeof INTRO_NODES)[number]> {
  const map = new Map<string, (typeof INTRO_NODES)[number]>();
  for (const node of nodes) {
    map.set(node.id, node);
  }
  return map;
}

export function Step1WhatAreKGs() {
  const nMap = nodeMap(INTRO_NODES);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="What are Knowledge Graphs?"
          highlights={["Nodes", "Edges", "Triples", "Structured Knowledge"]}
        >
          <p>
            A <strong>knowledge graph</strong> is a structured representation of
            real-world entities and the relationships between them. Unlike flat
            tables or documents, a knowledge graph captures how things relate to
            each other in a network structure.
          </p>
          <p>The three building blocks:</p>
          <ul className="list-disc space-y-1 pl-5">
            {BUILDING_BLOCKS.map((block) => (
              <li key={block.term}>
                <strong>{block.term}</strong> -- {block.description}
              </li>
            ))}
          </ul>
          <p>
            Knowledge graphs power search engines, recommendation systems, and
            AI reasoning by providing <strong>structured, traversable</strong>{" "}
            knowledge that both humans and machines can query.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* SVG graph */}
          <div>
            <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
              A Simple Knowledge Graph
            </p>
            <div className="overflow-hidden rounded-lg border bg-background">
              <svg viewBox="0 0 520 300" className="h-auto w-full">
                {/* Edges */}
                {INTRO_EDGES.map((edge, i) => {
                  const source = nMap.get(edge.source);
                  const target = nMap.get(edge.target);
                  if (!source || !target) return null;
                  return (
                    <motion.g key={`edge-${i}`}>
                      <motion.line
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{
                          delay: 0.5 + i * 0.2,
                          duration: 0.4,
                        }}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                      />
                      <motion.text
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{
                          delay: 0.7 + i * 0.2,
                          duration: 0.3,
                        }}
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 - 6}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px] font-medium"
                      >
                        {edge.label}
                      </motion.text>
                    </motion.g>
                  );
                })}

                {/* Nodes */}
                {INTRO_NODES.map((node, i) => {
                  const colors = NODE_TYPE_COLORS[node.type];
                  return (
                    <motion.g
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: i * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
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
                        r={24}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth={2}
                      />
                      <text
                        x={node.x}
                        y={node.y + 36}
                        textAnchor="middle"
                        className="fill-foreground text-[11px] font-semibold"
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4">
            {(
              Object.entries(NODE_TYPE_COLORS) as [
                KGNodeType,
                (typeof NODE_TYPE_COLORS)[KGNodeType],
              ][]
            ).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors.fill }}
                />
                <span className="capitalize text-muted-foreground">
                  {colors.label}
                </span>
              </div>
            ))}
          </div>

          {/* Triples */}
          <div>
            <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
              As Triples (Subject -- Predicate -- Object)
            </p>
            <div className="space-y-2">
              {TRIPLE_EXAMPLES.map((triple, i) => (
                <motion.div
                  key={`${triple.subject}-${triple.predicate}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 1.0 + i * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm"
                >
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {triple.subject}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {triple.predicate}
                  </span>
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                    {triple.object}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
