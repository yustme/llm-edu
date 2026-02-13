import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MULTI_AGENT_STEPS,
  ACTOR,
  getActorDisplayName,
  getMessageTarget,
} from "@/data/mock-multi-agent";
import { AGENTS, USER_COLOR } from "@/config/multi-agent.config";
import type { SimulationStep } from "@/types/agent.types";

/** Filter options for the message timeline */
const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: ACTOR.dataAnalyst, label: "Data Analyst" },
  { id: ACTOR.dataEngineer, label: "Data Engineer" },
  { id: ACTOR.reportingAgent, label: "Reporting Agent" },
  { id: ACTOR.user, label: "User" },
] as const;

/** Get color config for an actor */
function getActorColorConfig(actorId: string) {
  if (actorId === ACTOR.user) {
    return {
      bg: USER_COLOR.bg,
      text: USER_COLOR.text,
      border: USER_COLOR.border,
      accent: USER_COLOR.accent,
    };
  }
  const agent = AGENTS[actorId];
  if (agent) {
    return {
      bg: agent.color.bg,
      text: agent.color.text,
      border: agent.color.border,
      accent: agent.color.accent,
    };
  }
  return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300", accent: "#94a3b8" };
}

/** Type label for display */
function getTypeLabel(type: string): string {
  switch (type) {
    case "user-input":
      return "Input";
    case "reasoning":
      return "Thinking";
    case "agent-message":
      return "Message";
    case "tool-call":
      return "Tool Call";
    case "tool-result":
      return "Tool Result";
    case "final-response":
      return "Final Response";
    default:
      return type;
  }
}

/** Single message card in the timeline */
function MessageCard({
  step,
  index,
}: {
  step: SimulationStep;
  index: number;
}) {
  const colors = getActorColorConfig(step.actor);
  const target = getMessageTarget(step);
  const actorName = getActorDisplayName(step.actor);
  const targetName = target ? getActorDisplayName(target) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn("rounded-lg border-l-4 bg-card p-3 shadow-sm", colors.border)}
    >
      {/* Header: sender -> receiver + type badge */}
      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-semibold", colors.text)}>
          {actorName}
        </span>
        {targetName && (
          <>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {targetName}
            </span>
          </>
        )}
        <Badge variant="outline" className="ml-auto text-[10px]">
          {getTypeLabel(step.type)}
        </Badge>
      </div>

      {/* Content */}
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
        {step.content}
      </p>

      {/* Tool info if applicable */}
      {step.metadata?.toolName != null && (
        <div className="mt-1.5">
          <Badge variant="secondary" className="text-[10px] font-mono">
            {String(step.metadata.toolName)}
          </Badge>
        </div>
      )}
    </motion.div>
  );
}

export function Step5Messages() {
  const [filter, setFilter] = useState<string>("all");

  const filterIndex = FILTER_OPTIONS.findIndex((o) => o.id === filter);
  const setFilterByIndex = useCallback(
    (i: number) => setFilter(FILTER_OPTIONS[i].id),
    [],
  );
  useFullscreenStepper(filterIndex, FILTER_OPTIONS.length, setFilterByIndex);

  const filteredMessages = useMemo(() => {
    if (filter === "all") return MULTI_AGENT_STEPS;
    return MULTI_AGENT_STEPS.filter((step) => step.actor === filter);
  }, [filter]);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Browse Individual Messages"
          highlights={["Timeline", "Color-Coded", "Filterable"]}
        >
          <p>
            Here you can browse through all {MULTI_AGENT_STEPS.length} messages
            in the multi-agent workflow. Each message is color-coded by the
            sending agent.
          </p>
          <p>
            Use the filter buttons to focus on messages from a specific agent,
            or view all messages to see the complete conversation flow.
          </p>
          <p>
            Notice how the agents pass information along the chain: the Data
            Analyst translates the user's question, the Data Engineer fetches
            the data, and the Reporting Agent produces the final output.
          </p>

          {/* Filter controls */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Filter className="h-3 w-3" />
              Filter by agent:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  variant={filter === option.id ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setFilter(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full max-h-[520px] flex-col overflow-auto">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredMessages.map((step, index) => (
                <MessageCard key={step.id} step={step} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredMessages.length === 0 && (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No messages match the current filter.
              </p>
            </div>
          )}
        </InteractiveArea>
      </div>
    </div>
  );
}
