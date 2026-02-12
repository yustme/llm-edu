import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { OrchestrationDiagram } from "@/components/orchestration/OrchestrationDiagram";
import { Button } from "@/components/ui/button";
import { ROUTER_PATTERN, ROUTER_QUERY_TYPES } from "@/data/mock-orchestration";

export function Step4Router() {
  const [selectedQuery, setSelectedQuery] = useState<number | null>(null);

  const activeAgentId =
    selectedQuery !== null
      ? ROUTER_QUERY_TYPES[selectedQuery].targetAgentId
      : undefined;

  const activeRouterHighlight =
    selectedQuery !== null ? "router" : undefined;

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Router Pattern"
          highlights={["Router", "Classification", "Specialist"]}
        >
          <p>
            The <strong>router pattern</strong> classifies each incoming query
            and routes it to the most appropriate specialist agent. Think of
            it like a switch statement for agents.
          </p>
          <p>
            A router agent analyzes the user's intent (e.g., is this a
            coding question, a data query, or a general knowledge question?)
            and forwards the request to a specialist who can handle it best.
          </p>
          <p>
            This avoids wasting compute on agents that cannot contribute and
            ensures each query gets expert-level handling. The latency is low
            because only one specialist processes each query.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center gap-6">
          {/* Diagram */}
          <OrchestrationDiagram
            agents={ROUTER_PATTERN.agents}
            layout="router"
            activeAgentId={activeAgentId ?? activeRouterHighlight}
          />

          {/* Query selector */}
          <div className="w-full max-w-md space-y-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Select a query to see routing
            </motion.p>

            <div className="flex flex-col gap-2">
              {ROUTER_QUERY_TYPES.map((query, i) => (
                <motion.div
                  key={query.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.15, duration: 0.3 }}
                >
                  <Button
                    variant={selectedQuery === i ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedQuery(i)}
                  >
                    <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {query.type}
                    </span>
                    {query.label}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Routing result indicator */}
            <AnimatePresence mode="wait">
              {selectedQuery !== null && (
                <motion.div
                  key={selectedQuery}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm"
                >
                  Routed to:{" "}
                  <strong className="text-primary">
                    {ROUTER_PATTERN.agents.find(
                      (a) => a.id === ROUTER_QUERY_TYPES[selectedQuery].targetAgentId,
                    )?.name ?? "Unknown"}
                  </strong>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
