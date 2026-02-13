import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ModelComparisonChart } from "@/components/context-window/ModelComparisonChart";
import { MODEL_SPECS } from "@/data/mock-context-window";

const ANIMATION_DURATION = 0.4;

export function Step2ContextSizes() {
  // Calculate interesting stats for the info panel
  const maxModel = MODEL_SPECS.reduce((a, b) =>
    a.contextWindow > b.contextWindow ? a : b,
  );
  const cheapestModel = MODEL_SPECS.reduce((a, b) =>
    a.inputCostPer1k < b.inputCostPer1k ? a : b,
  );

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Context Window Sizes"
          highlights={["128K", "200K", "2M", "Cost Trade-off"]}
        >
          <p>
            Different models offer vastly different context window sizes. The
            size determines how much information you can fit into a single
            request.
          </p>
          <p>
            <strong>{maxModel.name}</strong> leads with a{" "}
            {(maxModel.contextWindow / 1_000_000).toFixed(1)}M token window,
            while most models now support at least 128K tokens.
          </p>
          <p>
            Larger context windows come with trade-offs:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Higher cost</strong> -- more input tokens means higher
              per-request cost
            </li>
            <li>
              <strong>Higher latency</strong> -- processing more tokens takes
              more time
            </li>
            <li>
              <strong>Attention degradation</strong> -- models may struggle to
              attend to details in very long contexts (the &quot;lost in the
              middle&quot; problem)
            </li>
          </ul>
          <p>
            A larger window does not always mean better results. Focused,
            relevant context often outperforms dumping everything into the
            prompt.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Model Context Window Comparison
          </p>

          <ModelComparisonChart />

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: MODEL_SPECS.length * 0.12 + 0.3,
              duration: ANIMATION_DURATION,
            }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="rounded-lg border bg-card p-3 text-center">
              <p className="text-lg font-bold tabular-nums text-primary">
                {(maxModel.contextWindow / 1_000_000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground">Largest Window</p>
              <p className="text-xs font-medium text-foreground">
                {maxModel.name}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3 text-center">
              <p className="text-lg font-bold tabular-nums text-green-600">
                ${cheapestModel.inputCostPer1k}
              </p>
              <p className="text-xs text-muted-foreground">Cheapest / 1K</p>
              <p className="text-xs font-medium text-foreground">
                {cheapestModel.name}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3 text-center">
              <p className="text-lg font-bold tabular-nums text-amber-600">
                ~750
              </p>
              <p className="text-xs text-muted-foreground">Words / 1K tokens</p>
              <p className="text-xs font-medium text-foreground">
                English avg.
              </p>
            </div>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
