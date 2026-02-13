import { motion } from "framer-motion";
import { Clock, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const ANIMATION_DELAY_BASE = 0.3;
const ANIMATION_DELAY_STEP = 0.4;
const ANIMATION_DURATION = 0.5;

/** Timeline node representing a stage in the knowledge timeline */
interface TimelineNode {
  label: string;
  sublabel: string;
  color: string;
  icon: typeof Clock;
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    label: "Training Data",
    sublabel: "Books, web, code",
    color: "bg-blue-100 text-blue-600 border-blue-200",
    icon: BookOpen,
  },
  {
    label: "Knowledge Cutoff",
    sublabel: "Fixed point in time",
    color: "bg-amber-100 text-amber-600 border-amber-200",
    icon: Clock,
  },
  {
    label: "Knowledge Gap",
    sublabel: "New docs, policies, data",
    color: "bg-red-100 text-red-600 border-red-200",
    icon: AlertTriangle,
  },
];

/** Animated timeline diagram showing the knowledge gap that RAG fills */
function KnowledgeTimeline() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Timeline row */}
      <div className="flex items-center justify-center gap-4">
        {TIMELINE_NODES.map((node, index) => (
          <div key={node.label} className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay:
                  ANIMATION_DELAY_BASE + index * ANIMATION_DELAY_STEP * 2,
                duration: ANIMATION_DURATION,
                ease: "easeOut",
              }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${node.color}`}
              >
                <node.icon className="h-7 w-7" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {node.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {node.sublabel}
              </span>
            </motion.div>

            {/* Arrow between nodes */}
            {index < TIMELINE_NODES.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay:
                    ANIMATION_DELAY_BASE +
                    index * ANIMATION_DELAY_STEP * 2 +
                    ANIMATION_DELAY_STEP,
                  duration: ANIMATION_DURATION,
                }}
              >
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* RAG bridge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: ANIMATION_DELAY_BASE + TIMELINE_NODES.length * ANIMATION_DELAY_STEP * 2,
          duration: 0.6,
          ease: "easeOut",
        }}
        className="flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-2 rounded-full bg-green-100 px-5 py-2.5 border-2 border-green-300">
          <BookOpen className="h-5 w-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            RAG fills this gap
          </span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay:
              ANIMATION_DELAY_BASE +
              TIMELINE_NODES.length * ANIMATION_DELAY_STEP * 2 +
              0.4,
            duration: 0.5,
          }}
          className="max-w-sm text-center text-xs text-muted-foreground"
        >
          By retrieving relevant documents at query time, RAG gives the LLM
          access to knowledge beyond its training cutoff.
        </motion.p>
      </motion.div>
    </div>
  );
}

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why LLMs Need External Knowledge"
          highlights={[
            "Knowledge Cutoff",
            "Hallucination",
            "Retrieval-Augmented Generation",
          ]}
        >
          <p>
            Large Language Models are trained on vast amounts of text, but their
            knowledge is frozen at a specific point in time - the training
            cutoff. They have no access to your internal documents, recent
            updates, or proprietary data.
          </p>
          <p>
            When asked about information outside their training data, LLMs often
            produce <strong>hallucinations</strong> - confident-sounding answers
            that are factually incorrect or entirely fabricated.
          </p>
          <p>
            <strong>Retrieval-Augmented Generation (RAG)</strong> solves this by
            fetching relevant documents from a knowledge base before generating a
            response, grounding the LLM's answer in real, verifiable data.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-4 text-center text-sm font-medium text-muted-foreground"
          >
            The LLM Knowledge Problem:
          </motion.p>
          <KnowledgeTimeline />
        </InteractiveArea>
      </div>
    </div>
  );
}
