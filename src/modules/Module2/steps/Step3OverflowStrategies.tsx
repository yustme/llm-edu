import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { OverflowStrategyDiagram } from "@/components/context-window/OverflowStrategyDiagram";

export function Step3OverflowStrategies() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Overflow Strategies"
          highlights={["Truncation", "Sliding Window", "Summarization"]}
        >
          <p>
            When a conversation grows beyond the context window, you need a
            strategy to decide what stays and what goes. There are three common
            approaches.
          </p>
          <p>
            <strong>Truncation</strong> is the simplest: cut the oldest messages
            and keep only the most recent ones. It is fast but loses all early
            context.
          </p>
          <p>
            <strong>Sliding Window</strong> keeps the system prompt fixed and
            maintains a rolling window of the most recent turns. This is the
            default approach in most chat applications.
          </p>
          <p>
            <strong>Summarization</strong> uses an LLM to compress older
            messages into a brief summary before they are discarded. This
            preserves key information but adds cost and latency from the extra
            LLM call.
          </p>
          <p>
            In practice, many production systems combine these: a sliding window
            with periodic summarization of older turns.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Switch between strategies to see how they manage overflow
          </p>

          <OverflowStrategyDiagram />
        </InteractiveArea>
      </div>
    </div>
  );
}
