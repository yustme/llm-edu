import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { REASONING_PATTERNS } from "@/data/mock-reasoning";
import type { ReasoningPattern, ReasoningPatternNode } from "@/data/mock-reasoning";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

interface ReasoningPatternDiagramProps {
  pattern: ReasoningPattern["id"];
}

const NODE_STYLES: Record<ReasoningPatternNode["type"], string> = {
  start: "bg-blue-100 border-blue-300 text-blue-800",
  process: "bg-slate-100 border-slate-300 text-slate-800",
  decision: "bg-amber-100 border-amber-300 text-amber-800",
  end: "bg-emerald-100 border-emerald-300 text-emerald-800",
};

/**
 * Renders an animated flow diagram for a reasoning pattern.
 * Each pattern type has a custom layout to represent its unique structure.
 */
export function ReasoningPatternDiagram({
  pattern,
}: ReasoningPatternDiagramProps) {
  const patternData = REASONING_PATTERNS.find((p) => p.id === pattern);
  if (!patternData) return null;

  switch (pattern) {
    case "tree-of-thought":
      return <TreeOfThoughtDiagram />;
    case "self-consistency":
      return <SelfConsistencyDiagram />;
    case "reflection":
      return <ReflectionDiagram />;
    case "react":
      return <ReActDiagram />;
    default:
      return null;
  }
}

function DiagramNode({
  label,
  type,
  delay,
  className,
}: {
  label: string;
  type: ReasoningPatternNode["type"];
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: ANIMATION_DURATION, ease: "easeOut" }}
      className={cn(
        "flex items-center justify-center rounded-lg border-2 px-3 py-2 text-xs font-semibold",
        NODE_STYLES[type],
        className,
      )}
    >
      {label}
    </motion.div>
  );
}

function AnimatedArrow({
  delay,
  direction = "down",
  label,
  className,
}: {
  delay: number;
  direction?: "down" | "right" | "left-up";
  label?: string;
  className?: string;
}) {
  const isDown = direction === "down";
  const isRight = direction === "right";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        isDown && "flex-col",
        className,
      )}
    >
      {isDown && (
        <svg width="20" height="24" viewBox="0 0 20 24" className="text-muted-foreground">
          <line x1="10" y1="0" x2="10" y2="18" stroke="currentColor" strokeWidth="2" />
          <polygon points="5,16 10,24 15,16" fill="currentColor" />
        </svg>
      )}
      {isRight && (
        <svg width="32" height="20" viewBox="0 0 32 20" className="text-muted-foreground">
          <line x1="0" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="2" />
          <polygon points="22,5 32,10 22,15" fill="currentColor" />
        </svg>
      )}
      {direction === "left-up" && (
        <svg width="40" height="30" viewBox="0 0 40 30" className="text-muted-foreground">
          <path d="M 35 25 Q 20 25 20 15 Q 20 5 10 5" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="12,0 5,5 12,10" fill="currentColor" />
        </svg>
      )}
      {label && (
        <span className="text-[10px] text-muted-foreground">{label}</span>
      )}
    </motion.div>
  );
}

/** Tree of Thought: branching tree with evaluation and pruning */
function TreeOfThoughtDiagram() {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Level 0: Problem */}
      <DiagramNode label="Problem" type="start" delay={0} />
      <AnimatedArrow delay={STAGGER_DELAY} />

      {/* Level 1: Three paths */}
      <div className="flex items-center gap-6">
        <DiagramNode label="Path A" type="process" delay={STAGGER_DELAY * 2} />
        <DiagramNode label="Path B" type="process" delay={STAGGER_DELAY * 3} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: STAGGER_DELAY * 4, duration: ANIMATION_DURATION }}
          className="flex items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-400 line-through"
        >
          Path C
        </motion.div>
      </div>

      {/* Evaluate 1 */}
      <AnimatedArrow delay={STAGGER_DELAY * 5} />
      <DiagramNode label="Evaluate & Prune" type="decision" delay={STAGGER_DELAY * 5} />
      <AnimatedArrow delay={STAGGER_DELAY * 6} />

      {/* Level 2: Deeper exploration */}
      <div className="flex items-center gap-4">
        <DiagramNode label="A-1" type="process" delay={STAGGER_DELAY * 7} />
        <DiagramNode label="A-2" type="process" delay={STAGGER_DELAY * 8} />
        <DiagramNode label="B-1" type="process" delay={STAGGER_DELAY * 9} />
      </div>

      {/* Evaluate 2 */}
      <AnimatedArrow delay={STAGGER_DELAY * 10} />
      <DiagramNode label="Evaluate" type="decision" delay={STAGGER_DELAY * 10} />
      <AnimatedArrow delay={STAGGER_DELAY * 11} />

      {/* Best answer */}
      <DiagramNode label="Best Answer" type="end" delay={STAGGER_DELAY * 12} className="px-6" />
    </div>
  );
}

/** Self-Consistency: parallel CoT paths converging to majority vote */
function SelfConsistencyDiagram() {
  const paths = [
    { label: "CoT Path 1", answer: "Answer: X" },
    { label: "CoT Path 2", answer: "Answer: X" },
    { label: "CoT Path 3", answer: "Answer: Y" },
  ];

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Question */}
      <DiagramNode label="Question" type="start" delay={0} />
      <AnimatedArrow delay={STAGGER_DELAY} />

      {/* Parallel paths */}
      <div className="flex items-start gap-6">
        {paths.map((path, i) => (
          <div key={path.label} className="flex flex-col items-center gap-2">
            <DiagramNode label={path.label} type="process" delay={STAGGER_DELAY * (2 + i)} />
            <AnimatedArrow delay={STAGGER_DELAY * (5 + i)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: STAGGER_DELAY * (8 + i), duration: ANIMATION_DURATION }}
              className={cn(
                "flex items-center justify-center rounded-lg border-2 px-3 py-2 text-xs font-semibold",
                path.answer.includes("X")
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-red-50 border-red-300 text-red-500 line-through",
              )}
            >
              {path.answer}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Converge arrows */}
      <AnimatedArrow delay={STAGGER_DELAY * 11} />

      {/* Majority vote */}
      <DiagramNode label="Majority Vote (2/3)" type="decision" delay={STAGGER_DELAY * 12} />
      <AnimatedArrow delay={STAGGER_DELAY * 13} />

      {/* Final answer */}
      <DiagramNode label="Final Answer: X" type="end" delay={STAGGER_DELAY * 14} className="px-6" />
    </div>
  );
}

/** Reflection: linear flow with a feedback loop */
function ReflectionDiagram() {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Problem */}
      <DiagramNode label="Problem" type="start" delay={0} />
      <AnimatedArrow delay={STAGGER_DELAY} />

      {/* Generate */}
      <DiagramNode label="Generate Initial Answer" type="process" delay={STAGGER_DELAY * 2} />
      <AnimatedArrow delay={STAGGER_DELAY * 3} />

      {/* Critique */}
      <div className="relative">
        <DiagramNode label="Self-Critique" type="decision" delay={STAGGER_DELAY * 4} />
      </div>

      {/* Branch: issues found -> revise (loop back) */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <AnimatedArrow delay={STAGGER_DELAY * 5} label="issues found" />
          <DiagramNode label="Revise Answer" type="process" delay={STAGGER_DELAY * 6} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: STAGGER_DELAY * 7, duration: 0.4 }}
            className="flex items-center text-muted-foreground"
          >
            <svg width="100" height="50" viewBox="0 0 100 50" className="text-amber-500">
              <path
                d="M 50 5 Q 90 5 90 25 Q 90 45 50 45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <polygon points="52,40 45,45 52,50" fill="currentColor" />
            </svg>
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: STAGGER_DELAY * 7, duration: 0.3 }}
            className="text-[10px] text-amber-600 font-medium"
          >
            loop back to critique
          </motion.span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <AnimatedArrow delay={STAGGER_DELAY * 5} label="looks good" />
          <DiagramNode label="Final Answer" type="end" delay={STAGGER_DELAY * 8} className="px-6" />
        </div>
      </div>
    </div>
  );
}

/** ReAct: Thought -> Action -> Observation cycle */
function ReActDiagram() {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Question */}
      <DiagramNode label="Question" type="start" delay={0} />
      <AnimatedArrow delay={STAGGER_DELAY} />

      {/* The cycle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: STAGGER_DELAY * 2, duration: 0.5 }}
        className="relative flex flex-col items-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/30 px-8 py-6 gap-2"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: STAGGER_DELAY * 2, duration: 0.3 }}
          className="absolute -top-3 left-4 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 border border-amber-200"
        >
          Reasoning Loop
        </motion.span>

        <DiagramNode label="Thought" type="process" delay={STAGGER_DELAY * 3} className="w-40" />
        <AnimatedArrow delay={STAGGER_DELAY * 4} />
        <DiagramNode label="Action (Tool Call)" type="process" delay={STAGGER_DELAY * 5} className="w-40" />
        <AnimatedArrow delay={STAGGER_DELAY * 6} />
        <DiagramNode label="Observation (Result)" type="process" delay={STAGGER_DELAY * 7} className="w-40" />
        <AnimatedArrow delay={STAGGER_DELAY * 8} />
        <DiagramNode label="Enough Info?" type="decision" delay={STAGGER_DELAY * 9} />

        {/* Loop arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: STAGGER_DELAY * 10, duration: 0.4 }}
          className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center"
        >
          <svg width="40" height="120" viewBox="0 0 40 120" className="text-amber-500">
            <path
              d="M 5 100 Q 5 110 15 110 Q 35 110 35 60 Q 35 10 15 10 Q 5 10 5 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <polygon points="0,18 5,28 10,18" fill="currentColor" />
          </svg>
          <span className="absolute top-1/2 -translate-y-1/2 -right-4 text-[10px] text-amber-600 font-medium whitespace-nowrap">
            No
          </span>
        </motion.div>
      </motion.div>

      {/* Yes path */}
      <AnimatedArrow delay={STAGGER_DELAY * 11} label="Yes" />

      {/* Final answer */}
      <DiagramNode label="Final Answer" type="end" delay={STAGGER_DELAY * 12} className="px-6" />
    </div>
  );
}
