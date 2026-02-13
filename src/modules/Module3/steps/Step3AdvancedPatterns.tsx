import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ReasoningPatternDiagram } from "@/components/reasoning/ReasoningPatternDiagram";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { REASONING_PATTERNS } from "@/data/mock-reasoning";
import type { ReasoningPattern } from "@/data/mock-reasoning";

const ANIMATION_DURATION = 0.4;

export function Step3AdvancedPatterns() {
  const [activePattern, setActivePattern] = useState<ReasoningPattern["id"]>(
    "tree-of-thought",
  );

  // Fullscreen arrow-key navigation: cycle through reasoning patterns
  const patternIndex = REASONING_PATTERNS.findIndex((p) => p.id === activePattern);
  const setPatternByIndex = useCallback(
    (i: number) => setActivePattern(REASONING_PATTERNS[i].id),
    [],
  );
  useFullscreenStepper(patternIndex, REASONING_PATTERNS.length, setPatternByIndex);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Advanced Reasoning Patterns"
          highlights={["ToT", "Self-Consistency", "Reflection", "ReAct"]}
        >
          <p>
            Beyond basic chain-of-thought, researchers have developed more
            sophisticated reasoning strategies. Each pattern addresses a
            different limitation of simple CoT and is suited to different types
            of problems.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Tree of Thought</strong> -- explore multiple reasoning
              paths, evaluate intermediate states, and prune bad branches.
            </li>
            <li>
              <strong>Self-Consistency</strong> -- generate multiple reasoning
              chains and take a majority vote on the final answer.
            </li>
            <li>
              <strong>Reflection</strong> -- generate, critique, and revise in
              an iterative loop until the output is satisfactory.
            </li>
            <li>
              <strong>ReAct</strong> -- interleave reasoning (Thought) with
              tool calls (Action) and results (Observation) for grounded
              problem solving.
            </li>
          </ul>
          <p>
            Use the tabs on the right to explore each pattern's flow diagram
            and learn when to apply it.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <Tabs
            value={activePattern}
            onValueChange={(v) =>
              setActivePattern(v as ReasoningPattern["id"])
            }
          >
            <TabsList className="grid w-full grid-cols-4">
              {REASONING_PATTERNS.map((pattern) => (
                <TabsTrigger key={pattern.id} value={pattern.id}>
                  {pattern.shortName}
                </TabsTrigger>
              ))}
            </TabsList>

            {REASONING_PATTERNS.map((pattern) => (
              <TabsContent key={pattern.id} value={pattern.id}>
                <PatternDetail pattern={pattern} />
              </TabsContent>
            ))}
          </Tabs>
        </InteractiveArea>
      </div>
    </div>
  );
}

function PatternDetail({ pattern }: { pattern: ReasoningPattern }) {
  return (
    <motion.div
      key={pattern.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_DURATION }}
      className="space-y-4"
    >
      {/* Pattern name and description */}
      <div>
        <h3 className="text-lg font-bold text-foreground">{pattern.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {pattern.description}
        </p>
      </div>

      {/* When to use */}
      <div className="rounded-lg border bg-muted/50 p-3">
        <Badge variant="secondary" className="mb-2 text-xs">
          When to Use
        </Badge>
        <p className="text-sm text-muted-foreground">{pattern.whenToUse}</p>
      </div>

      {/* Flow diagram */}
      <div className="rounded-xl border bg-white/50 p-4">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Flow Diagram
        </p>
        <div className="flex justify-center">
          <ReasoningPatternDiagram pattern={pattern.id} />
        </div>
      </div>
    </motion.div>
  );
}
