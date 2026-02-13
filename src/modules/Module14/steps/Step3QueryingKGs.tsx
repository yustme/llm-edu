import { useState } from "react";
import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { QueryTraversal } from "@/components/knowledge-graph/QueryTraversal";
import { Badge } from "@/components/ui/badge";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { KG_NODES, KG_EDGES, QUERY_EXAMPLES } from "@/data/mock-knowledge-graph";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const QUERY_TYPE_INFO = [
  {
    type: "Single-hop",
    description: "Follow one edge from the starting node to the answer.",
    example: "Where was Einstein born?",
  },
  {
    type: "Multi-hop",
    description:
      "Traverse multiple edges through intermediate nodes to reach the answer.",
    example: "What did the person born in Ulm develop?",
  },
  {
    type: "Path-finding",
    description:
      "Find how two distant nodes are connected through the graph.",
    example: "How are Einstein and Curie connected?",
  },
] as const;

export function Step3QueryingKGs() {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const activeQuery = QUERY_EXAMPLES[activeQueryIndex];

  useFullscreenStepper(activeQueryIndex, QUERY_EXAMPLES.length, setActiveQueryIndex);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Querying Knowledge Graphs"
          highlights={["Single-hop", "Multi-hop", "Path Finding", "Traversal"]}
        >
          <p>
            The real power of knowledge graphs lies in <strong>graph
            traversal</strong> -- following edges from node to node to answer
            questions that require connecting multiple facts.
          </p>
          <p>Three common query patterns:</p>
          <ul className="list-disc space-y-1 pl-5">
            {QUERY_TYPE_INFO.map((info) => (
              <li key={info.type}>
                <strong>{info.type}</strong> -- {info.description}
              </li>
            ))}
          </ul>
          <p>
            In practice, graph databases like Neo4j use query languages such as{" "}
            <strong>Cypher</strong> or <strong>SPARQL</strong> to express these
            traversal patterns. LLMs can generate these queries from natural
            language.
          </p>
          <p>
            Select a query type below and click <strong>Run</strong> to see the
            animated traversal.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          {/* Query selector */}
          <div className="flex flex-wrap gap-2">
            {QUERY_EXAMPLES.map((q, i) => (
              <motion.button
                key={q.question}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                onClick={() => setActiveQueryIndex(i)}
                className="text-left"
              >
                <Badge
                  variant={i === activeQueryIndex ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                >
                  {q.type.replace("-", " ")}
                </Badge>
              </motion.button>
            ))}
          </div>

          {/* Active query traversal */}
          <QueryTraversal
            key={activeQuery.question}
            nodes={KG_NODES}
            edges={KG_EDGES}
            query={activeQuery}
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
