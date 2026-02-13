import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { InfoPanel } from "@/components/presentation/InfoPanel";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

interface LimitationItem {
  label: string;
  detail: string;
}

const STANDARD_RAG_LIMITATIONS: LimitationItem[] = [
  {
    label: "Individual chunk retrieval",
    detail: "Returns isolated text fragments without understanding how they connect",
  },
  {
    label: "No global view",
    detail: "Cannot summarize themes or patterns across the entire knowledge base",
  },
  {
    label: "Single-hop only",
    detail: "Finds documents matching the query but cannot follow chains of relationships",
  },
  {
    label: "Misses implicit connections",
    detail: "Two related facts in separate chunks are never linked together",
  },
];

const GRAPH_RAG_STRENGTHS: LimitationItem[] = [
  {
    label: "Relationship-aware retrieval",
    detail: "Understands how entities connect through typed relationships",
  },
  {
    label: "Community summaries",
    detail: "Pre-computed summaries of entity clusters provide a holistic overview",
  },
  {
    label: "Multi-hop reasoning",
    detail: "Traverses chains of relationships to answer complex queries",
  },
  {
    label: "Structural context",
    detail: "Retrieves subgraphs that preserve the context around entities",
  },
];

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Standard RAG Falls Short"
          highlights={[
            "Multi-hop Reasoning",
            "Knowledge Graph",
            "Community Summaries",
          ]}
        >
          <p>
            Standard RAG retrieves individual document chunks based on
            semantic similarity. This works well for direct factual questions,
            but fails when the answer requires understanding relationships
            between entities or synthesizing information across multiple
            documents.
          </p>
          <p>
            Consider the question: <strong>"What themes connect all
            departments in the organization?"</strong> Standard RAG would
            retrieve chunks mentioning individual departments, but cannot
            see the connections between them.
          </p>
          <p>
            <strong>GraphRAG</strong> solves this by building a knowledge
            graph from documents, detecting communities of related entities,
            and using graph traversal instead of (or alongside) vector search
            to retrieve structured context.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Comparison */}
      <div className="flex-1">
        <ComparisonView
          leftLabel="Standard RAG"
          rightLabel="GraphRAG"
          leftContent={
            <div className="space-y-3">
              {STANDARD_RAG_LIMITATIONS.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex gap-2"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + STANDARD_RAG_LIMITATIONS.length * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3"
              >
                <p className="text-xs font-medium text-red-800">
                  Example failing query:
                </p>
                <p className="mt-1 text-xs italic text-red-700">
                  "What themes connect all departments in the organization?"
                </p>
                <p className="mt-1 text-xs text-red-600">
                  Result: Retrieves isolated department descriptions without
                  identifying cross-cutting themes.
                </p>
              </motion.div>
            </div>
          }
          rightContent={
            <div className="space-y-3">
              {GRAPH_RAG_STRENGTHS.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.4 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex gap-2"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + GRAPH_RAG_STRENGTHS.length * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3"
              >
                <p className="text-xs font-medium text-green-800">
                  Same query with GraphRAG:
                </p>
                <p className="mt-1 text-xs italic text-green-700">
                  "What themes connect all departments in the organization?"
                </p>
                <p className="mt-1 text-xs text-green-600">
                  Result: Uses community summaries to identify shared themes
                  like AI Strategy, ML Platform, and global operations.
                </p>
              </motion.div>
            </div>
          }
        />
      </div>
    </div>
  );
}
