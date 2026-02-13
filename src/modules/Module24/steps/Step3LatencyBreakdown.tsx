import { useEffect } from "react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { LatencyWaterfall } from "@/components/optimization/LatencyWaterfall";
import { Button } from "@/components/ui/button";
import { usePresentationStore } from "@/stores/presentation.store";
import { LATENCY_PHASES } from "@/data/mock-optimization";

const MODES = ["sequential", "parallel"] as const;

export function Step3LatencyBreakdown() {
  const queryIndex = usePresentationStore((s) => s.queryIndex);
  const registerQueries = usePresentationStore((s) => s.registerQueries);
  const setQueryIndex = usePresentationStore((s) => s.setQueryIndex);

  useEffect(() => {
    registerQueries(MODES.length);
    return () => registerQueries(0);
  }, [registerQueries]);

  const mode = MODES[queryIndex] ?? MODES[0];

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Latency Sources"
          highlights={["Model Inference", "Tool Calls", "Parallelization"]}
        >
          <p>
            Agent response latency is the sum of multiple phases. The main
            contributors are:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">LLM inference</span> - Time for
              the model to generate a response (typically the largest
              contributor)
            </li>
            <li>
              <span className="font-medium">Tool execution</span> - External
              API calls, database queries, and other tool invocations
            </li>
            <li>
              <span className="font-medium">Input processing</span> -
              Tokenization, embedding, and context assembly
            </li>
            <li>
              <span className="font-medium">Response generation</span> -
              Formatting and streaming the final answer
            </li>
          </ul>
          <p>
            When tool calls are <strong>independent</strong>, running them in
            parallel can dramatically reduce total latency. Toggle the mode
            below to see the difference.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Latency Waterfall
          </p>

          {/* Mode toggle */}
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant={mode === "sequential" ? "default" : "outline"}
              onClick={() => setQueryIndex(0)}
            >
              Sequential
            </Button>
            <Button
              size="sm"
              variant={mode === "parallel" ? "default" : "outline"}
              onClick={() => setQueryIndex(1)}
            >
              Parallel
            </Button>
          </div>

          <LatencyWaterfall phases={LATENCY_PHASES} mode={mode} />
        </InteractiveArea>
      </div>
    </div>
  );
}
