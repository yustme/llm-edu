import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { KnowledgeGraphView } from "@/components/graph-rag/KnowledgeGraphView";
import { Badge } from "@/components/ui/badge";
import {
  GRAPH_NODES,
  GRAPH_EDGES,
  COMMUNITY_SUMMARIES,
  COMMUNITY_COLORS,
} from "@/data/mock-graph-rag";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

export function Step3Communities() {
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);

  // Fullscreen stepper: index 0 = "All", index 1..N = community IDs
  const COMMUNITY_OPTIONS: (number | null)[] = [null, ...COMMUNITY_SUMMARIES.map((c) => c.id)];
  const communityIndex = COMMUNITY_OPTIONS.indexOf(selectedCommunity);
  const setCommunityByIndex = useCallback(
    (i: number) => setSelectedCommunity(COMMUNITY_OPTIONS[i]),
    [],
  );
  useFullscreenStepper(communityIndex, COMMUNITY_OPTIONS.length, setCommunityByIndex);

  // Build highlighted nodes set based on selected community
  const highlightedNodes =
    selectedCommunity !== null
      ? new Set(
          GRAPH_NODES.filter((n) => n.community === selectedCommunity).map(
            (n) => n.id,
          ),
        )
      : undefined;

  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Community Detection"
          highlights={[
            "Leiden Algorithm",
            "Hierarchical Clustering",
            "Community Summaries",
          ]}
        >
          <p>
            After building the knowledge graph, GraphRAG groups densely
            connected nodes into <strong>communities</strong> using algorithms
            like Leiden or Louvain. Each community represents a cluster of
            closely related entities.
          </p>
          <p>
            For each community, the system generates a <strong>summary</strong>{" "}
            that describes the key entities and their relationships within that
            cluster. These summaries serve as a compressed, high-level view of
            the knowledge base.
          </p>
          <p>
            This hierarchical structure enables <strong>global search</strong>:
            instead of searching individual nodes, the system can reason over
            community summaries to answer broad, thematic questions about the
            entire dataset.
          </p>
          <p>
            Click on a community badge on the right to highlight its nodes in
            the graph and see its summary.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Graph + community summaries */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          {/* Community selector badges */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Communities:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCommunity(null)}
              className="cursor-pointer"
            >
              <Badge
                variant={selectedCommunity === null ? "default" : "secondary"}
                className="cursor-pointer"
              >
                All
              </Badge>
            </button>
            {COMMUNITY_SUMMARIES.map((comm) => (
              <button
                key={comm.id}
                type="button"
                onClick={() =>
                  setSelectedCommunity(
                    selectedCommunity === comm.id ? null : comm.id,
                  )
                }
                className="cursor-pointer"
              >
                <Badge
                  variant={
                    selectedCommunity === comm.id ? "default" : "secondary"
                  }
                  style={
                    selectedCommunity === comm.id
                      ? { backgroundColor: comm.color, color: "white" }
                      : undefined
                  }
                  className="cursor-pointer"
                >
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: comm.color }}
                  />
                  {comm.label}
                </Badge>
              </button>
            ))}
          </div>

          {/* SVG Knowledge Graph */}
          <div className="rounded-lg border bg-white p-2">
            <KnowledgeGraphView
              nodes={GRAPH_NODES}
              edges={GRAPH_EDGES}
              highlightedNodes={highlightedNodes}
            />
          </div>

          {/* Community summaries */}
          <div className="grid grid-cols-2 gap-3">
            {COMMUNITY_SUMMARIES.map((comm, index) => {
              const isSelected =
                selectedCommunity === null || selectedCommunity === comm.id;

              return (
                <motion.div
                  key={comm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isSelected ? 1 : 0.3, y: 0 }}
                  transition={{
                    delay: 0.3 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="rounded-lg border p-3"
                  style={{ borderColor: COMMUNITY_COLORS[comm.id] }}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: comm.color }}
                    />
                    <span className="text-xs font-semibold text-foreground">
                      {comm.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {comm.summary}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 border-t pt-3">
            <span className="text-xs text-muted-foreground">Node types:</span>
            {(
              [
                { letter: "P", label: "Person", color: "#3b82f6" },
                { letter: "O", label: "Organization", color: "#10b981" },
                { letter: "C", label: "Concept", color: "#f59e0b" },
                { letter: "L", label: "Location", color: "#8b5cf6" },
              ] as const
            ).map((item) => (
              <div key={item.letter} className="flex items-center gap-1">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.letter}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
