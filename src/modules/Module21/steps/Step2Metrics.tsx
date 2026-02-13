import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { MetricCard } from "@/components/evaluation/MetricCard";
import { Button } from "@/components/ui/button";
import { usePresentationStore } from "@/stores/presentation.store";
import { METRIC_SCENARIOS } from "@/data/mock-evaluation";

const SCENARIO_NAMES = Object.keys(METRIC_SCENARIOS);
const CARD_STAGGER = 0.12;

export function Step2Metrics() {
  const queryIndex = usePresentationStore((s) => s.queryIndex);
  const registerQueries = usePresentationStore((s) => s.registerQueries);
  const setQueryIndex = usePresentationStore((s) => s.setQueryIndex);

  useEffect(() => {
    registerQueries(SCENARIO_NAMES.length);
    return () => registerQueries(0);
  }, [registerQueries]);

  const selectedScenario = SCENARIO_NAMES[queryIndex] ?? SCENARIO_NAMES[0];
  const metrics = METRIC_SCENARIOS[selectedScenario] ?? [];

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Evaluation Metrics"
          highlights={["Accuracy", "Latency", "Cost", "Correctness"]}
        >
          <p>
            Effective evaluation tracks multiple dimensions of agent performance
            simultaneously:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Accuracy</strong> - How often the agent produces the
              correct answer, measured against ground truth
            </li>
            <li>
              <strong>Avg Latency</strong> - Response time from request to
              delivery; critical for user experience
            </li>
            <li>
              <strong>Cost per Query</strong> - Total cost including LLM tokens,
              tool calls, and compute
            </li>
            <li>
              <strong>Tool Correctness</strong> - Whether the agent selects and
              uses the right tools with valid parameters
            </li>
            <li>
              <strong>Completion Rate</strong> - Percentage of requests that the
              agent resolves without errors or fallbacks
            </li>
          </ul>
          <p>
            Compare the <strong>Production Agent</strong> with a{" "}
            <strong>Degraded Agent</strong> to see how these metrics reveal
            quality issues at a glance.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          {/* Scenario selector */}
          <div className="mb-6 flex items-center gap-2">
            {SCENARIO_NAMES.map((name, idx) => (
              <Button
                key={name}
                size="sm"
                variant={selectedScenario === name ? "default" : "outline"}
                onClick={() => setQueryIndex(idx)}
              >
                {name}
              </Button>
            ))}
          </div>

          {/* Metric cards grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedScenario}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-4 lg:grid-cols-3"
            >
              {metrics.map((metric, index) => (
                <MetricCard
                  key={`${selectedScenario}-${metric.name}`}
                  metric={metric}
                  delay={index * CARD_STAGGER}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </InteractiveArea>
      </div>
    </div>
  );
}
